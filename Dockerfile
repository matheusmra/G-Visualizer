# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o código e builda
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Ajusta Nginx para rodar na porta 3000
RUN sed -i 's/listen\(.*\)80;/listen 3000;/' /etc/nginx/conf.d/default.conf

# Copia o build (ajuste se não for /dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
