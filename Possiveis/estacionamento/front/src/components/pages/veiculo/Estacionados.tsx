import { useEffect, useState } from "react";
import api from "../../../services/api";
import Veiculo from "../../../models/Veiculo";

function Estacionados() {

    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarAPI();
    }, [])

    async function carregarAPI() {
        try {
            const resposta = await api.get<Veiculo[]>("/api/veiculo/estacionados");
            setVeiculos(resposta.data);
            setMensagem("");
        } catch (error) {
            setVeiculos([]);
            setMensagem("Nenhum veículo estacionado no momento!");
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
        <div className="Estacionados">
            <h1>Veículos Estacionados</h1>
            {mensagem && <p>{mensagem}</p>}
            {veiculos.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Placa</th>
                            <th>Tipo</th>
                            <th>Hora de Entrada</th>
                            <th>Registrar Saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.map((v: any) => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.placa}</td>
                                <td>{v.tipo}</td>
                                <td>{v.horaEntrada}</td>
                                <td>
                                    <button onClick={() => registrarSaida(v.id)}>
                                        Registrar Saída
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Estacionados;
