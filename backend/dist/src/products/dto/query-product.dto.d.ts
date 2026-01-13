export declare enum SortBy {
    NEWEST = "newest",
    OLDEST = "oldest",
    PRICE_LOW = "price_low",
    PRICE_HIGH = "price_high",
    NAME_ASC = "name_asc",
    NAME_DESC = "name_desc"
}
export declare class QueryProductDto {
    search?: string;
    categoryId?: string;
    sortBy?: SortBy;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
}
