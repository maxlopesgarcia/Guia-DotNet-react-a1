import { useState } from "react";
import api from "../../../services/api";

function NotaFiscal() {

    const [id, setId] = useState("");
    const [nota, setNota] = useState<any>(null);
    const [mensagem, setMensagem] = useState("");

    async function buscarNotaAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get(`/api/abastecimento/nota/${id}`);
            setNota(resposta.data);
            setMensagem("");
        } catch (error) {
            setNota(null);
            setMensagem("Abastecimento não encontrado!");
            console.log(error);
        }
    }

    return (
        <div className="NotaFiscal">
            <h1>Nota Fiscal</h1>
            <form onSubmit={buscarNotaAPI}>
                <div>
                    <label>Número do Abastecimento (ID):</label>
                    <input value={id} required type="number" min="1" onChange={
                        (e: any) => { setId(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">
                        Buscar Nota
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {nota && (
                <div className="nota">
                    <hr />
                    <h2>*** NOTA FISCAL ***</h2>
                    <p><strong>Nº:</strong> {nota.id}</p>
                    <p><strong>Data:</strong> {nota.criadoEm}</p>
                    <p><strong>CPF:</strong> {nota.cpf}</p>
                    <p><strong>Placa:</strong> {nota.placa}</p>
                    <hr />
                    <p><strong>Combustível:</strong> {nota.tipo}</p>
                    <p><strong>Litros:</strong> {nota.litros} L</p>
                    <p><strong>Preço por Litro:</strong> R$ {nota.precoPorLitro?.toFixed(2)}</p>
                    <hr />
                    <p><strong>Subtotal:</strong> R$ {(nota.litros * nota.precoPorLitro)?.toFixed(2)}</p>
                    <p><strong>Desconto:</strong> - R$ {nota.desconto?.toFixed(2)}</p>
                    <p><strong>Valor s/ Impostos:</strong> R$ {nota.valorTotal?.toFixed(2)}</p>
                    <hr />
                    <p><strong>ICMS (25%):</strong> R$ {nota.icms?.toFixed(2)}</p>
                    <p><strong>PIS/COFINS (3%):</strong> R$ {nota.pisCofins?.toFixed(2)}</p>
                    <hr />
                    <h3><strong>TOTAL COM IMPOSTOS: R$ {nota.totalComImpostos?.toFixed(2)}</strong></h3>
                    <hr />
                </div>
            )}
        </div>
    )
}

export default NotaFiscal;
