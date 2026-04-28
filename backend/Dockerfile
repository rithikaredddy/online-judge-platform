FROM node:20-slim

# Install Docker CLI so backend can spawn containers
RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
