FROM node:22.11.0-slim AS builder

RUN apt-get update && apt-get install -y git

WORKDIR /ameya-web

COPY package.json package-lock.json ./     
COPY libs/ ./libs/                         

RUN npm install --legacy-peer-deps

COPY . .

RUN npx update-browserslist-db@latest || true

FROM node:22.11.0-slim

RUN apt-get update && apt-get install -y git

WORKDIR /ameya-web

COPY --from=builder /ameya-web /ameya-web

EXPOSE 3001

CMD ["npm", "start"]