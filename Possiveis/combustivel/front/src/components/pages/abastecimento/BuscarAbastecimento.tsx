import { useState } from "react";
import Abastecimento from "../../../models/Abastecimento";
import api from "../../../services/api";

function BuscarAbastecimento() {

    const [cpf, setCpf] = useState("");
    const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
    const [totalGasto, setTotalGasto] = useState<number | null>(null);
    const [mensagem, setMensagem] = useState("");

    async function buscarAPI(e: any) {
        e.preventDefault();

        try {
            const respostaLista = await api.get<Abastecimento[]>(`/api/abastecimento/buscar/${cpf}`);
            setAbastecimentos(respostaLista.data);

            const respostaTotal = await api.get(`/api/abastecimento/total/${cpf}`);
            setTotalGasto(respostaTotal.data.totalGasto);

            setMensagem("");
        } catch (error) {
            setAbastecimentos([]);
            setTotalGasto(null);
            setMensagem("Nenhum abastecimento encontrado para esse CPF!");
            console.log(error);
        }
    }

    return (
        <div className="BuscarAbastecimento">
            <h1>Buscar por CPF</h1>
            <form onSubmit={buscarAPI}>
                <div>
                    <label>CPF:</label>
                    <input value={cpf} required type="text" onChange={
                        (e: any) => { setCpf(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">
                        Buscar
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {totalGasto !== null && (
                <h2>Total Gasto: R$ {totalGasto.toFixed(2)}</h2>
            )}
            {abastecimentos.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
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
            )}
        </div>
    )
}

export default BuscarAbastecimento;
