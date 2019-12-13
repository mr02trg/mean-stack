import { IDocument } from './IDocument';

export interface IPost {
    id: string;
    title: string;
    content: string;
    tags: string[];
    documents: (File|IDocument)[];
    author: string;
    isPublic: boolean;
}