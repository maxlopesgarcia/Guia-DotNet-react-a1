namespace Backend.Models;

public class Veiculo
{
    public int Id { get; set; }
    public string? Placa { get; set; }
    public string? Tipo { get; set; }          // Carro, Moto, Caminhao
    public DateTime HoraEntrada { get; set; }
    public DateTime? HoraSaida { get; set; }
    public double? HorasEstacionado { get; set; }
    public double? ValorTotal { get; set; }
    public string? Status { get; set; }         // Estacionado, Finalizado
}
