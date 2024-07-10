# syntax=docker/dockerfile:1

#parent image started with comand ARG or just FROM (this is the first layer of a docker image)
ARG NODE_VERSION=20.0.0

# we downloaded a node image and we want to pull node from that image
FROM node:${NODE_VERSION}-alpine

# next layer of the image-we specify working directory of the image
WORKDIR /server

# I want to copy the files from current derectory (first .), to the folder (second . root directory where the image created, upper we specify working derectory) into the image.
COPY . .

# Installing dependencies, when the image has been created -to add all the dependencies to the image
RUN npm install


# Expose the port that the application (container) listens on.
EXPOSE 5001

# Container, based on the image, is running application - Run the application.
CMD ["node", "server.js"]