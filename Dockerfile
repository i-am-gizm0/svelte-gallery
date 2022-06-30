# Use this image to build the app
FROM node:16.15 as builder

WORKDIR /app

# Copy everything to the container
COPY . .
# Install the dependencies
RUN npm ci

# Fix some security issues
RUN npm audit fix

# Build the app
RUN npm run build

# This will be the actual image (keeps the weight down)
FROM node:16.15

WORKDIR /gallery

# Copy dependency list
COPY --from=builder /app/package*.json ./

# Clean install production dependencies
RUN npm ci --omit=dev

# Fix some security issues
RUN npm audit fix --omit=dev

# Copy build app
COPY --from=builder /app/build ./

RUN mkdir ./galleries
RUN mkdir ./cache

EXPOSE 3000
CMD ["node", "./index.js"]