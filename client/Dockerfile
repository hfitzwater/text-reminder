FROM node:current-alpine3.11 as builder

WORKDIR /text-reminder-client

# Start with `npm ci` before copying app code
# in order to preserve this layer
COPY ./package*.json ./
RUN npm ci

COPY . .

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG VUE_APP_API_HOST
ENV VUE_APP_API_HOST=api.textreminder.io

ARG VUE_APP_API_PORT
ENV VUE_APP_API_PORT=1337

RUN npm run build

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /text-reminder-client/dist /usr/share/nginx/html
COPY conf /etc/nginx
EXPOSE 80
