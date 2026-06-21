import { useState } from "react";
import Veiculo from "../../../models/Veiculo";
import api from "../../../services/api";

function BuscarVeiculo() {

    const [placa, setPlaca] = useState("");
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [mensagem, setMensagem] = useState("");

    async function buscarAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get<Veiculo[]>(`/api/veiculo/buscar/${placa}`);
            setVeiculos(resposta.data);
            setMensagem("");
        } catch (error) {
            setVeiculos([]);
            setMensagem("Nenhum registro encontrado para essa placa!");
            console.log(error);
        }
    }

    return (
        <div className="BuscarVeiculo">
            <h1>Buscar por Placa</h1>
            <form onSubmit={buscarAPI}>
                <div>
                    <label>Placa:</label>
                    <input value={placa} required type="text" onChange={
                        (e: any) => { setPlaca(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">Buscar</button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {veiculos.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Placa</th>
                            <th>Tipo</th>
                            <th>Entrada</th>
                            <th>Saída</th>
                            <th>Horas</th>
                            <th>Valor Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.map((v: any) => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.placa}</td>
                                <td>{v.tipo}</td>
                                <td>{v.horaEntrada}</td>
                                <td>{v.horaSaida ?? "-"}</td>
                                <td>{v.horasEstacionado?.toFixed(2) ?? "-"} h</td>
                                <td>{v.valorTotal != null ? `R$ ${v.valorTotal.toFixed(2)}` : "-"}</td>
                                <td>{v.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default BuscarVeiculo;
