FROM node:20-alpine
WORKDIR /app
COPY services/analytics-service/package*.json ./
RUN npm install
COPY services/analytics-service/ .
EXPOSE 3003
CMD ["npm", "start"]
