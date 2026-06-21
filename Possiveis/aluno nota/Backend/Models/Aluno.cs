namespace Backend.Models;

public class Aluno
{
    public int Id { get; set; }
    public string? Ra { get; set; }
    public string? Nome { get; set; }
    public double Nota1 { get; set; }
    public double Nota2 { get; set; }
    public double Nota3 { get; set; }
    public double Media { get; set; }
    public string? Situacao { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.Now;
}
