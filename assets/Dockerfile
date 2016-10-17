FROM node:argon

CMD [ "npm", "start" ]

RUN mkdir -p /usr/src/app/src
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/package.json

RUN npm install --production

COPY src /usr/src/app/src
