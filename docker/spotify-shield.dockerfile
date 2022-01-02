FROM node:17-alpine3.12

ENV SS_DOCKER=true

WORKDIR /opt/spotifyshield

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn install

ADD . /opt/spotifyshield/

VOLUME [ "/etc/spotifyshield", "/opt/spotifyshield/data" ]

CMD [ "yarn", "run", "start" ]
EXPOSE 8080