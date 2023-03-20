import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, getServerErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { Product } from "../../types/api-types";
import { ddbService } from "../../services/ddb-service";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    console.log('getProductsList request');
    const products = await ddbService.scanTable<Omit<Product, 'count'>>(process.env.PRODUCTS_TABLE);
    const stocks = await ddbService.scanTable<{ product_id: string, count: number }>(process.env.STOCKS_TABLE);
    const productsWithCount = products.reduce((result, product) => {
      const stock = stocks.find(stockItem => stockItem.product_id === product.id);

      if (stock) {
        result.push({ ...product, count: stock.count });
      }
      return result;
    }, []);

    return formatJSONResponse<Product[]>(productsWithCount);
  } catch {
    return getServerErrorResponse();
  }
};

export const main = middyfy(getProductsList);
