import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as PRODUCTS_MOCK } from '../../mocks/products.json'
import schema from './schema';
import { Product } from "../../types/api-types";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const products = await Promise.resolve(PRODUCTS_MOCK);

  return formatJSONResponse<Product[]>(products);
};

export const main = middyfy(getProductsList);
