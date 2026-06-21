import { useState } from "react";
import Abastecimento from "../../../models/Abastecimento";
import api from "../../../services/api";

function AbastecimentoPorTipo() {

    const [tipo, setTipo] = useState("Gasolina");
    const [abastecimentos, setAbastecimentos] = useState<Abastecimento[]>([]);
    const [mensagem, setMensagem] = useState("");

    async function buscarAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get<Abastecimento[]>(`/api/abastecimento/tipo/${tipo}`);
            setAbastecimentos(resposta.data);
            setMensagem("");
        } catch (error) {
            setAbastecimentos([]);
            setMensagem(`Nenhum abastecimento do tipo ${tipo} encontrado!`);
            console.log(error);
        }
    }

    return (
        <div className="AbastecimentoPorTipo">
            <h1>Buscar por Tipo de Combustível</h1>
            <form onSubmit={buscarAPI}>
                <div>
                    <label>Tipo:</label>
                    <select value={tipo} onChange={
                        (e: any) => { setTipo(e.target.value) }
                    }>
                        <option value="Gasolina">Gasolina</option>
                        <option value="Etanol">Etanol</option>
                        <option value="Diesel">Diesel</option>
                    </select>
                </div>
                <div>
                    <button type="submit">
                        Buscar
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {abastecimentos.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>CPF</th>
                            <th>Placa</th>
                            <th>Litros</th>
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
                                <td>{a.litros}</td>
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

export default AbastecimentoPorTipo;
