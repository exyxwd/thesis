FROM oven/bun:1 as build
WORKDIR /app
COPY package*.json ./
COPY bun.lockb ./
RUN apt-get update && apt-get install -y unzip
RUN bun install
COPY . .
RUN bun run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]