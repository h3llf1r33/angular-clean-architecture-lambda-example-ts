import {IEnvironmentConfig} from '../app/domain/interfaces/IEnvironmentConfig';

const prodAwsApiGatewayBaseUrl = "baseUrl"

export const environmentConfig: IEnvironmentConfig = {
  entities: {
    post: {
      httpConfig: {
        baseUrl: prodAwsApiGatewayBaseUrl,
        dynamoDb: {
          create: () => `${prodAwsApiGatewayBaseUrl}/dev/dynamodb/posts`,
          read: (id: string) => `${prodAwsApiGatewayBaseUrl}/dev/dynamodb/posts/%id%`.replace('%id%', id),
          readList: () => `${prodAwsApiGatewayBaseUrl}/dev/dynamodb/posts`,
          update: (id: string) => `${prodAwsApiGatewayBaseUrl}/dev/dynamodb/posts/%id%`.replace('%id%', id),
          delete: (id: string) => `${prodAwsApiGatewayBaseUrl}/dev/dynamodb/posts/%id%`.replace('%id%', id),
        },
        jsonPlaceholder: {
          create: () => `${prodAwsApiGatewayBaseUrl}/dev/json-placeholder/posts`,
          read: (id: string) => `${prodAwsApiGatewayBaseUrl}/dev/json-placeholder/posts/%id%`.replace('%id%', id),
          readList: () => `${prodAwsApiGatewayBaseUrl}/dev/json-placeholder/posts`,
          update: (id: string) => `${prodAwsApiGatewayBaseUrl}/dev/json-placeholder/posts/%id%`.replace('%id%', id),
          delete: (id: string) => `${prodAwsApiGatewayBaseUrl}/dev/json-placeholder/posts/%id%`.replace('%id%', id),
        }
      },
    }
  }
}
