import { useState } from "react";
import Aluno from "../../../models/Aluno";
import api from "../../../services/api";

function AlunosPorSituacao() {

    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [situacao, setSituacao] = useState("aprovados");
    const [mensagem, setMensagem] = useState("");

    async function buscarPorSituacaoAPI(e: any) {
        e.preventDefault();

        try {
            const resposta = await api.get<Aluno[]>(`/api/aluno/${situacao}`);
            setAlunos(resposta.data);
            setMensagem("");
        } catch (error) {
            setAlunos([]);
            setMensagem("Nenhum aluno encontrado!");
            console.log(error);
        }
    }

    return (
        <div className="AlunosPorSituacao">
            <h1>Alunos por Situação</h1>
            <form onSubmit={buscarPorSituacaoAPI}>
                <div>
                    <label>Situação:</label>
                    <select value={situacao} onChange={
                        (e: any) => { setSituacao(e.target.value) }
                    }>
                        <option value="aprovados">Aprovados</option>
                        <option value="reprovados">Reprovados</option>
                        <option value="recuperacao">Recuperação</option>
                    </select>
                </div>
                <div>
                    <button type="submit">
                        Buscar
                    </button>
                </div>
            </form>
            {mensagem && <p>{mensagem}</p>}
            {alunos.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>RA</th>
                            <th>Nome</th>
                            <th>Média</th>
                            <th>Situação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno: any) => (
                            <tr key={aluno.id}>
                                <td>{aluno.id}</td>
                                <td>{aluno.ra}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.media?.toFixed(2)}</td>
                                <td>{aluno.situacao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default AlunosPorSituacao;
