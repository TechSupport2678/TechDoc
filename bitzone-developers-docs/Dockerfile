FROM node:18-bullseye

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

EXPOSE 3000
ENV AUTH_USER=admin
ENV AUTH_PASS=admin
CMD ["node","server.js"]