using Microsoft.EntityFrameworkCore;

namespace Deconto.Models;

public class AppDataContext : DbContext
{
    public DbSet<Livro> Livros { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=Diogo.db");
    }

}