# Sistema de Posto de Combustível

## Regras de Negócio

---

### POST /api/abastecimento/cadastrar
Cadastra um abastecimento de veículo.

**Envia:**
```json
{
  "cpf": "123.456.789-00",
  "placa": "ABC1234",
  "tipo": "Gasolina",
  "litros": 60
}
```

**Validações (nessa ordem):**
- Litros deve ser **maior que 0** → senão retorna `400 Bad Request`
- Tipo deve ser **Gasolina, Etanol ou Diesel** → senão retorna `400 Bad Request`
- A mesma **placa não pode abastecer duas vezes no mesmo dia** → senão retorna `409 Conflict`

**Cálculos feitos dentro do POST:**
1. Preço por litro conforme o tipo:
   - Gasolina → R$ 6,50/L
   - Etanol → R$ 4,50/L
   - Diesel → R$ 5,80/L
2. Valor bruto = litros × preço por litro
3. Desconto por faixa de litros:
   - Até 50L → sem desconto
   - Acima de 50L → 5% de desconto
   - Acima de 100L → 10% de desconto
4. `valorTotal = valorBruto - desconto`

**Retorna em caso de sucesso:** `201 Created` com o abastecimento incluindo `precoPorLitro`, `desconto` e `valorTotal` calculados.

---

### GET /api/abastecimento/listar
Lista todos os abastecimentos.

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhum

---

### GET /api/abastecimento/buscar/{cpf}
Lista todos os abastecimentos de um CPF.

**Retorna:**
- `200 OK` com a lista de abastecimentos do CPF
- `404 Not Found` se não houver nenhum

---

### GET /api/abastecimento/total/{cpf}
Retorna o total gasto por um CPF.

**Retorna:**
- `200 OK` com `{ "cpf": "...", "totalGasto": 99.99 }`
- `404 Not Found` se o CPF não tiver abastecimentos

---

### GET /api/abastecimento/tipo/{tipo}
Lista todos os abastecimentos de um tipo (Gasolina, Etanol, Diesel).

**Retorna:**
- `200 OK` com a lista
- `404 Not Found` se não houver nenhum do tipo

---

## Exemplo de cálculo completo

**Entrada:** tipo = Gasolina, litros = 60

1. Preço por litro = R$ 6,50
2. Valor bruto = 60 × 6,50 = R$ 390,00
3. 60L > 50L → desconto de 5%: R$ 390,00 × 0,05 = R$ 19,50
4. Valor total = R$ 390,00 - R$ 19,50 = **R$ 370,50**

---

---

### GET /api/abastecimento/nota/{id}
Retorna a nota fiscal completa de um abastecimento com impostos calculados.

**Retorna:**
- `200 OK` com os dados + impostos:
  - `icms` = valorTotal × 25%
  - `pisCofins` = valorTotal × 3%
  - `totalComImpostos` = valorTotal + icms + pisCofins
- `404 Not Found` se o ID não existir

**Exemplo com valorTotal = R$ 370,50:**
- ICMS (25%) = R$ 92,63
- PIS/COFINS (3%) = R$ 11,12
- **Total com impostos = R$ 474,24**

---

### GET /api/abastecimento/km/{placa}?kmPorLitro=10
Calcula quantos km o veículo irá rodar com o último abastecimento registrado.

**Parâmetros:**
- `placa` → placa do veículo (na URL)
- `kmPorLitro` → consumo do veículo em km/L (query string)

**Validação:**
- `kmPorLitro` deve ser **maior que 0** → senão retorna `400 Bad Request`

**Retorna:**
- `200 OK` com:
  - placa, tipo, litros, kmPorLitro
  - `kmEstimado` = litros × kmPorLitro
- `404 Not Found` se a placa não tiver abastecimentos

**Exemplo:** 60 litros × 12 km/L = **720 km estimados**

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
