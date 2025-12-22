ARG NODE_VERSION=24.12.0

# Create build stage
FROM node:${NODE_VERSION}-slim AS build

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy workspace configuration files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY turbo.json ./

# Copy all package.json files to leverage Docker cache
COPY apps/web/package.json ./apps/web/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/layer-core/package.json ./packages/layer-core/
COPY packages/layer-emails/package.json ./packages/layer-emails/
COPY packages/site-config/package.json ./packages/site-config/

# Install dependencies for the entire workspace
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --shamefully-hoist

# Copy all source files
COPY apps/web ./apps/web
COPY packages ./packages

# Build the web application using turbo
RUN pnpm turbo build --filter=web

# Create a new stage for the production image
FROM node:${NODE_VERSION}-slim

# Enable pnpm in production stage
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy the output from the build stage to the working directory
COPY --from=build /app/apps/web/.output ./

# Define environment variables
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Expose the port the application will run on
EXPOSE 9009

# Start the application
CMD ["node", "/app/server/index.mjs"]

