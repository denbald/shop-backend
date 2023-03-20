const { BatchWriteItemCommand, DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const AWS = require('aws-sdk');

const PRODUCTS_MOCK = require('./products.json');
const STOCKS_MOCK = require('./stocks.json');

const REGION = 'eu-central-1';

const ddbClient = new DynamoDBClient({ region: REGION });

const PRODUCTS_TABLE_NAME = 'products';
const STOCKS_TABLE_NAME = 'stocks';

const populateTables = async () => {
  const batchWriteRequest = {
    RequestItems: {
      [PRODUCTS_TABLE_NAME]: PRODUCTS_MOCK.map(({ id, title, description, price }) => ({
        PutRequest: {
          Item: AWS.DynamoDB.Converter.marshall({ id, title, description, price }),
        }
      })),
      [STOCKS_TABLE_NAME]: STOCKS_MOCK.map(({ product_id, count }) => ({
        PutRequest: {
          Item: AWS.DynamoDB.Converter.marshall({ product_id, count }),
        }
      })),
    }
  }
  const command = new BatchWriteItemCommand(batchWriteRequest);
  const response = await ddbClient.send(command);
  console.log(response);
}

populateTables();
