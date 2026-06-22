# Guia Completo — Backend C# + Frontend React (do zero ao final)

---

## Menu

- [1. Configuração inicial do Git](#1-configuração-inicial-do-git)
- [2. Criando o Backend (ASP.NET Core)](#2-criando-o-backend-aspnet-core)
- [3. Instalando os pacotes do Backend](#3-instalando-os-pacotes-do-backend)
- [4. Criando o Model](#4-criando-o-model)
- [5. Criando o AppDataContext](#5-criando-o-appdatacontext)
- [6. Configurando o Program.cs](#6-configurando-o-programcs)
- [7. Rodando as Migrations](#7-rodando-as-migrations)
- [8. Testando o Backend](#8-testando-o-backend)
- [9. Criando o Frontend (React + TypeScript)](#9-criando-o-frontend-react--typescript)
- [10. Instalando dependências do Frontend](#10-instalando-dependências-do-frontend)
- [11. Criando o Model TypeScript](#11-criando-o-model-typescript)
- [12. Criando o serviço de API (axios)](#12-criando-o-serviço-de-api-axios)
- [13. Criando os componentes de página](#13-criando-os-componentes-de-página)
- [14. Configurando o App.tsx](#14-configurando-o-apptsx)
- [15. Rodando o projeto](#15-rodando-o-projeto)
- [16. Commits Git ao longo do projeto](#16-commits-git-ao-longo-do-projeto)
- [17. Clonando o repositório e restaurando dependências](#17-clonando-o-repositório-e-restaurando-dependências)

---

## 1. Configuração inicial do Git

```bash
git init
```
> Inicializa um repositório Git vazio na pasta atual.

```bash
git config --global user.name "Seu Nome"
```
> Define o nome do autor que aparecerá nos commits.

```bash
git config --global user.email "seuemail@email.com"
```
> Define o e-mail do autor que aparecerá nos commits.

---

## 2. Criando o Backend (ASP.NET Core)

```bash
dotnet new web -n Backend
```
> Cria um novo projeto ASP.NET Core vazio com o nome "Backend".

```bash
cd Backend
```
> Entra na pasta do projeto backend.

---

## 3. Instalando os pacotes do Backend

```bash
dotnet add package Microsoft.EntityFrameworkCore.Sqlite --version 8.0.27
```
> Instala o pacote do Entity Framework Core com suporte ao banco SQLite.

```bash
dotnet add package Microsoft.EntityFrameworkCore.Design --version 8.0.27
```
> Instala o pacote de design do EF Core, necessário para rodar migrations.

```bash
dotnet tool install --global dotnet-ef
```
> Instala a ferramenta de linha de comando do Entity Framework Core globalmente. Necessária para criar e aplicar migrations.

---

## 4. Criando o Model

Dentro da pasta `Backend`, crie a pasta `Models` e o arquivo `NomeDoModelo.cs`:

```bash
mkdir Models
```
> Cria a pasta Models dentro do projeto.

**Arquivo: `Models/Livro.cs`**
```csharp
namespace Backend.Models;

public class Livro
{
    public int Id { get; set; }
    public string? Nome { get; set; }
    public string? Autor { get; set; }
    public bool EstaDisponivel { get; set; } = true;
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
```
> Define a entidade Livro que será mapeada para uma tabela no banco de dados. Cada propriedade vira uma coluna.

---

## 5. Criando o AppDataContext

**Arquivo: `Models/AppDataContext.cs`**
```csharp
using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDataContext : DbContext
{
    public DbSet<Livro> Livros { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=app.db");
    }
}
```
> O `AppDataContext` é a ponte entre o código C# e o banco de dados. O `DbSet<Livro>` representa a tabela de livros. O `OnConfiguring` define qual banco usar (SQLite neste caso).

---

## 6. Configurando o Program.cs

**Arquivo: `Program.cs`** — substitua o conteúdo padrão por:

```csharp
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

// POST: /api/livro/popular
app.MapPost("/api/livro/popular", (AppDataContext ctx) =>
{
    List<Livro> livros = new List<Livro>()
    {
        new() { Nome = "Clean Code", Autor = "Robert C. Martin", CriadoEm = DateTime.Now },
        new() { Nome = "Clean Architecture", Autor = "Robert C. Martin", CriadoEm = DateTime.Now },
        new() { Nome = "Refactoring", Autor = "Martin Fowler", CriadoEm = DateTime.Now },
    };
    ctx.Livros.AddRange(livros);
    ctx.SaveChanges();
    return Results.Created("", livros);
});

// POST: /api/livro/cadastrar
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

// GET: /api/livro/listar
app.MapGet("/api/livro/listar", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Livros.Any())
    {
        return Results.Ok(ctx.Livros.ToList());
    }
    return Results.NotFound("Lista vazia!");
});

// GET: /api/livro/buscar/{nome}
app.MapGet("/api/livro/buscar/{nome}", ([FromRoute] string nome, [FromServices] AppDataContext ctx) =>
{
    Livro? resultado = ctx.Livros.FirstOrDefault(x => x.Nome == nome);
    if (resultado is not null)
    {
        return Results.Ok(resultado);
    }
    return Results.NotFound("Livro não encontrado!");
});

// PUT: /api/livro/emprestar/{id}
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

// PUT: /api/livro/devolver/{id}
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

// GET: /api/livro/disponiveis
app.MapGet("/api/livro/disponiveis", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Livros.Where(x => x.EstaDisponivel == true).Any())
    {
        return Results.Ok(ctx.Livros.Where(x => x.EstaDisponivel == true).ToList());
    }
    return Results.NotFound("Lista vazia!");
});

// GET: /api/livro/emprestados
app.MapGet("/api/livro/emprestados", ([FromServices] AppDataContext ctx) =>
{
    if (ctx.Livros.Where(x => x.EstaDisponivel == false).Any())
    {
        return Results.Ok(ctx.Livros.Where(x => x.EstaDisponivel == false).ToList());
    }
    return Results.NotFound("Lista vazia!");
});

app.UseCors("Acesso Total");

app.Run();
```
> O `Program.cs` registra todos os endpoints da API. Cada `MapGet`/`MapPost`/`MapPut` define uma rota. O CORS com "Acesso Total" permite que o frontend (em outra porta) acesse o backend sem bloqueio.

---

## 7. Rodando as Migrations

```bash
dotnet ef migrations add InitialCreate
```
> Cria a primeira migration com base nos models definidos. Gera os arquivos de migração na pasta `Migrations/`.

```bash
dotnet ef database update
```
> Aplica a migration ao banco de dados, criando o arquivo `.db` e as tabelas.

---

## 8. Testando o Backend

```bash
dotnet run
```
> Compila e executa o backend. Anote a porta exibida no terminal (ex: `http://localhost:5063`), pois será usada no frontend.

---

## 9. Criando o Frontend (React + TypeScript)

Abra um **novo terminal** e volte para a pasta raiz do projeto:

```bash
cd ..
```
> Sai da pasta Backend e volta para a pasta raiz.

```bash
npx create-react-app front --template typescript
```
> Cria um novo projeto React com TypeScript na pasta `front`. O `--template typescript` configura o projeto para usar `.tsx` e `.ts` ao invés de `.js`.

```bash
cd front
```
> Entra na pasta do projeto frontend.

---

## 10. Instalando dependências do Frontend

```bash
npm install axios
```
> Instala o axios, biblioteca usada para fazer requisições HTTP para o backend.

```bash
npm install react-router-dom
```
> Instala o react-router-dom, usado para navegação entre páginas (rotas) dentro do React.

---

## 11. Criando o Model TypeScript

Dentro de `src`, crie a pasta `models` e o arquivo:

**Arquivo: `src/models/Livro.ts`**
```typescript
export default interface Livro {
    id?: number;
    nome?: string;
    autor?: string;
    estaDisponivel?: boolean;
    criadoEm?: string;
}
```
> Define a interface TypeScript que representa um Livro. Os campos opcionais (`?`) permitem usar o mesmo tipo tanto para criar (sem id) quanto para listar (com id). Os nomes devem estar em **camelCase** igual ao JSON que o backend retorna.

---

## 12. Criando o serviço de API (axios)

Dentro de `src`, crie a pasta `services` e o arquivo:

**Arquivo: `src/services/api.ts`**
```typescript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5063"
})

export default api;
```
> Cria uma instância do axios já configurada com a URL base do backend. Ao importar `api` nos componentes, não precisa repetir a URL em cada requisição. **Atenção:** a porta deve ser a mesma exibida ao rodar `dotnet run`.

---

## 13. Criando os componentes de página

Crie a estrutura de pastas dentro de `src`:

```
src/
  components/
    pages/
      livro/
        ListarLivro.tsx
        CadastrarLivro.tsx
        BuscarLivro.tsx
        LivrosDisponiveis.tsx
        LivrosEmprestados.tsx
```

---

### ListarLivro.tsx

**Arquivo: `src/components/pages/livro/ListarLivro.tsx`**
```tsx
import { useEffect, useState } from "react";
import api from "../../../services/api";
import Livro from "../../../models/Livro";

function ListarLivros() {

    const [livros, setLivros] = useState<Livro[]>([]);

    useEffect(() => {
        carregarLivrosAPI();
    }, [])

    async function carregarLivrosAPI() {
        try {
            const resposta = await api.get<Livro[]>("/api/livro/listar");
            setLivros(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function emprestarLivro(id: number) {
        try {
            await api.put(`/api/livro/emprestar/${id}`);
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    async function devolverLivro(id: number) {
        try {
            await api.put(`/api/livro/devolver/${id}`);
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    async function popularAPI() {
        try {
            await api.post("/api/livro/popular");
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Listar Livros</h1>
            <button onClick={popularAPI}>Popular</button>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Autor</th>
                        <th>Disponível</th>
                        <th>Criado Em</th>
                        <th>Emprestar</th>
                        <th>Devolver</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro: any) => (
                        <tr key={livro.id}>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.estaDisponivel ? "Sim" : "Não"}</td>
                            <td>{livro.criadoEm}</td>
                            <td>
                                <button onClick={() => emprestarLivro(livro.id)}>Emprestar</button>
                            </td>
                            <td>
                                <button onClick={() => devolverLivro(livro.id)}>Devolver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarLivros;
```
> `useEffect` com array vazio `[]` roda apenas uma vez quando o componente carrega. `useState` guarda a lista de livros. As funções `emprestarLivro` e `devolverLivro` fazem PUT e recarregam a lista logo em seguida.

---

### CadastrarLivro.tsx

**Arquivo: `src/components/pages/livro/CadastrarLivro.tsx`**
```tsx
import { useState } from "react";
import Livro from "../../../models/Livro";
import api from "../../../services/api";

function CadastrarLivro() {

    const [nome, setNome] = useState("");
    const [autor, setAutor] = useState("");

    async function enviarLivroAPI(e: any) {
        e.preventDefault();
        try {
            const livro: Livro = { nome, autor };
            const resposta = await api.post("/api/livro/cadastrar", livro);
            setNome("");
            setAutor("");
            console.log(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Cadastrar Livro</h1>
            <form onSubmit={enviarLivroAPI}>
                <div>
                    <label>Nome:</label>
                    <input value={nome} required type="text" onChange={(e: any) => { setNome(e.target.value) }} />
                </div>
                <div>
                    <label>Autor:</label>
                    <input value={autor} required type="text" onChange={(e: any) => { setAutor(e.target.value) }} />
                </div>
                <div>
                    <button type="submit">Cadastrar</button>
                </div>
            </form>
        </div>
    )
}

export default CadastrarLivro;
```
> `e.preventDefault()` impede o comportamento padrão do formulário (recarregar a página). Após enviar, os campos são limpos com `setNome("")` e `setAutor("")`.

---

### BuscarLivro.tsx

**Arquivo: `src/components/pages/livro/BuscarLivro.tsx`**
```tsx
import { useState } from "react";
import Livro from "../../../models/Livro";
import api from "../../../services/api";

function BuscarLivro() {

    const [nome, setNome] = useState("");
    const [livro, setLivro] = useState<Livro | null>(null);
    const [mensagem, setMensagem] = useState("");

    async function buscarLivroAPI(e: any) {
        e.preventDefault();
        try {
            const resposta = await api.get<Livro>(`/api/livro/buscar/${nome}`);
            setLivro(resposta.data);
            setMensagem("");
        } catch (error) {
            setLivro(null);
            setMensagem("Livro não encontrado!");
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Buscar Livro</h1>
            <form onSubmit={buscarLivroAPI}>
                <div>
                    <label>Nome:</label>
                    <input value={nome} required type="text" onChange={(e: any) => { setNome(e.target.value) }} />
                </div>
                <div>
                    <button type="submit">Buscar</button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {livro && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Autor</th>
                            <th>Disponível</th>
                            <th>Criado Em</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.estaDisponivel ? "Sim" : "Não"}</td>
                            <td>{livro.criadoEm}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default BuscarLivro;
```
> `useState<Livro | null>(null)` significa que o estado pode ser um Livro ou nulo. A renderização condicional `{livro && ...}` só mostra a tabela quando um livro foi encontrado.

---

### LivrosDisponiveis.tsx

**Arquivo: `src/components/pages/livro/LivrosDisponiveis.tsx`**
```tsx
import { useEffect, useState } from "react";
import api from "../../../services/api";
import Livro from "../../../models/Livro";

function LivrosDisponiveis() {

    const [livros, setLivros] = useState<Livro[]>([]);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarLivrosAPI();
    }, [])

    async function carregarLivrosAPI() {
        try {
            const resposta = await api.get<Livro[]>("/api/livro/disponiveis");
            setLivros(resposta.data);
            setMensagem("");
        } catch (error) {
            setLivros([]);
            setMensagem("Nenhum livro disponível!");
            console.log(error);
        }
    }

    async function emprestarLivro(id: number) {
        try {
            await api.put(`/api/livro/emprestar/${id}`);
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Livros Disponíveis</h1>
            {mensagem && <p>{mensagem}</p>}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Autor</th>
                        <th>Criado Em</th>
                        <th>Emprestar</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro: any) => (
                        <tr key={livro.id}>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.criadoEm}</td>
                            <td>
                                <button onClick={() => emprestarLivro(livro.id)}>Emprestar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LivrosDisponiveis;
```
> Filtra apenas livros onde `EstaDisponivel == true`, mostrando só eles. Após emprestar, recarrega a lista para atualizar a tela.

---

### LivrosEmprestados.tsx

**Arquivo: `src/components/pages/livro/LivrosEmprestados.tsx`**
```tsx
import { useEffect, useState } from "react";
import api from "../../../services/api";
import Livro from "../../../models/Livro";

function LivrosEmprestados() {

    const [livros, setLivros] = useState<Livro[]>([]);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarLivrosAPI();
    }, [])

    async function carregarLivrosAPI() {
        try {
            const resposta = await api.get<Livro[]>("/api/livro/emprestados");
            setLivros(resposta.data);
            setMensagem("");
        } catch (error) {
            setLivros([]);
            setMensagem("Nenhum livro emprestado!");
            console.log(error);
        }
    }

    async function devolverLivro(id: number) {
        try {
            await api.put(`/api/livro/devolver/${id}`);
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Livros Emprestados</h1>
            {mensagem && <p>{mensagem}</p>}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Autor</th>
                        <th>Criado Em</th>
                        <th>Devolver</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro: any) => (
                        <tr key={livro.id}>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.criadoEm}</td>
                            <td>
                                <button onClick={() => devolverLivro(livro.id)}>Devolver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LivrosEmprestados;
```
> Filtra apenas livros onde `EstaDisponivel == false`. Após devolver, recarrega a lista automaticamente.

---

## 14. Configurando o App.tsx

**Arquivo: `src/App.tsx`** — substitua o conteúdo padrão por:
```tsx
import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ListarLivros from './components/pages/livro/ListarLivro';
import CadastrarLivro from './components/pages/livro/CadastrarLivro';
import BuscarLivro from './components/pages/livro/BuscarLivro';
import LivrosDisponiveis from './components/pages/livro/LivrosDisponiveis';
import LivrosEmprestados from './components/pages/livro/LivrosEmprestados';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/pages/livro/cadastrar">Cadastrar Livro</Link>
            </li>
            <li>
              <Link to="/pages/livro/buscar">Buscar Livro</Link>
            </li>
            <li>
              <Link to="/pages/livro/disponiveis">Disponíveis</Link>
            </li>
            <li>
              <Link to="/pages/livro/emprestados">Emprestados</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListarLivros />} />
          <Route path="/pages/livro/cadastrar" element={<CadastrarLivro />} />
          <Route path="/pages/livro/buscar" element={<BuscarLivro />} />
          <Route path="/pages/livro/disponiveis" element={<LivrosDisponiveis />} />
          <Route path="/pages/livro/emprestados" element={<LivrosEmprestados />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```
> `BrowserRouter` envolve toda a aplicação para habilitar o roteamento. `Link` cria links de navegação sem recarregar a página. `Routes` + `Route` mapeiam cada URL para um componente.

---

## 15. Rodando o projeto

### Terminal 1 — Backend:
```bash
cd Backend
dotnet run
```
> Sobe o servidor C# na porta configurada (ex: `http://localhost:5063`).

### Terminal 2 — Frontend:
```bash
cd front
npm start
```
> Sobe o servidor de desenvolvimento do React na porta 3000. Abre automaticamente em `http://localhost:3000`.

---

## 16. Commits Git ao longo do projeto

Faça commits em momentos importantes para salvar o histórico:

```bash
git add .
```
> Adiciona todos os arquivos modificados à área de staging (prepara para commit).

```bash
git commit -m "Adiciona model Livro e AppDataContext"
```
> Salva um ponto no histórico com a mensagem descritiva. Use mensagens claras sobre o que foi feito.

```bash
git add .
git commit -m "Configura endpoints no Program.cs"
```
> Commit após terminar os endpoints do backend.

```bash
git add .
git commit -m "Cria migration inicial e banco SQLite"
```
> Commit após rodar `dotnet ef migrations add` e `dotnet ef database update`.

```bash
git add .
git commit -m "Cria projeto React com TypeScript"
```
> Commit após criar o projeto frontend com `npx create-react-app`.

```bash
git add .
git commit -m "Adiciona axios, react-router-dom e configura api.ts"
```
> Commit após instalar as dependências e criar o serviço de API.

```bash
git add .
git commit -m "Cria componentes de pagina: listar, cadastrar, buscar, disponiveis, emprestados"
```
> Commit após criar todos os componentes de página.

```bash
git add .
git commit -m "Configura rotas no App.tsx"
```
> Commit final após configurar a navegação.

---

## 17. Clonando o repositório e restaurando dependências

Ao clonar o repositório, as pastas `bin/`, `obj/` e `node_modules/` não vêm junto (ficam no `.gitignore`). Use os comandos abaixo para recriá-las:

```bash
git clone https://github.com/maxlopesgarcia/Guia-DotNet-react-a1.git
cd Guia-DotNet-react-a1/CorrecaoPrimeiraProvaMaisFrontEAlgumasCoisasExtras
```
> Clona o repositório e entra na pasta do exercício.

**Backend — restaurar pacotes NuGet:**
```bash
cd Backend
dotnet restore
```
> Baixa todos os pacotes NuGet listados no `.csproj`. Recria a pasta `obj/` automaticamente.

**Frontend — restaurar node_modules:**
```bash
cd ../front
npm install
```
> Baixa todas as dependências listadas no `package.json`. Recria a pasta `node_modules/`.

Após isso, o projeto está pronto para rodar normalmente com `dotnet run` no Backend e `npm start` no Frontend.

---

## Estrutura final do projeto

```
projeto/
├── Backend/
│   ├── Models/
│   │   ├── Livro.cs
│   │   └── AppDataContext.cs
│   ├── Migrations/
│   ├── Program.cs
│   ├── app.db
│   └── Backend.csproj
└── front/
    └── src/
        ├── models/
        │   └── Livro.ts
        ├── services/
        │   └── api.ts
        ├── components/
        │   └── pages/
        │       └── livro/
        │           ├── ListarLivro.tsx
        │           ├── CadastrarLivro.tsx
        │           ├── BuscarLivro.tsx
        │           ├── LivrosDisponiveis.tsx
        │           └── LivrosEmprestados.tsx
        └── App.tsx
```
