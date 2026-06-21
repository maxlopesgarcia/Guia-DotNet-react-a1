import { useState } from "react";
import Aluno from "../../../models/Aluno";
import api from "../../../services/api";

function CadastrarAluno() {

    const [ra, setRa] = useState("");
    const [nome, setNome] = useState("");
    const [nota1, setNota1] = useState("");
    const [nota2, setNota2] = useState("");
    const [nota3, setNota3] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function enviarAlunoAPI(e: any) {
        e.preventDefault();

        try {
            const aluno: Aluno = {
                ra,
                nome,
                nota1: Number(nota1),
                nota2: Number(nota2),
                nota3: Number(nota3)
            };

            const resposta = await api.post("/api/aluno/cadastrar", aluno);

            setRa("");
            setNome("");
            setNota1("");
            setNota2("");
            setNota3("");
            setMensagem("Aluno cadastrado com sucesso!");

            console.log(resposta.data);
        } catch (error: any) {
            setMensagem(error.response?.data || "Erro ao cadastrar aluno!");
            console.log(error);
        }
    }

    return (
        <div className="CadastrarAluno">
            <h1>Cadastrar Aluno</h1>
            <form onSubmit={enviarAlunoAPI}>
                <div>
                    <label>RA:</label>
                    <input value={ra} required type="text" onChange={
                        (e: any) => { setRa(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Nome:</label>
                    <input value={nome} required type="text" onChange={
                        (e: any) => { setNome(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Nota 1:</label>
                    <input value={nota1} required type="number" min="0" max="10" step="0.1" onChange={
                        (e: any) => { setNota1(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Nota 2:</label>
                    <input value={nota2} required type="number" min="0" max="10" step="0.1" onChange={
                        (e: any) => { setNota2(e.target.value) }
                    } />
                </div>
                <div>
                    <label>Nota 3:</label>
                    <input value={nota3} required type="number" min="0" max="10" step="0.1" onChange={
                        (e: any) => { setNota3(e.target.value) }
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

export default CadastrarAluno;
