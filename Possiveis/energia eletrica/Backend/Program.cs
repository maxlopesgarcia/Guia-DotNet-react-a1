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

//POST: /api/conta/cadastrar
app.MapPost("/api/conta/cadastrar", ([FromBody] Conta conta, [FromServices] AppDataContext ctx) =>
{
    // Ano deve ser maior que 2000
    if (conta.Ano <= 2000)
    {
        return Results.BadRequest("O ano deve ser maior que 2000!");
    }

    // Mes deve ser entre 1 e 12
    if (conta.Mes < 1 || conta.Mes > 12)
    {
        return Results.BadRequest("O mês deve ser entre 1 e 12!");
    }

    // Consumo não pode ser negativo
    if (conta.Consumo < 0)
    {
        return Results.BadRequest("O consumo não pode ser menor que 0!");
    }

    // Bandeira deve ser válida
    string[] bandeirasValidas = { "Verde", "Amarela", "Vermelha" };
    if (!bandeirasValidas.Contains(conta.Bandeira))
    {
        return Results.BadRequest("Bandeira inválida! Use: Verde, Amarela ou Vermelha.");
    }

    // Não pode ter duas contas para o mesmo CPF no mesmo mês e ano
    Conta? contaExistente = ctx.Contas.FirstOrDefault(
        x => x.Cpf == conta.Cpf && x.Mes == conta.Mes && x.Ano == conta.Ano);
    if (contaExistente is not null)
    {
        return Results.Conflict("Já existe uma conta para esse CPF neste mês!");
    }

    // Cálculo do valor total por faixa de kWh
    double valor = 0;
    double kwh = conta.Consumo;

    if (kwh <= 100)
    {
        valor = kwh * 0.70;
    }
    else if (kwh <= 300)
    {
        valor = (100 * 0.70) + ((kwh - 100) * 0.90);
    }
    else
    {
        valor = (100 * 0.70) + (200 * 0.90) + ((kwh - 300) * 1.20);
    }

    // Aplicar bandeira
    if (conta.Bandeira == "Amarela")
    {
        valor *= 1.15;
    }
    else if (conta.Bandeira == "Vermelha")
    {
        valor *= 1.30;
    }
    // Bandeira Verde: sem acréscimo

    conta.ValorTotal = valor;

    ctx.Contas.Add(conta);
    ctx.SaveChanges();
    return Results.Created("", conta);
});

//GET: /api/conta/listar
app.MapGet("/api/conta/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Contas.Any())
    {
        return Results.Ok(ctx.Contas.ToList());
    }
    return Results.NotFound("Nenhuma conta cadastrada!");
});

//GET: /api/conta/buscar/{cpf}
app.MapGet("/api/conta/buscar/{cpf}", ([FromRoute] string cpf, [FromServices] AppDataContext ctx) =>
{
    List<Conta> contas = ctx.Contas.Where(x => x.Cpf == cpf).ToList();
    if (contas.Any())
    {
        return Results.Ok(contas);
    }
    return Results.NotFound("Nenhuma conta encontrada para esse CPF!");
});

//GET: /api/conta/divida/{cpf}
app.MapGet("/api/conta/divida/{cpf}", ([FromRoute] string cpf, [FromServices] AppDataContext ctx) =>
{
    List<Conta> contas = ctx.Contas.Where(x => x.Cpf == cpf).ToList();
    if (contas.Any())
    {
        double totalDivida = contas.Sum(x => x.ValorTotal);
        return Results.Ok(new { cpf, totalDivida });
    }
    return Results.NotFound("Nenhuma conta encontrada para esse CPF!");
});

//GET: /api/conta/disponiveis (bandeira verde)
app.MapGet("/api/conta/bandeira/{bandeira}", ([FromRoute] string bandeira, [FromServices] AppDataContext ctx) =>
{
    List<Conta> contas = ctx.Contas.Where(x => x.Bandeira == bandeira).ToList();
    if (contas.Any())
    {
        return Results.Ok(contas);
    }
    return Results.NotFound($"Nenhuma conta com bandeira {bandeira} encontrada!");
});

app.UseCors("Acesso Total");

app.Run();
