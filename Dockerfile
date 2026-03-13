# Dockerfile for deploying the Vite React app to Cloud Run
# Build stage
FROM node:20-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources
COPY . ./

# Copy sources
COPY . ./

# Build the app
RUN npm run build

# Production stage
FROM nginx:1.26-alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
