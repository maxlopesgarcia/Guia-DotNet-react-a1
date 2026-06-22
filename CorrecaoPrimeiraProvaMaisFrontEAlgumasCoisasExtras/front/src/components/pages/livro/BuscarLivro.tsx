import { useState } from "react";
import Livro from "../../../models/Livro";
import api from "../../../services/api";

function BuscarLivro(){
    const [nome, setNome] = useState<string>("");
    const [livro, setLivro] = useState<Livro | null>(null);
    const [mensagem, setMensagem] = useState("");

    async function buscarLivroAPI(e: any){
        e.preventDefault();
        try{
            const resposta = await api.get<Livro>(`/api/livro/buscar/${nome}`);
            setLivro(resposta.data);
            setMensagem("");
        } catch (error){
            setLivro(null);
            setMensagem("livro nao encontrado");
            console.log(error);
        }
    }
    return (
        <div className="BuscarLivro">
            <h1>buscar livro</h1>
            <form onSubmit={buscarLivroAPI}>
                <div>
                    <label>NOME:</label>
                    <input value={nome} required type="text" onChange={(e:any) => { setNome(e.target.value) }} />
                </div>
                <div>
                    <button type="submit">buscar</button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {livro && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>NOME</th>
                            <th>AUTOR</th>
                            <th>DISPONIVEL</th>
                            <th>CRIADO EM</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{livro.id}</td>
                            <td>{livro.nome}</td>
                            <td>{livro.autor}</td>
                            <td>{livro.estaDisponivel ? "sim" : "não"}</td>
                            <td>{livro.criadoEm}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    )
}
export default BuscarLivro;