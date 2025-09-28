FROM node:22-alpine

WORKDIR /app

# Copy shared dependencies
COPY shared/ ./shared/

# Copy service files
COPY services/client-service/package.json ./
RUN npm install

COPY services/client-service/src/ ./src/

EXPOSE 3001

CMD ["node", "src/server.js"]
