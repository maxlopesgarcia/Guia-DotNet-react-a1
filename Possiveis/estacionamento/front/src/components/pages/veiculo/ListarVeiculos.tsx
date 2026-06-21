import { useEffect, useState } from "react";
import api from "../../../services/api";
import Veiculo from "../../../models/Veiculo";

function ListarVeiculos() {

    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

    useEffect(() => {
        carregarAPI();
    }, [])

    async function carregarAPI() {
        try {
            const resposta = await api.get<Veiculo[]>("/api/veiculo/listar");
            setVeiculos(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function registrarSaida(id: number) {
        try {
            await api.put(`/api/veiculo/saida/${id}`);
            carregarAPI();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="ListarVeiculos">
            <h1>Listar Veículos</h1>
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
                        <th>Saída</th>
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
                            <td>
                                {v.status === "Estacionado" && (
                                    <button onClick={() => registrarSaida(v.id)}>
                                        Registrar Saída
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarVeiculos;
