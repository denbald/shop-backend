import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatNotFoundResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { Product } from "../../types/api-types";
import AWS from 'aws-sdk';

const awsClient = new AWS.DynamoDB.DocumentClient();

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const product = await awsClient.get({
      TableName:  process.env.PRODUCTS_TABLE,
      Key: { id: event.pathParameters.productId },
    })
    .promise().then((data) => {
      return data.Item as { id: string, title: string, description: string, price: number };
    }) ;
  const stock = await awsClient.get({
      TableName:  process.env.STOCKS_TABLE,
      Key: { product_id: event.pathParameters.productId },
    })
    .promise().then((data) => {
      return data.Item as { product_id: string, count: number };
    }) ;

  return product && stock
    ? formatJSONResponse<Product>({ ...product, count: stock.count})
    : formatNotFoundResponse('Product');
};

export const main = middyfy(getProductsById);
