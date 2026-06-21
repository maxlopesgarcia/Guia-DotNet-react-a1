using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDataContext : DbContext
{
    public DbSet<Abastecimento> Abastecimentos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Posto.db");
    }
}
