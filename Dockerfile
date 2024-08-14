FROM node:20.16-alpine AS base

RUN apk update --no-cache && apk add tzdata
ENV TZ=UTC

FROM base AS build

WORKDIR /usr/src/app

COPY . .

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --no-lockfile

RUN yarn lint

RUN yarn build

FROM base AS production

WORKDIR /usr/src/app

RUN apk update --no-cache && apk add tzdata

ENV TZ=UTC

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json

# Install only production dependencies
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --production --no-lockfile

EXPOSE 3000

CMD ["node", "dist/main.js"]
