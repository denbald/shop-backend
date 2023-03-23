import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatNotFoundResponse, getServerErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { Product } from "../../types/api-types";
import { ddbService } from "../../services/ddb-service";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log(event.pathParameters);

    const product = await ddbService.getItem<Omit<Product, 'count'>>(
      process.env.PRODUCTS_TABLE,
      { id: event.pathParameters.productId }
    );
    const stock = await ddbService.getItem<{ product_id: string, count: number }>(
      process.env.STOCKS_TABLE,
      { product_id: event.pathParameters.productId }
    );

    return product && stock
      ? formatJSONResponse<Product>({ ...product, count: stock.count})
      : formatNotFoundResponse('Product');
  } catch {
    return getServerErrorResponse();
  }
};

export const main = middyfy(getProductsById);
