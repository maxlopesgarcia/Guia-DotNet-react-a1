import { useState } from "react";
import api from "../../../services/api";

function CalculadoraKm() {

    const [placa, setPlaca] = useState("");
    const [kmPorLitro, setKmPorLitro] = useState("");
    const [resultado, setResultado] = useState<any>(null);
    const [mensagem, setMensagem] = useState("");

    async function calcularAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get(
                `/api/abastecimento/km/${placa}?kmPorLitro=${kmPorLitro}`
            );
            setResultado(resposta.data);
            setMensagem("");
        } catch (error: any) {
            setResultado(null);
            setMensagem(error.response?.data || "Placa não encontrada!");
            console.log(error);
        }
    }

    return (
        <div className="CalculadoraKm">
            <h1>Calculadora de KM</h1>
            <form onSubmit={calcularAPI}>
                <div>
                    <label>Placa do Veículo:</label>
                    <input value={placa} required type="text" onChange={
                        (e: any) => { setPlaca(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Quantos km o carro faz por litro?</label>
                    <input value={kmPorLitro} required type="number" min="0.1" step="0.1" onChange={
                        (e: any) => { setKmPorLitro(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">
                        Calcular
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {resultado && (
                <div>
                    <hr />
                    <h2>Resultado</h2>
                    <p><strong>Placa:</strong> {resultado.placa}</p>
                    <p><strong>Combustível:</strong> {resultado.tipo}</p>
                    <p><strong>Litros abastecidos:</strong> {resultado.litros} L</p>
                    <p><strong>Consumo do veículo:</strong> {resultado.kmPorLitro} km/L</p>
                    <hr />
                    <h3>Estimativa: <strong>{resultado.kmEstimado?.toFixed(1)} km</strong></h3>
                </div>
            )}
        </div>
    )
}

export default CalculadoraKm;
