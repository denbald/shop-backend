import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        responses: {
          200: {
            description: 'Product Created',
          },
          400: {
            description: 'Bad request',
            bodyType: 'ErrorResponse',
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
