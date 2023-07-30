using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace Volware.Common.Extensions
{
    public static class AuthenticationExtensions
    {
        public static IServiceCollection ConfigureJWT(this IServiceCollection services, bool IsDevelopment, string publicKeyJWT)
        {
            var AuthenticationBuilder = services.AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    //RoleClaimType = "roles",
                    ValidateAudience = false,
                    ValidateIssuer = true,
                    ValidIssuers = new[] { "https://id.vermilion.net.ua/realms/vermilion" },
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = BuildRSAKey(publicKeyJWT),
                    ValidateLifetime = true
                };

                //opts.Events = new JwtBearerEvents
                //{
                //    OnAuthenticationFailed = (opts) =>
                //    {
                //        return Task.FromResult(opts);
                //    },
                //    OnChallenge = (opts) =>
                //    {
                //        return Task.FromResult(opts);
                //    },
                //    OnForbidden = (opts) =>
                //    {
                //        return Task.FromResult(opts);
                //    },
                //    OnMessageReceived = (opts) =>
                //    {
                //        return Task.FromResult(opts);
                //    },
                //    OnTokenValidated = (opts) =>
                //    {
                //        return Task.FromResult(opts);
                //    }
                //};
            });

            return services;
        }

        private static RsaSecurityKey BuildRSAKey(string publicKeyJWT)
        {
            RSA rsa = RSA.Create();

            rsa.ImportSubjectPublicKeyInfo(

                source: Convert.FromBase64String(publicKeyJWT),
                bytesRead: out _
            );

            var IssuerSigningKey = new RsaSecurityKey(rsa);

            return IssuerSigningKey;
        }
    }
}
