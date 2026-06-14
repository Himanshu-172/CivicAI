FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci

COPY tsconfig.base.json ./
COPY apps/api apps/api
RUN npm run build --workspace=@civic-ai/api

USER node
EXPOSE 4000
CMD ["npm", "run", "start", "--workspace=@civic-ai/api"]

