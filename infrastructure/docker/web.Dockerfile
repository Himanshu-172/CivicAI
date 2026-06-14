FROM node:22-alpine

WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm ci

COPY tsconfig.base.json ./
COPY apps/web apps/web
RUN npm run build --workspace=@civic-ai/web

USER node
EXPOSE 5173
CMD ["npm", "run", "preview", "--workspace=@civic-ai/web"]

