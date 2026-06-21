import { useEffect, useState } from "react";
import api from "../../../services/api";
import Conta from "../../../models/Conta";

function ListarContas() {

    const [contas, setContas] = useState<Conta[]>([]);

    useEffect(() => {
        carregarContasAPI();
    }, [])

    async function carregarContasAPI() {
        try {
            const resposta = await api.get<Conta[]>("/api/conta/listar");
            setContas(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="ListarContas">
            <h1>Listar Contas</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>CPF</th>
                        <th>Mês</th>
                        <th>Ano</th>
                        <th>Consumo</th>
                        <th>Consumo M3</th>
                        <th>Bandeira</th>
                        <th>Valor Total</th>
                        <th>Criado Em</th>
                    </tr>
                </thead>
                <tbody>
                    {contas.map((conta: any) => (
                        <tr key={conta.id}>
                            <td>{conta.id}</td>
                            <td>{conta.cpf}</td>
                            <td>{conta.mes}</td>
                            <td>{conta.ano}</td>
                            <td>{conta.consumo}</td>
                            <td>{conta.consumoM3}</td>
                            <td>{conta.bandeira}</td>
                            <td>R$ {conta.valorTotal?.toFixed(2)}</td>
                            <td>{conta.criadoEm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarContas;
