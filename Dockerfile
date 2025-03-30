# NB! Must be ran from monorepo root context
ARG PORT=3000
FROM alpine:latest AS base
RUN apk update
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    tzdata \
    icu-data-full \
    dumb-init
    
# Dependencies
FROM base AS deps
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
# https://github.com/nodejs/docker-node?tab=readme-ov-file#nodealpine
# RUN apk add --no-cache gcompat

WORKDIR /docker-puppeteer
COPY package.json package-lock.json* ./

RUN npm ci

# Builder
FROM base AS builder
WORKDIR /docker-puppeteer
COPY --from=deps /docker-puppeteer .
COPY . .
RUN npm run build 

# Create image
FROM base AS runner
WORKDIR /docker-puppeteer
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --from=deps /docker-puppeteer .
COPY --from=builder /docker-puppeteer/dist ./dist

RUN npm prune --omit=dev

EXPOSE $PORT

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /docker-puppeteer \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /docker-puppeteer 
# Create userDatas dir
RUN mkdir -p /docker-puppeteer/userDatas \
    && chown -R pptruser:pptruser /docker-puppeteer/userDatas

# Run everything after as non-privileged user.
USER pptruser

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

ENV PORT=3000

CMD ["npm", "run", "start"]