FROM node:lts-slim AS base

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN set -eux \
    && corepack enable \
    && corepack prepare pnpm@10 --activate \
    && pnpm --version

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    set -eux \
    && pnpm install --prod --frozen-lockfile --config.confirm-modules-purge=false

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    set -eux \
    && pnpm install --frozen-lockfile --config.confirm-modules-purge=false \
    && pnpm run build

FROM node:lts-slim
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

RUN set -eux \
    && groupadd --system --gid 999 nonroot \
    && useradd --system --gid 999 --uid 999 -m appuser \
    && chown -R appuser:nonroot /app/

USER appuser
EXPOSE 8082
WORKDIR /app

CMD ["node", "dist/index.js"]
