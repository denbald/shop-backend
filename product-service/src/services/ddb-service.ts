import AWS from 'aws-sdk';

class DdbService {

  private awsClient = new AWS.DynamoDB.DocumentClient();

  public scanTable<T = any>(tableName: string): Promise<T[]> {
    return this.awsClient.scan({ TableName:  tableName }).promise().then((data) => {
      return data.Items as T[];
    });
  }

  public getItem<T>(tableName: string, item: { [key: string]: any }): Promise<T> {
    return this.awsClient.get({ TableName: tableName, Key: item })
      .promise().then((data) => {
        return data.Item as T;
      });
  }

  public transactWrite(request) {
    return this.awsClient.transactWrite(request).promise();
  }

}

export const ddbService = new DdbService();
