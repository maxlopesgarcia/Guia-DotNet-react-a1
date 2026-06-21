import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ListarAlunos from './components/pages/aluno/ListarAlunos';
import CadastrarAluno from './components/pages/aluno/CadastrarAluno';
import BuscarAluno from './components/pages/aluno/BuscarAluno';
import AlunosPorSituacao from './components/pages/aluno/AlunosPorSituacao';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/pages/aluno/cadastrar">Cadastrar Aluno</Link>
            </li>
            <li>
              <Link to="/pages/aluno/buscar">Buscar por RA</Link>
            </li>
            <li>
              <Link to="/pages/aluno/situacao">Por Situação</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListarAlunos />} />
          <Route path="/pages/aluno/cadastrar" element={<CadastrarAluno />} />
          <Route path="/pages/aluno/buscar" element={<BuscarAluno />} />
          <Route path="/pages/aluno/situacao" element={<AlunosPorSituacao />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
