using Backend.Models;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();
builder.Services.AddCors(options =>
    options.AddPolicy("Acesso Total",
        configs => configs
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod())
);
var app = builder.Build();

//POST: /api/abastecimento/cadastrar
app.MapPost("/api/abastecimento/cadastrar", ([FromBody] Abastecimento abastecimento, [FromServices] AppDataContext ctx) =>
{
    // Litros devem ser maior que 0
    if (abastecimento.Litros <= 0)
    {
        return Results.BadRequest("A quantidade de litros deve ser maior que 0!");
    }

    // Tipo deve ser válido
    string[] tiposValidos = { "Gasolina", "Etanol", "Diesel" };
    if (!tiposValidos.Contains(abastecimento.Tipo))
    {
        return Results.BadRequest("Tipo inválido! Use: Gasolina, Etanol ou Diesel.");
    }

    // Mesma placa não pode abastecer duas vezes no mesmo dia
    Abastecimento? abastecimentoExistente = ctx.Abastecimentos.FirstOrDefault(
        x => x.Placa == abastecimento.Placa &&
             x.CriadoEm.Date == DateTime.Now.Date);
    if (abastecimentoExistente is not null)
    {
        return Results.Conflict("Essa placa já foi abastecida hoje!");
    }

    // Preço por litro conforme o tipo
    if (abastecimento.Tipo == "Gasolina")
    {
        abastecimento.PrecoPorLitro = 6.50;
    }
    else if (abastecimento.Tipo == "Etanol")
    {
        abastecimento.PrecoPorLitro = 4.50;
    }
    else if (abastecimento.Tipo == "Diesel")
    {
        abastecimento.PrecoPorLitro = 5.80;
    }

    // Cálculo do valor bruto
    double valorBruto = abastecimento.Litros * abastecimento.PrecoPorLitro;

    // Desconto por faixa de litros
    if (abastecimento.Litros > 100)
    {
        abastecimento.Desconto = valorBruto * 0.10; // 10%
    }
    else if (abastecimento.Litros > 50)
    {
        abastecimento.Desconto = valorBruto * 0.05; // 5%
    }
    else
    {
        abastecimento.Desconto = 0;
    }

    abastecimento.ValorTotal = valorBruto - abastecimento.Desconto;

    ctx.Abastecimentos.Add(abastecimento);
    ctx.SaveChanges();
    return Results.Created("", abastecimento);
});

//GET: /api/abastecimento/listar
app.MapGet("/api/abastecimento/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Abastecimentos.Any())
    {
        return Results.Ok(ctx.Abastecimentos.ToList());
    }
    return Results.NotFound("Nenhum abastecimento cadastrado!");
});

//GET: /api/abastecimento/buscar/{cpf}
app.MapGet("/api/abastecimento/buscar/{cpf}", ([FromRoute] string cpf, [FromServices] AppDataContext ctx) =>
{
    List<Abastecimento> abastecimentos = ctx.Abastecimentos
        .Where(x => x.Cpf == cpf).ToList();
    if (abastecimentos.Any())
    {
        return Results.Ok(abastecimentos);
    }
    return Results.NotFound("Nenhum abastecimento encontrado para esse CPF!");
});

//GET: /api/abastecimento/total/{cpf}
app.MapGet("/api/abastecimento/total/{cpf}", ([FromRoute] string cpf, [FromServices] AppDataContext ctx) =>
{
    List<Abastecimento> abastecimentos = ctx.Abastecimentos
        .Where(x => x.Cpf == cpf).ToList();
    if (abastecimentos.Any())
    {
        double totalGasto = abastecimentos.Sum(x => x.ValorTotal);
        return Results.Ok(new { cpf, totalGasto });
    }
    return Results.NotFound("Nenhum abastecimento encontrado para esse CPF!");
});

//GET: /api/abastecimento/tipo/{tipo}
app.MapGet("/api/abastecimento/tipo/{tipo}", ([FromRoute] string tipo, [FromServices] AppDataContext ctx) =>
{
    List<Abastecimento> abastecimentos = ctx.Abastecimentos
        .Where(x => x.Tipo == tipo).ToList();
    if (abastecimentos.Any())
    {
        return Results.Ok(abastecimentos);
    }
    return Results.NotFound($"Nenhum abastecimento do tipo {tipo} encontrado!");
});

//GET: /api/abastecimento/nota/{id}
app.MapGet("/api/abastecimento/nota/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Abastecimento? abastecimento = ctx.Abastecimentos.Find(id);
    if (abastecimento is not null)
    {
        double icms = abastecimento.ValorTotal * 0.25;
        double pisCofins = abastecimento.ValorTotal * 0.03;
        double totalComImpostos = abastecimento.ValorTotal + icms + pisCofins;

        return Results.Ok(new
        {
            abastecimento.Id,
            abastecimento.Cpf,
            abastecimento.Placa,
            abastecimento.Tipo,
            abastecimento.Litros,
            abastecimento.PrecoPorLitro,
            abastecimento.Desconto,
            abastecimento.ValorTotal,
            Icms = icms,
            PisCofins = pisCofins,
            TotalComImpostos = totalComImpostos,
            abastecimento.CriadoEm
        });
    }
    return Results.NotFound("Abastecimento não encontrado!");
});

//GET: /api/abastecimento/km/{placa}?kmPorLitro=10
app.MapGet("/api/abastecimento/km/{placa}", ([FromRoute] string placa, [FromQuery] double kmPorLitro, [FromServices] AppDataContext ctx) =>
{
    if (kmPorLitro <= 0)
    {
        return Results.BadRequest("Km por litro deve ser maior que 0!");
    }

    Abastecimento? abastecimento = ctx.Abastecimentos
        .Where(x => x.Placa == placa)
        .OrderByDescending(x => x.CriadoEm)
        .FirstOrDefault();

    if (abastecimento is not null)
    {
        double kmEstimado = abastecimento.Litros * kmPorLitro;
        return Results.Ok(new
        {
            abastecimento.Placa,
            abastecimento.Tipo,
            abastecimento.Litros,
            KmPorLitro = kmPorLitro,
            KmEstimado = kmEstimado
        });
    }
    return Results.NotFound("Nenhum abastecimento encontrado para essa placa!");
});

app.UseCors("Acesso Total");

app.Run();
