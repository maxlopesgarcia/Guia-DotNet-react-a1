# Guia de Pontos de Atenção — Prova React

## 1. CORS no Backend (C#)

O professor entrega o backend **sem CORS**. Sem isso, o front não consegue se comunicar com a API.

Adicionar no `Program.cs`, **antes** dos endpoints:

```csharp
builder.Services.AddCors(options =>
    options.AddPolicy("Acesso Total",
        configs => configs
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod())
);
```

Adicionar **antes** do `app.Run()`:

```csharp
app.UseCors("Acesso Total");
```

---

## 2. URL da API no Front

Verificar a porta do backend em `Backend/Properties/launchSettings.json`, campo `applicationUrl`.

Atualizar em `src/services/api.ts`:

```ts
const api = axios.create({
    baseURL: "http://localhost:PORTA_AQUI"
})
```

---

## 3. Interface do Modelo (`src/models/`)

O modelo deve ter os **mesmos campos** que a classe C# do backend.

Exemplo — se o backend tem:
```csharp
public class Livro {
    public int Id { get; set; }
    public string? Nome { get; set; }
    public bool EstaDisponivel { get; set; } = true;
}
```

O modelo TypeScript deve ser:
```ts
export default interface Livro {
    id?: number;
    nome?: string;
    estaDisponivel?: boolean;
}
```

> Atenção: C# usa `PascalCase`, TypeScript usa `camelCase`. O JSON serializado pelo .NET já vem em `camelCase` automaticamente.

---

## 4. Endpoints — Verificar URLs e Métodos HTTP

Conferir cada endpoint no `Program.cs` do backend e garantir que o front chama corretamente:

| Método | Exemplo de endpoint | axios |
|--------|-------------------|-------|
| GET | `/api/livro/listar` | `api.get(...)` |
| POST | `/api/livro/cadastrar` | `api.post(...)` |
| PUT | `/api/livro/emprestar/{id}` | `api.put(...)` |
| DELETE | `/api/livro/deletar/{id}` | `api.delete(...)` |

---

## 5. Rotas no App.tsx

Cada página nova precisa de:
1. Import do componente
2. `<Link>` no nav
3. `<Route>` no `<Routes>`

```tsx
import MinhaPage from './components/pages/entidade/MinhaPage';

// no nav:
<Link to="/pages/entidade/minha">Minha Page</Link>

// nas rotas:
<Route path="/pages/entidade/minha" element={<MinhaPage />} />
```

---

## 6. Migrations (banco de dados)

Se o banco não existir, rodar na pasta `Backend`:

```
dotnet ef migrations add InitialCreate
dotnet ef database update
```

---

## 7. Comandos para rodar o projeto

**Backend** (pasta `Backend`):
```
dotnet run
```

**Front** (pasta `front`):
```
npm start
```
