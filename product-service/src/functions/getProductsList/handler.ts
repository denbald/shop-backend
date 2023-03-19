import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { Product } from "../../types/api-types";
import AWS from 'aws-sdk';

const awsClient = new AWS.DynamoDB.DocumentClient();

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const products = await awsClient.scan({ TableName:  process.env.PRODUCTS_TABLE }).promise().then((data) => {
    return data.Items as { id: string, title: string, description: string, price: number }[];
  }) ;
  const stocks = await awsClient.scan({ TableName:  process.env.STOCKS_TABLE }).promise().then((data) => {
    return data.Items as { product_id: string, count: number }[];
  }) ;
  const productsWithCount = products.reduce((result, product) => {
    const stock = stocks.find(stockItem => stockItem.product_id === product.id);

    if (stock) {
      result.push({ ...product, count: stock.count });
    }
    return result;
  }, []);

  return formatJSONResponse<Product[]>(productsWithCount);
};

export const main = middyfy(getProductsList);
