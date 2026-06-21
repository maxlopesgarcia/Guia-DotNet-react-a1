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

//POST: /api/aluno/cadastrar
app.MapPost("/api/aluno/cadastrar", ([FromBody] Aluno aluno, [FromServices] AppDataContext ctx) =>
{
    // Notas devem estar entre 0 e 10
    if (aluno.Nota1 < 0 || aluno.Nota1 > 10 ||
        aluno.Nota2 < 0 || aluno.Nota2 > 10 ||
        aluno.Nota3 < 0 || aluno.Nota3 > 10)
    {
        return Results.BadRequest("As notas devem estar entre 0 e 10!");
    }

    // RA deve ser único
    Aluno? alunoExistente = ctx.Alunos.FirstOrDefault(x => x.Ra == aluno.Ra);
    if (alunoExistente is not null)
    {
        return Results.Conflict("Já existe um aluno com esse RA!");
    }

    // Cálculo da média
    aluno.Media = (aluno.Nota1 + aluno.Nota2 + aluno.Nota3) / 3.0;

    // Cálculo da situação
    if (aluno.Media >= 7.0)
    {
        aluno.Situacao = "Aprovado";
    }
    else if (aluno.Media >= 5.0)
    {
        aluno.Situacao = "Recuperação";
    }
    else
    {
        aluno.Situacao = "Reprovado";
    }

    ctx.Alunos.Add(aluno);
    ctx.SaveChanges();
    return Results.Created("", aluno);
});

//GET: /api/aluno/listar
app.MapGet("/api/aluno/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Alunos.Any())
    {
        return Results.Ok(ctx.Alunos.ToList());
    }
    return Results.NotFound("Nenhum aluno cadastrado!");
});

//GET: /api/aluno/buscar/{ra}
app.MapGet("/api/aluno/buscar/{ra}", ([FromRoute] string ra, [FromServices] AppDataContext ctx) =>
{
    Aluno? aluno = ctx.Alunos.FirstOrDefault(x => x.Ra == ra);
    if (aluno is not null)
    {
        return Results.Ok(aluno);
    }
    return Results.NotFound("Aluno não encontrado!");
});

//GET: /api/aluno/aprovados
app.MapGet("/api/aluno/aprovados", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Alunos.Where(x => x.Situacao == "Aprovado").Any())
    {
        return Results.Ok(ctx.Alunos.Where(x => x.Situacao == "Aprovado").ToList());
    }
    return Results.NotFound("Nenhum aluno aprovado!");
});

//GET: /api/aluno/reprovados
app.MapGet("/api/aluno/reprovados", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Alunos.Where(x => x.Situacao == "Reprovado").Any())
    {
        return Results.Ok(ctx.Alunos.Where(x => x.Situacao == "Reprovado").ToList());
    }
    return Results.NotFound("Nenhum aluno reprovado!");
});

//GET: /api/aluno/recuperacao
app.MapGet("/api/aluno/recuperacao", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Alunos.Where(x => x.Situacao == "Recuperação").Any())
    {
        return Results.Ok(ctx.Alunos.Where(x => x.Situacao == "Recuperação").ToList());
    }
    return Results.NotFound("Nenhum aluno em recuperação!");
});

app.UseCors("Acesso Total");

app.Run();
