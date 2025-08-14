FROM node:20

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
COPY .env.prod ./
COPY prisma ./prisma
RUN npx prisma generate

RUN pnpm build



EXPOSE 3000
CMD ["pnpm", "start:dev"]