using Volware.Common.Exceptions;

namespace Volware.Common.Extensions
{
    public class VolwareExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public VolwareExceptionHandlerMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger("ErrorHandler");
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (VolwareNotFoundException ex)
            {
                _logger.LogError(ex.Message);
                context.Response.StatusCode = 404;

                await context.Response.WriteAsJsonAsync(ex.Message);
            }
            catch(VolwareBadRequest ex)
            {
                context.Response.StatusCode = 400;

                await context.Response.WriteAsJsonAsync(new
                {
                    Errors = ex.Data
                });
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 400;

                await context.Response.WriteAsync(ex.Message);
            }
        }
    }

    public static class ExceptionHandlerExtensions
    {
        public static IApplicationBuilder UseVolwareExceptionHandler(this IApplicationBuilder builder)
        {
            builder.UseMiddleware<VolwareExceptionHandlerMiddleware>();

            return builder;
        }
    }
}
