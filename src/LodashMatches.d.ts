export declare type LodashMatches<T> = ((item: T) => boolean) | ({
    [K in keyof T]?: T[K];
});
