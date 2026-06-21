namespace Backend.Models;

public class Conta
{
    public int Id { get; set; }
    public string? Cpf { get; set; }
    public int Mes { get; set; }
    public int Ano { get; set; }
    public double Consumo { get; set; }
    public double ConsumoM3 { get; set; }
    public string? Bandeira { get; set; }
    public double ValorTotal { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
