FROM node:18-bullseye

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npx","docusaurus","serve","build","--host","0.0.0.0","--port","3000"]