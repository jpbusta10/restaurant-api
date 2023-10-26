FROM node:20

WORKDIR /src

COPY package.json .

RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node

COPY . .

CMD [ "npm", "start" ]