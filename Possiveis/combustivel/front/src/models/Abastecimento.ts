export default interface Abastecimento {
    id?: number;
    cpf?: string;
    placa?: string;
    tipo?: string;
    litros?: number;
    precoPorLitro?: number;
    desconto?: number;
    valorTotal?: number;
    criadoEm?: string;
}
