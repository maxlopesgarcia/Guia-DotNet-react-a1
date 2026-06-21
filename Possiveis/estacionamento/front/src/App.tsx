import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ListarVeiculos from './components/pages/veiculo/ListarVeiculos';
import RegistrarEntrada from './components/pages/veiculo/RegistrarEntrada';
import Estacionados from './components/pages/veiculo/Estacionados';
import BuscarVeiculo from './components/pages/veiculo/BuscarVeiculo';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Listar Todos</Link></li>
            <li><Link to="/pages/veiculo/entrada">Registrar Entrada</Link></li>
            <li><Link to="/pages/veiculo/estacionados">Estacionados</Link></li>
            <li><Link to="/pages/veiculo/buscar">Buscar por Placa</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListarVeiculos />} />
          <Route path="/pages/veiculo/entrada" element={<RegistrarEntrada />} />
          <Route path="/pages/veiculo/estacionados" element={<Estacionados />} />
          <Route path="/pages/veiculo/buscar" element={<BuscarVeiculo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
