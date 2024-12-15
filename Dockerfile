FROM node:20.6.1-bullseye-slim
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm i

CMD "npm" "run" "start:dev"