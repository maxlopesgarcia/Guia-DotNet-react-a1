import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ListarAbastecimentos from './components/pages/abastecimento/ListarAbastecimentos';
import CadastrarAbastecimento from './components/pages/abastecimento/CadastrarAbastecimento';
import BuscarAbastecimento from './components/pages/abastecimento/BuscarAbastecimento';
import AbastecimentoPorTipo from './components/pages/abastecimento/AbastecimentoPorTipo';
import NotaFiscal from './components/pages/abastecimento/NotaFiscal';
import CalculadoraKm from './components/pages/abastecimento/CalculadoraKm';

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
              <Link to="/pages/abastecimento/cadastrar">Cadastrar</Link>
            </li>
            <li>
              <Link to="/pages/abastecimento/buscar">Buscar por CPF</Link>
            </li>
            <li>
              <Link to="/pages/abastecimento/tipo">Por Tipo</Link>
            </li>
            <li>
              <Link to="/pages/abastecimento/nota">Nota Fiscal</Link>
            </li>
            <li>
              <Link to="/pages/abastecimento/km">Calculadora KM</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListarAbastecimentos />} />
          <Route path="/pages/abastecimento/cadastrar" element={<CadastrarAbastecimento />} />
          <Route path="/pages/abastecimento/buscar" element={<BuscarAbastecimento />} />
          <Route path="/pages/abastecimento/tipo" element={<AbastecimentoPorTipo />} />
          <Route path="/pages/abastecimento/nota" element={<NotaFiscal />} />
          <Route path="/pages/abastecimento/km" element={<CalculadoraKm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
