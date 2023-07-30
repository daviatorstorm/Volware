FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /app
COPY Volware.Api/*.csproj ./
COPY Volware.Common/*.csproj ./
COPY Volware.DAL/*.csproj ./
RUN dotnet restore Volware.Api.csproj
COPY ./ ./
RUN dotnet publish Volware.Api/Volware.Api.csproj -c Release -o out

FROM node:lts-alpine as build-pwa
WORKDIR /app
COPY volware.pwa/package*.json ./
RUN npm i
COPY volware.pwa ./
RUN npm run build:staging

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app/out .
COPY --from=build-pwa /app/build ./wwwroot
ENTRYPOINT ["dotnet", "Volware.Api.dll"]