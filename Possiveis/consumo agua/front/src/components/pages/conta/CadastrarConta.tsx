import { useState } from "react";
import Conta from "../../../models/Conta";
import api from "../../../services/api";

function CadastrarConta() {

    const [cpf, setCpf] = useState("");
    const [mes, setMes] = useState("");
    const [ano, setAno] = useState("");
    const [consumo, setConsumo] = useState("");
    const [bandeira, setBandeira] = useState("Verde");
    const [mensagem, setMensagem] = useState("");

    async function enviarContaAPI(e: any) {
        e.preventDefault();

        try {
            const conta: Conta = {
                cpf,
                mes: Number(mes),
                ano: Number(ano),
                consumo: Number(consumo),
                bandeira
            };

            const resposta = await api.post("/api/conta/cadastrar", conta);

            setCpf("");
            setMes("");
            setAno("");
            setConsumo("");
            setBandeira("Verde");
            setMensagem("Conta cadastrada com sucesso!");

            console.log(resposta.data);
        } catch (error: any) {
            setMensagem(error.response?.data || "Erro ao cadastrar conta!");
            console.log(error);
        }
    }

    return (
        <div className="CadastrarConta">
            <h1>Cadastrar Conta</h1>
            <form onSubmit={enviarContaAPI}>
                <div>
                    <label>CPF:</label>
                    <input value={cpf} required type="text" onChange={
                        (e: any) => { setCpf(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Mês:</label>
                    <input value={mes} required type="number" min="1" max="12" onChange={
                        (e: any) => { setMes(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Ano:</label>
                    <input value={ano} required type="number" min="2001" onChange={
                        (e: any) => { setAno(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Consumo (unidades):</label>
                    <input value={consumo} required type="number" min="0" onChange={
                        (e: any) => { setConsumo(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Bandeira:</label>
                    <select value={bandeira} onChange={
                        (e: any) => { setBandeira(e.target.value) }
                    }>
                        <option value="Verde">Verde</option>
                        <option value="Amarela">Amarela (+10%)</option>
                        <option value="Vermelha">Vermelha (+20%)</option>
                    </select>
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

export default CadastrarConta;
