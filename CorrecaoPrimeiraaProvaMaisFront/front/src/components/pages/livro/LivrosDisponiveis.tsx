import { useEffect, useState } from "react";
import api from "../../../services/api";
import Livro from "../../../models/Livro";

function LivrosDisponiveis() {

    const [livros, setLivros] = useState<Livro[]>([]);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarLivrosAPI();
    }, [])

    async function carregarLivrosAPI() {
        try {
            const resposta = await api.get<Livro[]>("/api/livro/disponiveis");
            setLivros(resposta.data);
            setMensagem("");
        } catch (error) {
            setLivros([]);
            setMensagem("Nenhum livro disponível!");
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

    return (
        <div className="LivrosDisponiveis">
            <h1>Livros Disponíveis</h1>
            {mensagem && <p>{mensagem}</p>}
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nome</th>
                        <th>Autor</th>
                        <th>Criado Em</th>
                        <th>Emprestar</th>
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
                                <button onClick={() => emprestarLivro(livro.id)}>
                                    Emprestar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default LivrosDisponiveis;
