import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Livro from "../../../models/Livro";
import api from "../../../services/api";

function ListarLivros(){
    const[livros, setLivros] = useState<Livro[]>([]);
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();
    useEffect(() => { carregarLivrosAPI();}, [])
    async function carregarLivrosAPI(){
        try{
            const resposta = await api.get<Livro[]>("/api/livro/listar");
            setLivros(resposta.data);
        } catch (error){
            console.log(error);
        }
    }
    async function emprestarLivro(id: number){
        try{
            const resposta = await api.put(`/api/livro/emprestar/${id}`);
            setMensagem(resposta.data);
            carregarLivrosAPI();
        }catch (error: any){
            setMensagem(error.response?.data ?? "Erro ao emprestar livro.");
        }
    }
    async function devolverLivro(id: number){
        try{
            const resposta = await api.put(`/api/livro/devolver/${id}`);
            setMensagem(resposta.data);
            carregarLivrosAPI();
        }catch (error: any){
            setMensagem(error.response?.data ?? "Erro ao devolver livro.");
        }
    }
    async function deletarLivro(id: number){
        try{
            const resposta = await api.delete(`/api/livro/deletar/${id}`);
            setMensagem(resposta.data);
            carregarLivrosAPI();
        }catch (error: any){
            setMensagem(error.response?.data ?? "Erro ao deletar livro.");
        }
    }
    function alterarLivro(id: number){
        navigate(`/pages/livro/alterar/${id}`);
    }
    return (
        <div className="ListarLivros">
            <h1>listar livros</h1>
            {mensagem && <p>{mensagem}</p>}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Autor</th>
                        <th>Disponível</th>
                        <th>Criado Em</th>
                        <th>Emprestar</th>
                        <th>Devolver</th>
                        <th>Alterar</th>
                        <th>Deletar</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro: any) => (
                        <tr key={livro.id}>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.estaDisponivel ? "Sim" : "Não"}</td>
                            <td>{livro.criadoEm}</td>
                            <td>
                                <button onClick={() => emprestarLivro(livro.id)}>
                                    Emprestar
                                </button>
                            </td>
                            <td>
                                <button onClick={() => devolverLivro(livro.id)}>
                                    Devolver
                                </button>
                            </td>
                            <td>
                                <button onClick={() => alterarLivro(livro.id)}>
                                    Alterar
                                </button>
                            </td>
                            <td>
                                <button onClick={() => deletarLivro(livro.id)}>
                                    Deletar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default ListarLivros;