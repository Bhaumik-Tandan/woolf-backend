import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './routers';
import { createContext } from './trpc';

const app = express();
const port = 3000;

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/', (req, res) => {
  res.send('Hello from tRPC server!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`tRPC API at http://localhost:${port}/trpc`);
});