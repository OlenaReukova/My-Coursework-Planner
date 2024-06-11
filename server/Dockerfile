# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.0.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

# Copy the rest of the source files into the image.
COPY . .

# Install dependencies
RUN npm install

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run start