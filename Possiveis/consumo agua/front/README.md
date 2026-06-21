# Sistema de Contas de Água

## Regras de Negócio

---

### POST /api/conta/cadastrar
Cadastra uma conta de consumo de água para um CPF.

**Envia:**
```json
{
  "cpf": "123.456.789-00",
  "mes": 6,
  "ano": 2026,
  "consumo": 150,
  "bandeira": "Verde"
}
```

**Validações (nessa ordem):**
- Ano deve ser **maior que 2000** → senão retorna `400 Bad Request`
- Mês deve ser **entre 1 e 12** → senão retorna `400 Bad Request`
- Consumo **não pode ser menor que 0** → senão retorna `400 Bad Request`
- Não pode existir outra conta com o **mesmo CPF no mesmo mês/ano** → senão retorna `409 Conflict`

**Cálculos feitos dentro do POST:**
1. `consumoM3 = consumo / 10` (a cada 10 unidades = 1 m3)
2. Valor por faixa de m3:
   - 0 a 10 m3 → R$ 5,00 por m3
   - 11 a 20 m3 → R$ 7,00 por m3
   - Acima de 20 m3 → R$ 10,00 por m3
3. Aplicar bandeira sobre o valor:
   - Verde → sem acréscimo
   - Amarela → +10%
   - Vermelha → +20%

**Retorna em caso de sucesso:** `201 Created` com a conta cadastrada incluindo `consumoM3` e `valorTotal` calculados.

---

### GET /api/conta/listar
Lista todas as contas cadastradas.

**Retorna:**
- `200 OK` com a lista de contas
- `404 Not Found` se não houver nenhuma conta

---

### GET /api/conta/buscar/{cpf}
Busca todas as contas de um CPF específico.

**Retorna:**
- `200 OK` com a lista de contas do CPF
- `404 Not Found` se o CPF não tiver contas

---

### GET /api/conta/divida/{cpf}
Retorna o total de dívida de um CPF (soma de todos os `valorTotal`).

**Retorna:**
- `200 OK` com `{ "cpf": "...", "totalDivida": 99.99 }`
- `404 Not Found` se o CPF não tiver contas

---

## Exemplo de cálculo completo

**Entrada:** consumo = 250 unidades, bandeira = Amarela

1. `consumoM3 = 250 / 10 = 25 m3`
2. Valor:
   - 10 m3 × R$ 5,00 = R$ 50,00
   - 10 m3 × R$ 7,00 = R$ 70,00
   - 5 m3 × R$ 10,00 = R$ 50,00
   - Subtotal = R$ 170,00
3. Bandeira Amarela (+10%): R$ 170,00 × 1,10 = **R$ 187,00**

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
