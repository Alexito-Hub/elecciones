# Dockerfile for deploying the Vite React app to Cloud Run
# Build stage
FROM node:20-bullseye AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy sources
COPY . ./

# Define build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_APP_HOST
ARG VITE_OVERLAY_HOST
ARG VITE_APP_TOKEN

# Set environment variables for the build process
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_HOST=$VITE_APP_HOST
ENV VITE_OVERLAY_HOST=$VITE_OVERLAY_HOST
ENV VITE_APP_TOKEN=$VITE_APP_TOKEN

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
