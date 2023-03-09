import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as PRODUCTS_MOCK } from '../../mocks/products.json'

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    products: PRODUCTS_MOCK,
    event,
  });
};

export const main = middyfy(getProductsList);
