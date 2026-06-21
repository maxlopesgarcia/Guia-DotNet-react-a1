import { useState } from "react";
import Veiculo from "../../../models/Veiculo";
import api from "../../../services/api";

function RegistrarEntrada() {

    const [placa, setPlaca] = useState("");
    const [tipo, setTipo] = useState("Carro");
    const [mensagem, setMensagem] = useState("");

    async function enviarAPI(e: any) {
        e.preventDefault();

        try {
            const veiculo: Veiculo = { placa, tipo };

            const resposta = await api.post("/api/veiculo/entrada", veiculo);

            setPlaca("");
            setTipo("Carro");
            setMensagem("Entrada registrada com sucesso!");

            console.log(resposta.data);
        } catch (error: any) {
            setMensagem(error.response?.data || "Erro ao registrar entrada!");
            console.log(error);
        }
    }

    return (
        <div className="RegistrarEntrada">
            <h1>Registrar Entrada</h1>
            <form onSubmit={enviarAPI}>
                <div>
                    <label>Placa:</label>
                    <input value={placa} required type="text" onChange={
                        (e: any) => { setPlaca(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Tipo de Veículo:</label>
                    <select value={tipo} onChange={
                        (e: any) => { setTipo(e.target.value) }
                    }>
                        <option value="Moto">Moto — R$ 5,00/h</option>
                        <option value="Carro">Carro — R$ 10,00/h</option>
                        <option value="Caminhao">Caminhão — R$ 20,00/h</option>
                    </select>
                </div>
                <div>
                    <button type="submit">
                        Registrar Entrada
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
        </div>
    )
}

export default RegistrarEntrada;
