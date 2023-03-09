import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as PRODUCTS_MOCK } from '../../mocks/products.json'

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const products = await Promise.resolve(PRODUCTS_MOCK);

  return formatJSONResponse({
    products,
    event,
  });
};

export const main = middyfy(getProductsList);
