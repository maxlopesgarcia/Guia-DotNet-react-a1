using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDataContext : DbContext
{
    public DbSet<Veiculo> Veiculos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Estacionamento.db");
    }
}
