FROM node:20-alpine

WORKDIR /app

# Instalar dependencias del sistema para sharp (procesado de imágenes)
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Directorio para subida de fotos
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

EXPOSE 3001

CMD ["node", "src/index.js"]
