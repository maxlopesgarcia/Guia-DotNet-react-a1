# Sistema Escolar — Alunos e Notas

## Regras de Negócio

---

### POST /api/aluno/cadastrar
Cadastra um aluno com suas três notas.

**Envia:**
```json
{
  "ra": "2024001",
  "nome": "João Silva",
  "nota1": 8.0,
  "nota2": 6.5,
  "nota3": 7.0
}
```

**Validações (nessa ordem):**
- Notas devem estar **entre 0 e 10** → senão retorna `400 Bad Request`
- RA deve ser **único** → senão retorna `409 Conflict`

**Cálculos feitos dentro do POST:**
1. `media = (nota1 + nota2 + nota3) / 3`
2. Situação baseada na média:
   - Média >= 7.0 → `"Aprovado"`
   - Média >= 5.0 e < 7.0 → `"Recuperação"`
   - Média < 5.0 → `"Reprovado"`

**Retorna em caso de sucesso:** `201 Created` com o aluno incluindo `media` e `situacao` calculados.

---

### GET /api/aluno/listar
Lista todos os alunos cadastrados.

**Retorna:**
- `200 OK` com a lista de alunos
- `404 Not Found` se não houver nenhum aluno

---

### GET /api/aluno/buscar/{ra}
Busca um aluno pelo RA.

**Retorna:**
- `200 OK` com o aluno encontrado
- `404 Not Found` se o RA não existir

---

### GET /api/aluno/aprovados
Lista todos os alunos com situação `"Aprovado"`.

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhum

---

### GET /api/aluno/reprovados
Lista todos os alunos com situação `"Reprovado"`.

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhum

---

### GET /api/aluno/recuperacao
Lista todos os alunos com situação `"Recuperação"`.

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhum

---

## Exemplo de cálculo completo

**Entrada:** nota1 = 8.0, nota2 = 5.0, nota3 = 6.0

1. `media = (8.0 + 5.0 + 6.0) / 3 = 6.33`
2. Média >= 5.0 e < 7.0 → **Situação: Recuperação**

---

## Como rodar

**Backend** (pasta `Backend`):
```
dotnet run
```

**Front** (pasta `front`):
```
npm start
```
