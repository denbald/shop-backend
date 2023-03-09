import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as PRODUCTS_MOCK } from '../../mocks/products.json'

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    product: PRODUCTS_MOCK.find(product => product.id === event.pathParameters.productId),
    event,
  });
};

export const main = middyfy(getProductsById);
