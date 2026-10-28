# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Stage 1: build the React SPA into backend/public
# -----------------------------------------------------------------------------
FROM node:lts-slim AS frontend

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci

COPY frontend/ ./frontend/
# Vite outDir is ../backend/public (see frontend/vite.config.js)
RUN mkdir -p backend/public && cd frontend && npm run build

# -----------------------------------------------------------------------------
# Stage 2: Rails API + static SPA
# -----------------------------------------------------------------------------
FROM ruby:3.3-slim AS app

# Build deps for native gems (pg); runtime needs libpq5.
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
      build-essential \
      libpq-dev \
      libpq5 \
      curl \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /rails

ENV RAILS_ENV=production \
    BUNDLE_PATH="/usr/local/bundle" \
    RAILS_SERVE_STATIC_FILES=true \
    RAILS_LOG_TO_STDOUT=true

COPY backend/Gemfile backend/Gemfile.lock ./

# Deployment mode + skip development/test groups (sqlite3, rubocop, etc.)
RUN bundle config set --local deployment "true" && \
    bundle config set --local without "development:test" && \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git

COPY backend/ ./
COPY --from=frontend /app/backend/public/ ./public/

RUN mkdir -p tmp/pids tmp/cache log storage && \
    chmod +x bin/rails bin/docker-entrypoint && \
    # Normalize CRLF if the repo was edited on Windows.
    sed -i 's/\r$//' bin/docker-entrypoint bin/rails

# Drop compilers after gems are built (keep libpq5).
RUN apt-get purge -y --auto-remove build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 3000

ENTRYPOINT ["./bin/docker-entrypoint"]
# PORT is set by Render; expand at runtime via shell form.
CMD ["bash", "-c", "bin/rails server -b 0.0.0.0 -p ${PORT:-3000}"]
