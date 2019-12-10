export interface IDateRange {
    begin: Date,
    end: Date
}

export interface IPostSearchRequest {
    tags: string[], 
    date: IDateRange
}

