import { useState } from "react";
import Aluno from "../../../models/Aluno";
import api from "../../../services/api";

function BuscarAluno() {

    const [ra, setRa] = useState("");
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [mensagem, setMensagem] = useState("");

    async function buscarAlunoAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get<Aluno>(`/api/aluno/buscar/${ra}`);
            setAluno(resposta.data);
            setMensagem("");
        } catch (error) {
            setAluno(null);
            setMensagem("Aluno não encontrado!");
            console.log(error);
        }
    }

    return (
        <div className="BuscarAluno">
            <h1>Buscar Aluno por RA</h1>
            <form onSubmit={buscarAlunoAPI}>
                <div>
                    <label>RA:</label>
                    <input value={ra} required type="text" onChange={
                        (e: any) => { setRa(e.target.value) }
                    } />
                </div>
                <div>
                    <button type="submit">
                        Buscar
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {aluno && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>RA</th>
                            <th>Nome</th>
                            <th>Nota 1</th>
                            <th>Nota 2</th>
                            <th>Nota 3</th>
                            <th>Média</th>
                            <th>Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{aluno.id}</td>
                            <td>{aluno.ra}</td>
                            <td>{aluno.nome}</td>
                            <td>{aluno.nota1}</td>
                            <td>{aluno.nota2}</td>
                            <td>{aluno.nota3}</td>
                            <td>{aluno.media?.toFixed(2)}</td>
                            <td>{aluno.situacao}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default BuscarAluno;
