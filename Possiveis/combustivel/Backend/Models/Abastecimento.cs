namespace Backend.Models;

public class Abastecimento
{
    public int Id { get; set; }
    public string? Cpf { get; set; }
    public string? Placa { get; set; }
    public string? Tipo { get; set; }        // Gasolina, Etanol, Diesel
    public double Litros { get; set; }
    public double PrecoPorLitro { get; set; }
    public double Desconto { get; set; }
    public double ValorTotal { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
