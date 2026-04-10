FROM node:22-alpine

WORKDIR /app/api

COPY api/package*.json ./
RUN npm install

COPY api/ ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
