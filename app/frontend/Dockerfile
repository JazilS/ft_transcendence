FROM node:21-alpine3.18

WORKDIR /app

COPY package*.json .

# RUN ln -s ../shared ./shared

RUN npm install

COPY . .

CMD ["npm", "run" , "dev"]