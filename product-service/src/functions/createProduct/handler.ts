import { formatJSONResponse, getServerErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Product } from "../../types/api-types";
import { randomUUID } from "crypto";
import { ddbService } from "../../services/ddb-service";

const createProduct = async (event) => {
  try {
    console.log(event.body);

    const product: Omit<Product, 'id'> = JSON.parse(event.body);
    const id = randomUUID();
    const transactRequest = {
      TransactItems: [
        {
          Put: {
            TableName:  process.env.PRODUCTS_TABLE,
            Item: {
              title: product.title,
              description: product.description,
              price: product.price,
              id,
            },
          }
        },
        {
          Put: {
            TableName:  process.env.STOCKS_TABLE,
            Item: {
              product_id: id,
              count: product.count,
            },
          }
        },
      ]
    };
    await ddbService.transactWrite(transactRequest)
    return formatJSONResponse({ message: `product ${ product.title } width id ${ id } created`})
  } catch {
    return getServerErrorResponse();
  }
};

export const main = middyfy(createProduct);
