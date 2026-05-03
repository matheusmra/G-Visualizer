# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências (usando cache do Docker)
COPY package*.json ./
RUN npm install

# Copia o código e builda
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
# Copia o build para o diretório do Nginx (ajuste 'dist' se o seu build sair em outra pasta)
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 (o Coolify vai mapear para 3000 como configuramos)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
