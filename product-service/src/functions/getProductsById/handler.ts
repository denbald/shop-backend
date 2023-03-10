import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatNotFoundResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { default as PRODUCTS_MOCK } from '../../mocks/products.json'
import schema from './schema';
import { Product } from "../../types/api-types";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const product = await PRODUCTS_MOCK.find(product => product.id === event.pathParameters.productId)

  return product
    ? formatJSONResponse<Product>(product)
    : formatNotFoundResponse('Product');
};

export const main = middyfy(getProductsById);
