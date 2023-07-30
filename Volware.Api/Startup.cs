using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Volware.Api.Validators;
using Volware.BackgroundWorker;
using Volware.Common;
using Volware.Common.Extensions;
using Volware.DAL;
using Volware.DAL.Repositories;

namespace Volware
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.ConfigureJWT(Environment.IsDevelopment(),
                Configuration["Authentication:SecurityKey"]);

            // Adding repositories
            services.AddTransient<UserRepository>();
            services.AddTransient<WarehouseRepository>();
            services.AddTransient<OrderRepository>();
            // Scoped for background worker
            services.AddScoped<ActionLogRepository>();

            // Adding validators
            services.AddTransient<OrderValidator>();

            // Adding services
            services.AddTransient<StorageRepository>();

            services.AddDbContext<VolwareDBContext>(opts =>
                opts.UseNpgsql(Configuration.GetConnectionString("Default"), b => 
                b.MigrationsAssembly("Volware.Api")));

            services.Configure<KeycloakOptions>(
                Configuration.GetSection("Keycloak"));

            services.Configure<StorageOptions>(
                Configuration.GetSection("Storage"));

            services.AddMemoryCache();

            services.AddHostedService<QueuedHostedService>();
            services.AddSingleton<IBackgroundQueue>(ctx =>
            {
                return new BackgroundQueue(100);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (!env.IsProduction())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(opts => opts
                .AllowAnyHeader()
                .AllowAnyOrigin()
                .AllowAnyMethod());

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseVolwareExceptionHandler();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}