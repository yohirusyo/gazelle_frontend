FROM node:18.13 as develop-stage
WORKDIR /usr/src/gazelle-frontend
COPY . .

FROM develop-stage as build-stage
RUN npm i 
RUN npx quasar build

FROM nginx:1.17.5-alpine as production-stage
COPY --from=build-stage /usr/src/gazelle-frontend/dist/spa /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
