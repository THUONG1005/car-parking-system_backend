FROM node:alpine

RUN mkdir -p car-parking-system && chown -R node:node car-parking-system

WORKDIR /car-parking-system

COPY . .

USER node

RUN yarn install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn","start"]
