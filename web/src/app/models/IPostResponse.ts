import { IPost } from './IPost';

export interface IPostResponse {
    totalPosts: number;
    posts: IPost[];
}