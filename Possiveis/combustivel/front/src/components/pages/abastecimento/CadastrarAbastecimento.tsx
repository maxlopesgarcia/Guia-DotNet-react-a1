import { useState } from "react";
import Abastecimento from "../../../models/Abastecimento";
import api from "../../../services/api";

function CadastrarAbastecimento() {

    const [cpf, setCpf] = useState("");
    const [placa, setPlaca] = useState("");
    const [tipo, setTipo] = useState("Gasolina");
    const [litros, setLitros] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function enviarAPI(e: any) {
        e.preventDefault();

        try {
            const abastecimento: Abastecimento = {
                cpf,
                placa,
                tipo,
                litros: Number(litros)
            };

            const resposta = await api.post("/api/abastecimento/cadastrar", abastecimento);

            setCpf("");
            setPlaca("");
            setTipo("Gasolina");
            setLitros("");
            setMensagem("Abastecimento cadastrado com sucesso!");

            console.log(resposta.data);
        } catch (error: any) {
            setMensagem(error.response?.data || "Erro ao cadastrar abastecimento!");
            console.log(error);
        }
    }

    return (
        <div className="CadastrarAbastecimento">
            <h1>Cadastrar Abastecimento</h1>
            <form onSubmit={enviarAPI}>
                <div>
                    <label>CPF:</label>
                    <input value={cpf} required type="text" onChange={
                        (e: any) => { setCpf(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Placa:</label>
                    <input value={placa} required type="text" onChange={
                        (e: any) => { setPlaca(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Tipo de Combustível:</label>
                    <select value={tipo} onChange={
                        (e: any) => { setTipo(e.target.value) }
                    }>
                        <option value="Gasolina">Gasolina - R$ 6,50/L</option>
                        <option value="Etanol">Etanol - R$ 4,50/L</option>
                        <option value="Diesel">Diesel - R$ 5,80/L</option>
                    </select>
                </div>
                <div>
                    <label>Litros:</label>
                    <input value={litros} required type="number" min="0.1" step="0.1" onChange={
                        (e: any) => { setLitros(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">
                        Cadastrar
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    )
}

export default CadastrarAbastecimento;
