import { useEffect, useState } from "react";
import api from "../../../services/api";
import Abastecimento from "../../../models/Abastecimento";

function ListarAbastecimentos() {

    const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);

    useEffect(() => {
        carregarAPI();
    }, [])

    async function carregarAPI() {
        try {
            const resposta = await api.get<Abastecimento[]>("/api/abastecimento/listar");
            setAbastecimentos(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="ListarAbastecimentos">
            <h1>Listar Abastecimentos</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>CPF</th>
                        <th>Placa</th>
                        <th>Tipo</th>
                        <th>Litros</th>
                        <th>Preço/L</th>
                        <th>Desconto</th>
                        <th>Valor Total</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {abastecimentos.map((a: any) => (
                        <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>{a.cpf}</td>
                            <td>{a.placa}</td>
                            <td>{a.tipo}</td>
                            <td>{a.litros}</td>
                            <td>R$ {a.precoPorLitro?.toFixed(2)}</td>
                            <td>R$ {a.desconto?.toFixed(2)}</td>
                            <td>R$ {a.valorTotal?.toFixed(2)}</td>
                            <td>{a.criadoEm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarAbastecimentos;
