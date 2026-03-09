FROM node:22-slim AS builder

RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g npm@latest

WORKDIR /appflyte-web
COPY package.json package-lock.json ./
COPY libs/ ./libs/

RUN npm ci --legacy-peer-deps

COPY . .
RUN npx update-browserslist-db@latest || true

FROM node:22-slim

RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g npm@latest

WORKDIR /appflyte-web
COPY --from=builder /appflyte-web /appflyte-web

COPY .trivyignore /root/.trivyignore

EXPOSE 3000
ENV DISABLE_ESLINT_PLUGIN=true
ENV GENERATE_SOURCEMAP=false

CMD ["npm", "start"]