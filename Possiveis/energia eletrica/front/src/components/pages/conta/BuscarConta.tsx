import { useState } from "react";
import Conta from "../../../models/Conta";
import api from "../../../services/api";

function BuscarConta() {

    const [cpf, setCpf] = useState("");
    const [contas, setContas] = useState<Conta[]>([]);
    const [divida, setDivida] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState("");

    async function buscarAPI(e: any) {
        e.preventDefault();

        try {
            const respostaContas = await api.get<Conta[]>(`/api/conta/buscar/${cpf}`);
            setContas(respostaContas.data);

            const respostaDivida = await api.get(`/api/conta/divida/${cpf}`);
            setDivida(respostaDivida.data.totalDivida);

            setMensagem("");
        } catch (error) {
            setContas([]);
            setDivida(null);
            setMensagem("Nenhuma conta encontrada para esse CPF!");
            console.log(error);
        }
    }

    return (
        <div className="BuscarConta">
            <h1>Buscar Conta por CPF</h1>
            <form onSubmit={buscarAPI}>
                <div>
                    <label>CPF:</label>
                    <input value={cpf} required type="text" onChange={
                        (e: any) => { setCpf(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">Buscar</button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {divida !== null && (
                <h2>Total de Dívida: R$ {divida.toFixed(2)}</h2>
            )}
            {contas.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Mês</th>
                            <th>Ano</th>
                            <th>Consumo (kWh)</th>
                            <th>Bandeira</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contas.map((conta: any) => (
                            <tr key={conta.id}>
                                <td>{conta.id}</td>
                                <td>{conta.mes}</td>
                                <td>{conta.ano}</td>
                                <td>{conta.consumo} kWh</td>
                                <td>{conta.bandeira}</td>
                                <td>R$ {conta.valorTotal?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default BuscarConta;
