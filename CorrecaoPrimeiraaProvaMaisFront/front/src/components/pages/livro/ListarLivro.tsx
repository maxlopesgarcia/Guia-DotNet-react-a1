import { useEffect, useState } from "react";
import api from "../../../services/api";
import Livro from "../../../models/Livro";

function ListarLivros() {

    const [livros, setLivros] = useState<Livro[]>([]);

    useEffect(() => {
        carregarLivrosAPI();
    }, [])

    async function carregarLivrosAPI() {
        try {
            const resposta = await api.get<Livro[]>("/api/livro/listar");
            setLivros(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function emprestarLivro(id: number) {
        try {
            await api.put(`/api/livro/emprestar/${id}`);
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    async function devolverLivro(id: number) {
        try {
            await api.put(`/api/livro/devolver/${id}`);
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    async function popularAPI() {
        try {
            await api.post("/api/livro/popular");
            carregarLivrosAPI();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="ListarLivros">
            <h1>Listar Livros</h1>
            <button onClick={popularAPI}>Popular</button>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarLivros;
