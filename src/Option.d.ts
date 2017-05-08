export declare type LodashMatches<T> = ((item: T) => boolean) | ({
    [K in keyof T]?: T[K];
});
export default class Option<T> {
    private readonly _present;
    private readonly _value;
    /**
     * All calls to absent now return the same None object
     * this prevents an infinite digest when comparing none to none
     * it also allows none === none to return true, and with a singleton
     * we reduce overhead.
     */
    private static readonly None;
    private readonly _absent;
    static isNully(possiblyUndefinedOrNullValue: any): boolean;
    static fromNullable<T>(possiblyUndefinedOrNullValue: T | undefined): Option<T>;
    static of<T>(value: T): Option<T>;
    static find<T>(arr: T[], fnOrMatch?: LodashMatches<T>): Option<T>;
    static pop<T>(arr: T[]): Option<T>;
    static absent<T>(): Option<T>;
    private constructor(_present?, _value?);
    isPresent(): boolean;
    isAbsent(): boolean;
    get(): T;
    or(orValue: T): T;
    orThrow(error: (typeof Error) | string, message?: string): T;
    /**
     * If the option is nonempty calls the callback on it, else do nothing.
     * "forEach" might seem odd for a singleton, but this is consistent with Scala's Option.
     *
     * @param fn - callback to call
     */
    forEach(fn: (value: T) => any): void;
    orCall(fn: () => T): T;
    /**
     * If the option is nonempty return it, otherwise return the result of evaluating an alternative expression.
     *
     * @param alternative - the alternative expression
     * @returns {Option<T>}
     */
    orElse(alternative: Option<T>): Option<T>;
    /** Returns this $option if it is nonempty '''and''' applying the predicate $p to
     * this $option's value returns true. Otherwise, return $none.
     *
     *  @param  is   the predicate used for testing.
     */
    filter(is: (value: T) => boolean): Option<T>;
    /**
     * Returns this $option if it is nonempty '''and''' and is true when the predicate $p
     * is compared with strict equality to this $option's value returns true.
     * Otherwise, return $none.
     *
     *  @param  is   the predicate used for testing.
     */
    filterValue(is: T): Option<T>;
    /**
     * Returns this $option if it is nonempty '''and''' and is false when the predicate $p
     * is compared with strict equality to this $option's value returns true.
     * Otherwise, return $none.
     *
     *  @param  is   the predicate used for testing.
     */
    filterNotValue(is: T): Option<T>;
    /** Tests whether the option contains a given value as an element.
     *
     *  @param elem the element to test.
     *  @return `true` if the option has an element that is equal (as
     *  determined by `===`) to `elem`, `false` otherwise.
     */
    contains(elem: T): boolean;
    /** Returns true if this option is nonempty '''and''' the predicate
     * $p returns true when applied to this $option's value.
     * Otherwise, returns false.
     *
     *  @param  is   the predicate to test
     */
    exists(is: (value: T) => boolean): boolean;
    map<V>(transformer: (value: T) => V): Option<V>;
    flatMap<V>(transformer: (value: T) => Option<V>): Option<V>;
    promiseTransform<V>(q: PromiseConstructor, transformer: (value: T) => Promise<V>): Promise<Option<V>>;
}
