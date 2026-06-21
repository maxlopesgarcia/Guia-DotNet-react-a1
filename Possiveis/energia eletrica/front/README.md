# Sistema de Contas de Energia Elétrica

## Regras de Negócio

---

### POST /api/conta/cadastrar
Cadastra uma conta de consumo de energia para um CPF.

**Envia:**
```json
{
  "cpf": "123.456.789-00",
  "mes": 6,
  "ano": 2026,
  "consumo": 350,
  "bandeira": "Amarela"
}
```

**Validações (nessa ordem):**
- Ano deve ser **maior que 2000** → senão retorna `400 Bad Request`
- Mês deve ser **entre 1 e 12** → senão retorna `400 Bad Request`
- Consumo **não pode ser menor que 0** → senão retorna `400 Bad Request`
- Bandeira deve ser **Verde, Amarela ou Vermelha** → senão retorna `400 Bad Request`
- Não pode existir outra conta com o **mesmo CPF no mesmo mês/ano** → senão retorna `409 Conflict`

**Cálculos feitos dentro do POST:**
1. Valor por faixa de kWh:
   - 0 a 100 kWh → R$ 0,70 por kWh
   - 101 a 300 kWh → R$ 0,90 por kWh
   - Acima de 300 kWh → R$ 1,20 por kWh
2. Aplicar bandeira sobre o valor:
   - Verde → sem acréscimo
   - Amarela → +15%
   - Vermelha → +30%

**Retorna em caso de sucesso:** `201 Created` com a conta cadastrada incluindo `valorTotal` calculado.

---

### GET /api/conta/listar
Lista todas as contas cadastradas.

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhuma

---

### GET /api/conta/buscar/{cpf}
Busca todas as contas de um CPF.

**Retorna:**
- `200 OK` com a lista de contas do CPF
- `404 Not Found` se não houver nenhuma

---

### GET /api/conta/divida/{cpf}
Retorna o total de dívida de um CPF.

**Retorna:**
- `200 OK` com `{ "cpf": "...", "totalDivida": 99.99 }`
- `404 Not Found` se o CPF não tiver contas

---

### GET /api/conta/bandeira/{bandeira}
Lista todas as contas de uma bandeira específica.

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhuma

---

## Exemplo de cálculo completo

**Entrada:** consumo = 350 kWh, bandeira = Amarela

1. Valor por faixa:
   - 100 kWh × R$ 0,70 = R$ 70,00
   - 200 kWh × R$ 0,90 = R$ 180,00
   - 50 kWh × R$ 1,20 = R$ 60,00
   - Subtotal = R$ 310,00
2. Bandeira Amarela (+15%): R$ 310,00 × 1,15 = **R$ 356,50**

---

## Diferenças em relação à Conta de Água

| | Água | Energia |
|--|------|---------|
| Unidade | m3 (consumo / 10) | kWh (direto) |
| Faixa 1 | 0-10 m3 → R$ 5,00 | 0-100 kWh → R$ 0,70 |
| Faixa 2 | 11-20 m3 → R$ 7,00 | 101-300 kWh → R$ 0,90 |
| Faixa 3 | 21+ m3 → R$ 10,00 | 301+ kWh → R$ 1,20 |
| Bandeira Amarela | +10% | +15% |
| Bandeira Vermelha | +20% | +30% |

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
