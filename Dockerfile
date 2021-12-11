# FROM node:14.16.0-alpine
#FROM node:16-alpine3.14
FROM node:16-alpine
WORKDIR /app
RUN chown -R root:root /app && chmod -R 771 /app
COPY package.json .
COPY yarn.lock .
COPY prisma prisma
RUN yarn install
RUN npx prisma generate
COPY . .
RUN npx tsc
EXPOSE 3000
CMD npx prisma migrate deploy && yarn start