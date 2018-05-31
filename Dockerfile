FROM node:8.9.4-alpine

RUN adduser -h /home -D -H yeoman \
    && chown yeoman:yeoman /home \
    && mkdir /workdir \
    && chown yeoman:yeoman /workdir
USER yeoman

RUN npm config set prefix='/home/global'
ENV NODE_PATH=/home/node_modules \
    PATH=/home/global/bin/:$PATH
RUN npm install -q -g yo
RUN mkdir -p /home/.config/configstore/ \
    && echo '{"clientId": 0, "optOut": true}' > /home/.config/configstore/insight-yo.json

WORKDIR /home/

COPY ["package.json", "/home/"]
COPY ["app", "/home/app"]
COPY ["cf-manifest", "/home/cf-manifest"]
COPY ["gitignores", "/home/gitignores"]
COPY ["license", "/home/license"]
COPY ["newrelic", "/home/newrelic"]
COPY ["npm", "/home/npm"]
COPY ["readme", "/home/readme"]

RUN npm link -q --production

WORKDIR /workdir/
VOLUME /workdir/

ENTRYPOINT ["yo", "18f"]
