import { useEffect, useState } from "react";
import api from "../../../services/api";
import Aluno from "../../../models/Aluno";

function ListarAlunos() {

    const [alunos, setAlunos] = useState<Aluno[]>([]);

    useEffect(() => {
        carregarAlunosAPI();
    }, [])

    async function carregarAlunosAPI() {
        try {
            const resposta = await api.get<Aluno[]>("/api/aluno/listar");
            setAlunos(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="ListarAlunos">
            <h1>Listar Alunos</h1>
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
                        <th>Criado Em</th>
                    </tr>
                </thead>
                <tbody>
                    {alunos.map((aluno: any) => (
                        <tr key={aluno.id}>
                            <td>{aluno.id}</td>
                            <td>{aluno.ra}</td>
                            <td>{aluno.nome}</td>
                            <td>{aluno.nota1}</td>
                            <td>{aluno.nota2}</td>
                            <td>{aluno.nota3}</td>
                            <td>{aluno.media?.toFixed(2)}</td>
                            <td>{aluno.situacao}</td>
                            <td>{aluno.criadoEm}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarAlunos;
