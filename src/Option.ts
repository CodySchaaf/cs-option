import {LodashMatches} from './LodashMatches';

class TypeGuards {
  static isFn(fn: any): fn is Function {
    return typeof fn === 'function';
  }

  static AssertNever(x: never): never {
    throw new Error('Unexpected object: ' + x);
  }
}

class Option<T> {
  /**
   * All calls to absent now return the same None object
   * this prevents an infinite digest when comparing none to none
   * it also allows none === none to return true, and with a singleton
   * we reduce overhead.
   */
  private static readonly None = Object.freeze(new Option<any>());

  private readonly _absent: boolean;

  static isNully(possiblyUndefinedOrNullValue: any): boolean {
    return possiblyUndefinedOrNullValue == null;
  }

  static fromNullable<T>(possiblyUndefinedOrNullValue: T|undefined): Option<T> {
    if (possiblyUndefinedOrNullValue == null) {
      return Option.absent<T>();
    }
    return Option.of<T>(possiblyUndefinedOrNullValue);
  }

  static of<T>(value: T): Option<T> {
    if (value == null) {
      throw 'Cannot call of() on a nullable. Use fromNullable instead';
    }
    return new Option<T>(true, value);
  }

  static find<T>(arr: T[], fnOrMatch?: LodashMatches<T>): Option<T> {
    /* tslint:disable:no-var-keyword */
    var _: any = <any>_ || undefined;
    /* tslin:enable:no-var-keyword */
    if (typeof _ !== 'undefined' && _.find) {
      return Option.fromNullable(_.find(arr, fnOrMatch) as T);
    } else {
      if (TypeGuards.isFn(fnOrMatch)) {
        return Option.fromNullable(arr.find(fnOrMatch));
      } else {
        throw 'Install lodash to use find without a function';
      }
    }
  }

  static pop<T>(arr: T[]): Option<T> {
    Option.get(class {public name: string; }, 'name');
    return Option.fromNullable(arr.pop());
  }

  static get<T extends Object, K extends keyof T>(obj: T, key: K): Option<T[K]> {
    return Option.fromNullable(obj[key]);
  }

  static absent<T>(): Option<T> {
    return this.None as Option<T>;
  }

  private constructor(private readonly _present = false, private readonly _value: T|undefined = undefined) {
    this._absent = !this._present;
  }

  isPresent(): boolean {
    return this._present;
  }

  isAbsent(): boolean {
    return this._absent;
  }

  get(): T {
    if (this._absent) {
      throw 'Option is absent';
    }
    return this._value!;
  }

  or(orValue: T): T {
    if (this._present) {
      return this._value!;
    }
    return orValue;
  }

  orThrow(error: (typeof Error) | string, message?: string): T {
    if (this._present) { return this._value!; }
    if (TypeGuards.isFn(error)) {
      throw new error(message);
    } else {
      throw error;
    }
  }

  /**
   * If the option is nonempty calls the callback on it, else do nothing.
   * "forEach" might seem odd for a singleton, but this is consistent with Scala's Option.
   *
   * @param fn - callback to call
   */
  forEach(fn: (value: T) => any): void {
    if (this._present) {
      fn(this._value!);
    }
  }

  orCall(fn: () => T): T {
    if (this._absent) { return fn(); }
    return this._value!;
  }

  /**
   * If the option is nonempty return it, otherwise return the result of evaluating an alternative expression.
   *
   * @param alternative - the alternative expression
   * @returns {Option<T>}
   */
  orElse(alternative: Option<T>): Option<T> {
    if (this._present) {
      return this;
    }
    return alternative;
  }

  /** Returns this $option if it is nonempty '''and''' applying the predicate $p to
   * this $option's value returns true. Otherwise, return $none.
   *
   *  @param  is   the predicate used for testing.
   */
  filter(is: (value: T) => boolean): Option<T> {
    if (this._absent || is(this._value!)) {
      return this;
    }
    return Option.absent<T>();
  }

  /**
   * Returns this $option if it is nonempty '''and''' and is true when the predicate $p
   * is compared with strict equality to this $option's value returns true.
   * Otherwise, return $none.
   *
   *  @param  is   the predicate used for testing.
   */
  filterValue(is: T): Option<T> {
    if (this._absent || this._value === is) {
      return this;
    }
    return Option.absent<T>();
  }

  /**
   * Returns this $option if it is nonempty '''and''' and is false when the predicate $p
   * is compared with strict equality to this $option's value returns true.
   * Otherwise, return $none.
   *
   *  @param  is   the predicate used for testing.
   */
  filterNotValue(is: T): Option<T> {
    if (this._absent || this._value !== is) {
      return this;
    }
    return Option.absent<T>();
  }

  /** Tests whether the option contains a given value as an element.
   *
   *  @param elem the element to test.
   *  @return `true` if the option has an element that is equal (as
   *  determined by `===`) to `elem`, `false` otherwise.
   */
  contains(elem: T): boolean {
    return this._present && this._value === elem;
  }

  /** Returns true if this option is nonempty '''and''' the predicate
   * $p returns true when applied to this $option's value.
   * Otherwise, returns false.
   *
   *  @param  is   the predicate to test
   */
  exists(is: (value: T) => boolean): boolean {
    return this._present && is(this._value!);
  }

  map<V>(transformer: (value: T) => V): Option<V> {
    if (this._present) {
      const result: V = transformer(this._value!);
      return Option.fromNullable(result);
    }
    return Option.absent<V>();
  }

  flatMap<V>(transformer: (value: T) => Option<V>): Option<V> {
    if (this._present) {
      const newValue = transformer(this._value!);
      if (newValue instanceof Option) {
        return newValue;
      } else {
        throw 'flatMap must produce an option';
      }
    }
    return Option.absent<V>();
  }

  promiseTransform<V>(q: PromiseConstructor, transformer: (value: T) => Promise<V>): Promise<Option<V>> {
    if (this._present) {
      return transformer(this._value!).then(v => Option.fromNullable<V>(v));
    }
    return q.resolve(Option.absent<V>());
  }
}

export = Option;
