# Stage 1: Build the TypeScript application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies, including TypeScript
RUN npm ci

# Copy application source
COPY . .

# Compile TypeScript into dist/
RUN npm run build


# Stage 2: Run the production application
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled application from the builder stage
COPY --from=builder /app/dist ./dist

# Document the application's port
EXPOSE 5001

# Start the compiled Express server
CMD ["npm", "start"]