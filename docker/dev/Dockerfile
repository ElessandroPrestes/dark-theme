FROM node:20-alpine

WORKDIR /app

COPY .npmrc package*.json ./
RUN npm ci

COPY . .

ENV CHOKIDAR_USEPOLLING=true

EXPOSE 4200

CMD ["npx", "ng", "serve", "--host", "0.0.0.0", "--poll", "500"]
