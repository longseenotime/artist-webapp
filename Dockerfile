# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Build Tailwind CSS
RUN npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css --minify

# Remove dev dependencies for smaller image
RUN npm prune --production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S artist -u 1001

# Create necessary directories and set ownership
RUN mkdir -p data public/uploads
RUN chown -R artist:nodejs /app
RUN chmod -R 755 /app/data /app/public/uploads

# Expose port
EXPOSE 3000

USER artist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]