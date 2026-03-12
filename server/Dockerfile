# --- Builder Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for any build steps if needed, though pure Node/Express often doesn't need a build step, 
# 'npm ci' ensures strict lockfile adherence)
RUN npm ci

# Copy the rest of the application code
COPY . .

# (If there were a build step like TypeScript compilation, it would go here)
# RUN npm run build


# --- Production Stage ---
FROM node:20-alpine AS runner

# Set environment to production
ENV NODE_ENV=production

WORKDIR /app

# Change ownership of the app directory to the non-root 'node' user
RUN chown node:node /app

# Switch to the non-root user for better security
USER node

# Copy package files
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the application code from the builder stage
COPY --chown=node:node --from=builder /app ./

# Expose the application port (assuming 5000 based on standard setup, adjustable via env)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
