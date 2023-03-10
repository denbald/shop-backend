import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Headers" : "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = <R>(response: R) => {
  return {
    statusCode: 200,
    headers: {
      ...CORS_HEADERS,
    },
    body: JSON.stringify(response)
  }
}

export const formatNotFoundResponse = (entity: string) => {
  return {
    statusCode: 404,
    headers: {
      ...CORS_HEADERS,
    },
    body: JSON.stringify({
      message: `${ entity } Not Found`,
    }),
  };
}

export const getServerErrorResponse = (error?: string) => {
  return {
    statusCode: 500,
    headers: {
      ...CORS_HEADERS,
    },
    body: JSON.stringify({
      message: error || 'Internal Server Error',
    }),
  };
}
