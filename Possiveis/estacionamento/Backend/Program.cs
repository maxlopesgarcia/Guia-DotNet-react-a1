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

//POST: /api/veiculo/entrada
app.MapPost("/api/veiculo/entrada", ([FromBody] Veiculo veiculo, [FromServices] AppDataContext ctx) =>
{
    // Tipo deve ser válido
    string[] tiposValidos = { "Carro", "Moto", "Caminhao" };
    if (!tiposValidos.Contains(veiculo.Tipo))
    {
        return Results.BadRequest("Tipo inválido! Use: Carro, Moto ou Caminhao.");
    }

    // Placa não pode estar estacionada no momento
    Veiculo? veiculoAtivo = ctx.Veiculos.FirstOrDefault(
        x => x.Placa == veiculo.Placa && x.Status == "Estacionado");
    if (veiculoAtivo is not null)
    {
        return Results.Conflict("Essa placa já está estacionada!");
    }

    veiculo.HoraEntrada = DateTime.Now;
    veiculo.Status = "Estacionado";
    veiculo.HoraSaida = null;
    veiculo.HorasEstacionado = null;
    veiculo.ValorTotal = null;

    ctx.Veiculos.Add(veiculo);
    ctx.SaveChanges();
    return Results.Created("", veiculo);
});

//PUT: /api/veiculo/saida/{id}
app.MapPut("/api/veiculo/saida/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Veiculo? veiculo = ctx.Veiculos.Find(id);

    if (veiculo is null)
    {
        return Results.NotFound("Veículo não encontrado!");
    }

    if (veiculo.Status == "Finalizado")
    {
        return Results.BadRequest("Esse veículo já realizou a saída!");
    }

    veiculo.HoraSaida = DateTime.Now;

    // Cálculo das horas estacionado
    double horasEstacionado = (veiculo.HoraSaida.Value - veiculo.HoraEntrada).TotalHours;
    veiculo.HorasEstacionado = horasEstacionado;

    // Tarifa por tipo de veículo (por hora, mínimo 1 hora)
    double horas = horasEstacionado < 1 ? 1 : Math.Ceiling(horasEstacionado);
    double tarifaPorHora = 0;

    if (veiculo.Tipo == "Moto")
    {
        tarifaPorHora = 5.00;
    }
    else if (veiculo.Tipo == "Carro")
    {
        tarifaPorHora = 10.00;
    }
    else if (veiculo.Tipo == "Caminhao")
    {
        tarifaPorHora = 20.00;
    }

    veiculo.ValorTotal = horas * tarifaPorHora;
    veiculo.Status = "Finalizado";

    ctx.Veiculos.Update(veiculo);
    ctx.SaveChanges();
    return Results.Ok(veiculo);
});

//GET: /api/veiculo/listar
app.MapGet("/api/veiculo/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Veiculos.Any())
    {
        return Results.Ok(ctx.Veiculos.ToList());
    }
    return Results.NotFound("Nenhum veículo registrado!");
});

//GET: /api/veiculo/estacionados
app.MapGet("/api/veiculo/estacionados", ([FromServices] AppDataContext ctx) =>
{
    List<Veiculo> veiculos = ctx.Veiculos
        .Where(x => x.Status == "Estacionado").ToList();
    if (veiculos.Any())
    {
        return Results.Ok(veiculos);
    }
    return Results.NotFound("Nenhum veículo estacionado no momento!");
});

//GET: /api/veiculo/buscar/{placa}
app.MapGet("/api/veiculo/buscar/{placa}", ([FromRoute] string placa, [FromServices] AppDataContext ctx) =>
{
    List<Veiculo> veiculos = ctx.Veiculos
        .Where(x => x.Placa == placa).ToList();
    if (veiculos.Any())
    {
        return Results.Ok(veiculos);
    }
    return Results.NotFound("Nenhum registro encontrado para essa placa!");
});

app.UseCors("Acesso Total");

app.Run();
