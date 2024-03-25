FROM node:21-alpine3.18

WORKDIR /app

COPY ./package*.json ./

COPY ./prisma .

RUN npm install

COPY . .

COPY ./tools/script.sh /script.sh

RUN chmod +x /script.sh

ENTRYPOINT [ "/script.sh"  ]