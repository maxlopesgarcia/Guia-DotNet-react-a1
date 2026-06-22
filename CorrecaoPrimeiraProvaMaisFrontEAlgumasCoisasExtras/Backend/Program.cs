using Deconto.Models;
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

//POST: /api/livro/popular
app.MapPost("/api/livro/popular", (AppDataContext ctx) =>
{
    List<Livro> livros = new List<Livro>()
    {
        new() { Nome = "Clean Code", Autor = "Robert C. Martin", CriadoEm = DateTime.Now },
        new() { Nome = "Clean Architecture", Autor = "Robert C. Martin", CriadoEm = DateTime.Now },
        new() { Nome = "Refactoring", Autor = "Martin Fowler", CriadoEm = DateTime.Now },
        new() { Nome = "Domain-Driven Design", Autor = "Eric Evans", CriadoEm = DateTime.Now },
        new() { Nome = "Design Patterns", Autor = "GoF", CriadoEm = DateTime.Now },
        new() { Nome = "The Pragmatic Programmer", Autor = "Andrew Hunt", CriadoEm = DateTime.Now },
        new() { Nome = "Code Complete", Autor = "Steve McConnell", CriadoEm = DateTime.Now },
        new() { Nome = "Patterns of Enterprise Application Architecture", Autor = "Martin Fowler", CriadoEm = DateTime.Now },
        new() { Nome = "Head First Design Patterns", Autor = "Eric Freeman", CriadoEm = DateTime.Now },
        new() { Nome = "Working Effectively with Legacy Code", Autor = "Michael Feathers", CriadoEm = DateTime.Now }
    };

    ctx.Livros.AddRange(livros);
    ctx.SaveChanges();

    return Results.Created("", livros);
});

//POST: /api/livro/cadastrar
app.MapPost("/api/livro/cadastrar", ([FromBody] Livro livro, [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.FirstOrDefault(x => x.Nome == livro.Nome);
    if (resultado is null)
    {
        ctx.Livros.Add(livro);
        ctx.SaveChanges();
        return Results.Created("", livro);
    }
    return Results.Conflict("Esse livro já existe!");
});

//GET: /api/livro/listar
app.MapGet("/api/livro/listar",
    ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Livros.Any())
    {
        //Configurar a resposta da requisição
        return Results.Ok(ctx.Livros.ToList());
    }
    return Results.NotFound("Lista de produtos vazia!");
});

//GET: /api/livro/buscar/{nome}
app.MapGet("/api/livro/buscar/{nome}",
    ([FromRoute] string nome,
    [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.FirstOrDefault(x => x.Nome == nome);

    if (resultado is not null)
    {
        return Results.Ok(resultado);
    }

    return Results.NotFound("Livro não encontrado!");
});

//PUT: /api/livro/emprestar/{id}
app.MapPut("/api/livro/emprestar/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.Find(id);

    if (resultado is not null)
    {
        if (resultado.EstaDisponivel == true)
        {
            resultado.EstaDisponivel = false;
            ctx.Livros.Update(resultado);
            ctx.SaveChanges();
            return Results.Ok("Livro Emprestado");
        }
        return Results.Ok("O livro não está disponível");
    }
    return Results.NotFound("Livro não encontrado!");
});

//PUT: /api/livro/delvolver/{id}
app.MapPut("/api/livro/devolver/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.Find(id);

    if (resultado is not null)
    {
        if (resultado.EstaDisponivel == false)
        {
            resultado.EstaDisponivel = true;
            ctx.Livros.Update(resultado);
            ctx.SaveChanges();
            return Results.Ok("Livro Devolvido");
        }
        return Results.Ok("O livro já está disponível");
    }
    return Results.NotFound("Livro não encontrado!");
});

//GET: /api/livro/disponiveis
app.MapGet("/api/livro/disponiveis",
    ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Livros.Where(x => x.EstaDisponivel == true).Any())
    {
        //Configurar a resposta da requisição
        return Results.Ok(ctx.Livros.Where(x => x.EstaDisponivel == true).ToList());
    }
    return Results.NotFound("Lista de livros vazia!");
});

//GET: /api/livro/emprestados
app.MapGet("/api/livro/emprestados",
    ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Livros.Where(x => x.EstaDisponivel == false).Any())
    {
        //Configurar a resposta da requisição
        return Results.Ok(ctx.Livros.Where(x => x.EstaDisponivel == false).ToList());
    }
    return Results.NotFound("Lista de livros vazia!");
});

//DELETE: /api/livro/deletar/{id}
app.MapDelete("/api/livro/deletar/{id}", ([FromRoute] int id, [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.Find(id);

    if (resultado is not null)
    {
        ctx.Livros.Remove(resultado);
        ctx.SaveChanges();
        return Results.Ok("Livro deletado com sucesso!");
    }
    return Results.NotFound("Livro não encontrado!");
});

//PUT: /api/livro/alterar/{id}
app.MapPut("/api/livro/alterar/{id}", ([FromRoute] int id, [FromBody] Livro livroAtualizado, [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.Find(id);

    if (resultado is not null)
    {
        resultado.Nome = livroAtualizado.Nome;
        resultado.Autor = livroAtualizado.Autor;
        ctx.Livros.Update(resultado);
        ctx.SaveChanges();
        return Results.Ok(resultado);
    }
    return Results.NotFound("Livro não encontrado!");
});

app.UseCors("Acesso Total");

app.Run();
