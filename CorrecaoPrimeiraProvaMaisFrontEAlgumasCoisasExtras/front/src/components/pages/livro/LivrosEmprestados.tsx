import { useEffect, useState } from "react";
import api from "../../../services/api";
import Livro from "../../../models/Livro";

function LivrosEmprestados() {

    const [livros, setLivros] = useState<Livro[]>([]);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarLivrosAPI();
    }, [])

    async function carregarLivrosAPI() {
        try {
            const resposta = await api.get<Livro[]>("/api/livro/emprestados");
            setLivros(resposta.data);
            setMensagem("");
        } catch (error) {
            setLivros([]);
            setMensagem("Nenhum livro emprestado!");
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

    return (
        <div className="LivrosEmprestados">
            <h1>Livros Emprestados</h1>
            {mensagem && <p>{mensagem}</p>}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Autor</th>
                        <th>Criado Em</th>
                        <th>Devolver</th>
                    </tr>
                </thead>
                <tbody>
                    {livros.map((livro: any) => (
                        <tr key={livro.id}>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.criadoEm}</td>
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

export default LivrosEmprestados;
