import {IEnvironmentConfig} from '../app/domain/interfaces/IEnvironmentConfig';

const devAwsApiGatewayBaseUrl = "baseUrl"

export const environmentConfig: IEnvironmentConfig = {
  entities: {
    post: {
      httpConfig: {
        baseUrl: devAwsApiGatewayBaseUrl,
        dynamoDb: {
          create: () => `${devAwsApiGatewayBaseUrl}/dev/dynamodb/posts`,
          read: (id: string) => `${devAwsApiGatewayBaseUrl}/dev/dynamodb/posts/%id%`.replace('%id%', id),
          readList: () => `${devAwsApiGatewayBaseUrl}/dev/dynamodb/posts`,
          update: (id: string) => `${devAwsApiGatewayBaseUrl}/dev/dynamodb/posts/%id%`.replace('%id%', id),
          delete: (id: string) => `${devAwsApiGatewayBaseUrl}/dev/dynamodb/posts/%id%`.replace('%id%', id),
        },
        jsonPlaceholder: {
          create: () => `${devAwsApiGatewayBaseUrl}/dev/json-placeholder/posts`,
          read: (id: string) => `${devAwsApiGatewayBaseUrl}/dev/json-placeholder/posts/%id%`.replace('%id%', id),
          readList: () => `${devAwsApiGatewayBaseUrl}/dev/json-placeholder/posts`,
          update: (id: string) => `${devAwsApiGatewayBaseUrl}/dev/json-placeholder/posts/%id%`.replace('%id%', id),
          delete: (id: string) => `${devAwsApiGatewayBaseUrl}/dev/json-placeholder/posts/%id%`.replace('%id%', id),
        }
      },
    }
  }
}
