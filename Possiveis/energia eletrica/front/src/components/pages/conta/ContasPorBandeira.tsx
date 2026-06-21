import { useState } from "react";
import Conta from "../../../models/Conta";
import api from "../../../services/api";

function ContasPorBandeira() {

    const [bandeira, setBandeira] = useState("Verde");
    const [contas, setContas] = useState<Conta[]>([]);
    const [mensagem, setMensagem] = useState("");

    async function buscarAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get<Conta[]>(`/api/conta/bandeira/${bandeira}`);
            setContas(resposta.data);
            setMensagem("");
        } catch (error) {
            setContas([]);
            setMensagem(`Nenhuma conta com bandeira ${bandeira} encontrada!`);
            console.log(error);
        }
    }

    return (
        <div className="ContasPorBandeira">
            <h1>Contas por Bandeira</h1>
            <form onSubmit={buscarAPI}>
                <div>
                    <label>Bandeira:</label>
                    <select value={bandeira} onChange={
                        (e: any) => { setBandeira(e.target.value) }
                    }>
                        <option value="Verde">Verde</option>
                        <option value="Amarela">Amarela</option>
                        <option value="Vermelha">Vermelha</option>
                    </select>
                </div>
                <div>
                    <button type="submit">Buscar</button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {contas.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CPF</th>
                            <th>Mês</th>
                            <th>Ano</th>
                            <th>Consumo (kWh)</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contas.map((conta: any) => (
                            <tr key={conta.id}>
                                <td>{conta.id}</td>
                                <td>{conta.cpf}</td>
                                <td>{conta.mes}</td>
                                <td>{conta.ano}</td>
                                <td>{conta.consumo} kWh</td>
                                <td>R$ {conta.valorTotal?.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default ContasPorBandeira;
