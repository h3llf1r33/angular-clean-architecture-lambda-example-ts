export type IEnvironmentConfigValue = (args?: any) => string

export interface IEnvironmentConfig {
  entities: {
    post: {
      httpConfig: {
        baseUrl: string,
        dynamoDb: {
          create: IEnvironmentConfigValue;
          read: IEnvironmentConfigValue;
          readList: IEnvironmentConfigValue;
          update: IEnvironmentConfigValue;
          delete: IEnvironmentConfigValue;
        },
        jsonPlaceholder: {
          create: IEnvironmentConfigValue;
          read: IEnvironmentConfigValue;
          readList: IEnvironmentConfigValue;
          update: IEnvironmentConfigValue;
          delete: IEnvironmentConfigValue;
        }
      }
    }
  }
}
