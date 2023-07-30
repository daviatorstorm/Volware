using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Volware.BackgroundWorker;
using Volware.Common;
using Volware.DAL;
using Volware.DAL.Repositories;

var builder = WebApplication.CreateBuilder(args);

var Configuration = builder.Configuration;
var keycloakSection = Configuration.GetSection("Keycloak");
var serverRealm = $"{keycloakSection["Url"]}/realms/{Configuration.GetSection("Keycloak")["Realm"]}";

var services = builder.Services;

// Add services to the container.
services.AddControllersWithViews()
    .AddRazorRuntimeCompilation();

services.AddAuthentication(options =>
{
    //Sets cookie authentication scheme
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
})
.AddCookie(cookie =>
{
    //Sets the cookie name and maxage, so the cookie is invalidated.
    cookie.Cookie.Name = "keycloak.cookie";
    cookie.Cookie.MaxAge = TimeSpan.FromMinutes(60);
    cookie.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    cookie.SlidingExpiration = true;
    cookie.Events = new CookieAuthenticationEvents
    {
        // After the auth cookie has been validated, this event is called.
        // In it we see if the access token is close to expiring.  If it is
        // then we use the refresh token to get a new access token and save them.
        // If the refresh token does not work for some reason then we redirect to 
        // the login screen.
        OnValidatePrincipal = async cookieCtx =>
        {
            var now = DateTimeOffset.UtcNow;
            var expiresAt = cookieCtx.Properties.GetTokenValue("expires_at");
            var accessTokenExpiration = DateTimeOffset.Parse(expiresAt);
            var timeRemaining = accessTokenExpiration.Subtract(now);
            // TODO: Get this from configuration with a fall back value.
            var refreshThresholdMinutes = 5;
            var refreshThreshold = TimeSpan.FromMinutes(refreshThresholdMinutes);

            if (timeRemaining < TimeSpan.FromMinutes(1))
            {
                var refreshToken = cookieCtx.Properties.GetTokenValue("refresh_token");
                // TODO: Get this HttpClient from a factory
                var response = await new HttpClient().RequestRefreshTokenAsync(new RefreshTokenRequest
                {
                    Address = $"{serverRealm}/protocol/openid-connect/token",
                    ClientId = keycloakSection["ClientId"],
                    ClientSecret = keycloakSection["ClientSecret"],
                    RefreshToken = refreshToken
                });

                if (!response.IsError)
                {
                    var expiresInSeconds = response.ExpiresIn;
                    var updatedExpiresAt = DateTimeOffset.UtcNow.AddSeconds(expiresInSeconds);
                    cookieCtx.Properties.UpdateTokenValue("expires_at", updatedExpiresAt.ToString());
                    cookieCtx.Properties.UpdateTokenValue("access_token", response.AccessToken);
                    cookieCtx.Properties.UpdateTokenValue("refresh_token", response.RefreshToken);

                    // Indicate to the cookie middleware that the cookie should be remade (since we have updated it)
                    cookieCtx.ShouldRenew = true;
                }
                else
                {
                    cookieCtx.RejectPrincipal();
                    await cookieCtx.HttpContext.SignOutAsync();
                }
            }
        }
    };
})
.AddOpenIdConnect(options =>
{
    //Use default signin scheme
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    //Keycloak server
    options.Authority = keycloakSection["ServerRealm"];
    //Keycloak client ID
    options.ClientId = keycloakSection["ClientId"];
    //Keycloak client secret
    options.ClientSecret = keycloakSection["ClientSecret"];
    //Keycloak .wellknown config origin to fetch config
    options.MetadataAddress = $"{serverRealm}/.well-known/openid-configuration";
    //Require keycloak to use SSL
    options.RequireHttpsMetadata = true;
    options.GetClaimsFromUserInfoEndpoint = true;
    options.Scope.Add("openid");
    options.Scope.Add("profile");
    options.Scope.Add("roles");
    //Save the token
    options.SaveTokens = true;
    //Token response type, will sometimes need to be changed to IdToken, depending on config.
    options.ResponseType = OpenIdConnectResponseType.Code;
    //SameSite is needed for Chrome/Firefox, as they will give http error 500 back, if not set to unspecified.
    options.NonceCookie.SameSite = SameSiteMode.Unspecified;
    options.CorrelationCookie.SameSite = SameSiteMode.Unspecified;

    options.CallbackPath = "/admin/signin-oidc";

    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = "name",
        RoleClaimType = ClaimTypes.Role,
        ValidateIssuer = true
    };
});

services.AddTransient<UserRepository>();
services.AddTransient<WarehouseRepository>();
// Scoped for background worker
services.AddScoped<ActionLogRepository>();

// Adding services
services.AddTransient<StorageRepository>();

services.AddDbContext<VolwareDBContext>(opts =>
    opts.UseNpgsql(Configuration.GetConnectionString("Default")));

services.Configure<KeycloakOptions>(
    Configuration.GetSection("Keycloak"));

services.Configure<StorageOptions>(
    Configuration.GetSection("Storage"));

services.AddSingleton<IBackgroundQueue>(ctx =>
{
    return new BackgroundQueue(100);
});

var app = builder.Build();

app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "/admin/{controller=User}/{action=Index}/{id?}");

app.Run();
