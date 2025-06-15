FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./

# Installe toutes les dépendances, incluant class-validator
RUN npm install class-validator class-transformer

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production PORT=5000
EXPOSE $PORT

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["npm", "run", "start:prod"]
