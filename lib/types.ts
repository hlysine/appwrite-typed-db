export type NonRecursiveTypes =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  | void
  | Date
  | RegExp
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | (new (...arguments_: any[]) => unknown)
  | Set<unknown>
  | Map<unknown, unknown>;

export type KeysOfType<T, U> = {
  [Key in keyof T]-?: T[Key] extends U | U[] | (U | null)[] ? Key : U extends T[Key] ? Key : never;
}[keyof T];

export type CreateColumnParams<
  Schema extends Record<string, object>,
  TableId extends keyof Schema & string,
  Type,
  Key extends KeysOfType<Schema[TableId], Type> & string
> = {
  databaseId: string;
  tableId: TableId;
  key: Key;
  required: Schema[TableId][Key] extends null | (Type | null)[]
    ? false
    : null extends Schema[TableId][Key]
    ? false
    : true;
} & (Schema[TableId][Key] extends (Type | null)[] | Type[] ? { array: true } : { array?: false }) &
  (Schema[TableId][Key] extends null | (Type | null)[]
    ? { xdefault?: Type }
    : null extends Schema[TableId][Key]
    ? { xdefault?: Type }
    : {});

export type UpdateColumnParams<
  Schema extends Record<string, object>,
  TableId extends keyof Schema & string,
  Type,
  Key extends KeysOfType<Schema[TableId], Type> & string
> = {
  databaseId: string;
  tableId: TableId;
  key: Key;
  required: Schema[TableId][Key] extends null | (Type | null)[]
    ? false
    : null extends Schema[TableId][Key]
    ? false
    : true;
} & (Schema[TableId][Key] extends null | (Type | null)[]
  ? { xdefault?: Type }
  : null extends Schema[TableId][Key]
  ? { xdefault?: Type }
  : {});

export type Simplify<T> = T extends NonRecursiveTypes ? T : { [Key in keyof T]: Simplify<T[Key]> };

export type Row = {
  /**
   * Row ID.
   */
  $id: string;
  /**
   * Row automatically incrementing ID.
   */
  $sequence: number;
  /**
   * Table ID.
   */
  $tableId: string;
  /**
   * Database ID.
   */
  $databaseId: string;
  /**
   * Row creation date in ISO 8601 format.
   */
  $createdAt: string;
  /**
   * Row update date in ISO 8601 format.
   */
  $updatedAt: string;
  /**
   * Row permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
   */
  $permissions: string[];
};

export type RowMeta = Omit<Row, '$sequence'>;

export type TimestampOverrides = {
  $createdAt: string;
  $updatedAt: string;
};

export type RowList<Row> = {
  total: number;
  rows: Row[];
};

export type SelectableRowMeta = Pick<Row, '$sequence'>;

export type Unpopulate<T> = T extends NonRecursiveTypes ? T : T extends (infer U)[] ? Unpopulate<U>[] : string;

export type Selectors<Source, SourceKeys extends keyof Source = keyof Source, Recursive extends boolean = true> =
  | '*'
  | (SourceKeys extends `${infer Key extends keyof Source & string}`
      ? Source[Key] extends (infer ItemType)[]
        ? ItemType extends NonRecursiveTypes
          ? Key
          :
              | Key
              | `${Key}.${Recursive extends true
                  ? Selectors<ItemType & SelectableRowMeta, keyof (ItemType & SelectableRowMeta), false>
                  : '*' | (keyof (ItemType & SelectableRowMeta) & string)}`
        : Source[Key] extends NonRecursiveTypes
        ? Key
        :
            | Key
            | `${Key}.${Recursive extends true
                ? Selectors<Source[Key] & SelectableRowMeta, keyof (Source[Key] & SelectableRowMeta), false>
                : '*' | (keyof (Source[Key] & SelectableRowMeta) & string)}`
      : never);

export type Select<Source, Selector extends Selectors<Source>> = Selector extends '*'
  ? { [Key in keyof Source]: Unpopulate<Source[Key]> }
  : Selector extends `${infer Key}.${infer Rest}`
  ? {
      [K in Key]: Key extends keyof Source
        ? Source[Key] extends (infer ItemType)[]
          ? Rest extends Selectors<ItemType & SelectableRowMeta>
            ? (RowMeta & Select<ItemType & SelectableRowMeta, Rest>)[]
            : `Invalid selector ${Selector} - cannot resolve ${Rest}`
          : Rest extends Selectors<Source[Key] & SelectableRowMeta>
          ? RowMeta & Select<Source[Key] & SelectableRowMeta, Rest>
          : `Invalid selector ${Selector} - cannot resolve ${Rest}`
        : `Invalid selector ${Selector} - ${Key} is invalid`;
    }
  : Selector extends keyof Source
  ? { [K in Selector]: Unpopulate<Source[K]> }
  : `Invalid selector ${Selector}`;

export type MergeSelections<
  Source,
  First extends Selectors<Source>,
  Rest extends Selectors<Source>[],
  Left extends Select<Source, First> = Select<Source, First>,
  Right extends SelectAll<Source, Rest> = SelectAll<Source, Rest>
> = keyof Left extends keyof Right
  ? {
      [Key in keyof Right]: Key extends keyof Left
        ? Left[Key] extends (infer U)[]
          ? Right[Key] extends (infer V)[]
            ? (U & V)[]
            : never
          : Left[Key] & Right[Key]
        : Right[Key];
    }
  : Left & Right;

export type SelectAll<Source, SelectorArray extends Selectors<Source>[]> = SelectorArray extends [
  infer First extends Selectors<Source>,
  ...infer Rest extends Selectors<Source>[]
]
  ? MergeSelections<Source, First, Rest>
  : unknown;

export type OptionalCreateDataKey<T> = {
  [Key in keyof T]-?: T[Key] extends null ? Key : null extends T[Key] ? Key : never;
}[keyof T];

export type CreateRelationshipData<T> = T extends (infer U)[]
  ? CreateRelationshipData<U>[]
  : T extends object
  ? ({ [Key in keyof T]: Unpopulate<T[Key]> } & Partial<TimestampOverrides>) | string
  : T;

export type CreateRowData<
  Source,
  MappedSource extends { [K in keyof Source]: CreateRelationshipData<Source[K]> } = {
    [K in keyof Source]: CreateRelationshipData<Source[K]>;
  },
  OptionalKeys extends OptionalCreateDataKey<Source> = OptionalCreateDataKey<Source>
> = Omit<MappedSource, OptionalKeys> & Partial<Pick<MappedSource, OptionalKeys>> & Partial<TimestampOverrides>;
