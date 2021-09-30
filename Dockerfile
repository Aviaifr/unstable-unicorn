FROM node:14

ENV NODE_ENV=development
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# Bundle app source
COPY server /usr/src/app/server

COPY ./entrypoint.sh /entrypoint.sh

RUN npm install

ENTRYPOINT ["bash", "/entrypoint.sh"]
