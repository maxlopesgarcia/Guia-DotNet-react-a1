import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Livro from "../../../models/Livro";
import api from "../../../services/api";

function AlterarLivro(){
    const { id } = useParams();
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [autor, setAutor] = useState("");
    const [mensagem, setMensagem] = useState("");

    useEffect(() => { carregarLivro(); }, []);

    async function carregarLivro(){
        try {
            const resposta = await api.get<Livro[]>("/api/livro/listar");
            const livro = resposta.data.find(l => l.id === Number(id));
            if (livro) {
                setNome(livro.nome ?? "");
                setAutor(livro.autor ?? "");
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function alterarLivroAPI(e: any){
        e.preventDefault();
        try {
            const livro: Livro = { nome, autor };
            await api.put(`/api/livro/alterar/${id}`, livro);
            navigate("/");
        } catch (error: any) {
            setMensagem(error.response?.data ?? "Erro ao alterar livro.");
        }
    }

    return (
        <div className="AlterarLivro">
            <h1>alterar livro</h1>
            {mensagem && <p>{mensagem}</p>}
            <form onSubmit={alterarLivroAPI}>
                <div>
                    <label>nome:</label>
                    <input value={nome} required type="text" onChange={(e:any) => { setNome(e.target.value) }} />
                </div>
                <div>
                    <label>autor:</label>
                    <input value={autor} required type="text" onChange={(e:any) => { setAutor(e.target.value) }} />
                </div>
                <div>
                    <button type="submit">alterar</button>
                </div>
            </form>
        </div>
    )
}
export default AlterarLivro;
