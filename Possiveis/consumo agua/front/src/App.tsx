import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ListarContas from './components/pages/conta/ListarContas';
import CadastrarConta from './components/pages/conta/CadastrarConta';
import BuscarConta from './components/pages/conta/BuscarConta';

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
              <Link to="/pages/conta/cadastrar">Cadastrar Conta</Link>
            </li>
            <li>
              <Link to="/pages/conta/buscar">Buscar por CPF</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListarContas />} />
          <Route path="/pages/conta/cadastrar" element={<CadastrarConta />} />
          <Route path="/pages/conta/buscar" element={<BuscarConta />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
