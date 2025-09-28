FROM node:22-alpine

WORKDIR /app

COPY services/api-gateway/package.json ./
RUN npm install

COPY services/api-gateway/src/ ./src/

EXPOSE 3000

CMD ["node", "src/server.js"]
