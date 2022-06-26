
# Use newest version of the image
FROM node:16.5-alpine3.11 AS build
# Copy application
COPY . /frontend
# Let's set current directory to main app dir 
WORKDIR /frontend
# Install dependencies
RUN npm ci
# Build the application
RUN npm run build
# Another build stage - 
FROM nginx:stable-alpine
# Lets use default port 80 for testing
ENV PORT=3000
# Copy the app to the container
COPY --from=build /frontend/build  /usr/share/nginx/html
# Copy prepared file with $PORT variable
COPY ./nginx.config /etc/nginx/conf.d/
