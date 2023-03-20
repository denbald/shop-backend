import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        cors: true,
        responses: {
          200: {
            description: 'List of Products',
            bodyType: 'Products',
          },
          500: {
            description: 'Internal Server Error',
            bodyType: 'ErrorResponse',
          }
        }
      },
    },
  ],
};
