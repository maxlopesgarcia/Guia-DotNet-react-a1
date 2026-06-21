namespace Backend.Models;

public class Conta
{
    public int Id { get; set; }
    public string? Cpf { get; set; }
    public int Mes { get; set; }
    public int Ano { get; set; }
    public double Consumo { get; set; }      // kWh informado pelo usuário
    public string? Bandeira { get; set; }    // Verde, Amarela, Vermelha
    public double ValorTotal { get; set; }   // calculado no POST
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
