FROM node:alpine

WORKDIR /src
ADD . /src
RUN npm i

WORKDIR /src/public
RUN npm i

WORKDIR /src

EXPOSE 80
CMD ["node", "index"]