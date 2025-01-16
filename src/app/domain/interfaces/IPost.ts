export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const examplePost: IPost = {
  id: 1,
  userId: 100,
  title: "title",
  body: "body",
}
