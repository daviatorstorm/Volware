using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volware.DAL.Models;

namespace Volware.DAL.Repositories
{
    public class VolwareDBContext : IdentityDbContext
    {
        public VolwareDBContext(DbContextOptions<VolwareDBContext> options)
            : base(options)
        {
        }

        public DbSet<TempUser> TempUsers { get; set; }
        public DbSet<UserQR> UserQRs { get; set; }
        public DbSet<UserInfo> UserInfos { get; set; }
        public DbSet<VolwareFile> Files { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<WarehouseItem> WarehouseItems { get; set; }
        public DbSet<ActionLog> ActionLogs { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Warehouse>()
                .Property(x => x.Iterator)
                .HasDefaultValue(1);

            modelBuilder.Entity<WarehouseItem>()
                .Property(x => x.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<Order>()
                .HasOne(x => x.Delivery)
                .WithOne(x => x.Order)
                .HasForeignKey<Order>(x => x.DeliveryId);
        }
    }
}
