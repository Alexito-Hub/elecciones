FROM node:20-bullseye AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . ./

RUN npm run build

FROM nginx:1.26-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
