# Estacionamento — Guia de Regras

## Como rodar

**Backend:**
```
cd Backend
dotnet run
```
Roda na porta **5245**

**Frontend:**
```
cd front
npm start
```
Roda na porta **3000**

---

## Endpoints do Backend

### POST /api/veiculo/entrada
Registra a entrada de um veículo no estacionamento.

**Body enviado:**
```json
{
  "placa": "ABC1234",
  "tipo": "Carro"
}
```

**Validações:**
- `tipo` deve ser exatamente: `"Moto"`, `"Carro"` ou `"Caminhao"` — senão retorna 400
- Não pode ter veículo com a mesma placa e status `"Estacionado"` — retorna 400

**O que ele faz:**
- Define `HoraEntrada = DateTime.Now`
- Define `Status = "Estacionado"`
- Salva no banco

**Retorna:** o objeto do veículo criado (201)

---

### PUT /api/veiculo/saida/{id}
Registra a saída e calcula o valor a pagar.

**Validações:**
- Se id não existir — retorna 404
- Se veículo já tiver status `"Finalizado"` — retorna 400

**Cálculos feitos no backend:**
- `HoraSaida = DateTime.Now`
- `HorasEstacionado = (HoraSaida - HoraEntrada).TotalHours`
- Arredonda para cima, mínimo 1 hora: `horas = horasEstacionado < 1 ? 1 : Math.Ceiling(horasEstacionado)`
- Tarifa por hora:
  - Moto — R$ 5,00/h
  - Carro — R$ 10,00/h
  - Caminhao — R$ 20,00/h
- `ValorTotal = horas * tarifa`
- `Status = "Finalizado"`

**Retorna:** o objeto atualizado (200)

---

### GET /api/veiculo/listar
Lista todos os veículos (estacionados e finalizados).

**Retorna:** array de veículos

---

### GET /api/veiculo/estacionados
Lista apenas os veículos com status `"Estacionado"`.

**Retorna:** array de veículos ativos

---

### GET /api/veiculo/buscar/{placa}
Busca o histórico de um veículo pela placa.

**Retorna:** lista com todas as entradas daquela placa

---

## Modelo Veiculo

| Campo            | Tipo      | Descricao                            |
|------------------|-----------|--------------------------------------|
| Id               | int       | gerado automaticamente               |
| Placa            | string    | ex: "ABC1234"                        |
| Tipo             | string    | "Moto", "Carro" ou "Caminhao"        |
| HoraEntrada      | DateTime  | gerada ao registrar entrada          |
| HoraSaida        | DateTime? | gerada ao registrar saida            |
| HorasEstacionado | double?   | calculado na saida (arred. p/ cima)  |
| ValorTotal       | double?   | calculado na saida                   |
| Status           | string    | "Estacionado" ou "Finalizado"        |

---

## Pontos de atencao na prova

1. **CORS** — a policy se chama `"Acesso Total"` e `app.UseCors("Acesso Total")` fica ANTES de `app.Run()` mas DEPOIS de todos os endpoints
2. **Migrations** — NAO usar `Database.EnsureCreated()`. Usar:
   ```
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
3. **Tarifa minima** — sempre cobrar pelo menos 1 hora, mesmo que o veiculo saia em menos de 60 minutos
4. **Math.Ceiling** — arredonda para cima (ex: 1.2h vira 2h, paga 2 * tarifa)
5. **Campos nullable** — HoraSaida, HorasEstacionado e ValorTotal sao `?` pois so existem apos a saida
6. **Porta da API** — definida em `api.ts` como `http://localhost:5245`

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
