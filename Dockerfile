FROM node:6.10.2-alpine

# Set HOME to /tmp so we are guaranteed to be able to write to it
ENV NODE_PATH='/src/node_modules/:$NODE_PATH' \
    PATH=/src/node_modules/.bin/:$PATH \
    HOME=/tmp/
    
WORKDIR /src/

COPY ["package.json", "/src/"]
RUN npm install -q && npm install -q yo

COPY ["about-yml", "/src/about-yml"]
COPY ["app", "/src/app"]
COPY ["cf-manifest", "/src/cf-manifest"]
COPY ["gitignores", "/src/gitignores"]
COPY ["license", "/src/license"]
COPY ["npm", "/src/npm"]
COPY ["readme", "/src/readme"]
COPY ["shared-config", "/src/shared-config"]
COPY ["todo", "/src/todo"]
RUN npm link -q

WORKDIR /workdir/
VOLUME /workdir/

ENTRYPOINT ["yo", "--no-insight", "--no-update-notifier", "18f"]
