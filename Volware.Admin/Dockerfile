FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app
COPY Volware.Admin/*.csproj ./
COPY Volware.Common/*.csproj ./
COPY Volware.DAL/*.csproj ./
RUN dotnet restore Volware.Admin.csproj
COPY ./ ./
RUN dotnet publish Volware.Admin/Volware.Admin.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "Volware.Admin.dll"]