using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class AppDataContext : DbContext
{
    public DbSet<Aluno> Alunos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Escola.db");
    }
}
