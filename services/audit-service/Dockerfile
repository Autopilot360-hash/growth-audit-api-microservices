FROM node:20-alpine
WORKDIR /app
COPY services/audit-service/package*.json ./
RUN npm install
COPY services/audit-service/ .
EXPOSE 3002
CMD ["npm", "start"]
