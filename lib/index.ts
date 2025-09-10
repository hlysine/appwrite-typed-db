import type { IndexType, RelationshipType, Models, RelationMutate, TablesDB } from 'node-appwrite';

type NonRecursiveTypes =
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

// Get keys of T whose values are of type U
type KeysOfType<T, U> = {
  [Key in keyof T]-?: T[Key] extends U | U[] | (U | null)[] ? Key : U extends T[Key] ? Key : never;
}[keyof T];

type CreateColumnParams<
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

type UpdateColumnParams<
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

type Simplify<T> = T extends NonRecursiveTypes ? T : { [Key in keyof T]: Simplify<T[Key]> };

type RowMeta = Omit<Models.Row, '$sequence'>;

type TimestampOverrides = {
  $createdAt: string;
  $updatedAt: string;
};

type RowList<Row> = {
  total: number;
  rows: Row[];
};

type SelectableRowMeta = Pick<Models.Row, '$sequence'>;

type Unpopulate<T> = T extends NonRecursiveTypes ? T : T extends (infer U)[] ? Unpopulate<U>[] : string;

type Selectors<Source, SourceKeys extends keyof Source = keyof Source, Recursive extends boolean = true> =
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

type Select<Source, Selector extends Selectors<Source>> = Selector extends '*'
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

type MergeSelections<
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

type SelectAll<Source, SelectorArray extends Selectors<Source>[]> = SelectorArray extends [
  infer First extends Selectors<Source>,
  ...infer Rest extends Selectors<Source>[]
]
  ? MergeSelections<Source, First, Rest>
  : unknown;

type OptionalCreateDataKey<T> = {
  [Key in keyof T]-?: T[Key] extends null ? Key : null extends T[Key] ? Key : never;
}[keyof T];

type CreateRelationshipData<T> = T extends (infer U)[]
  ? CreateRelationshipData<U>[]
  : T extends object
  ? ({ [Key in keyof T]: Unpopulate<T[Key]> } & Partial<TimestampOverrides>) | string
  : T;

type CreateRowData<
  Source,
  MappedSource extends { [K in keyof Source]: CreateRelationshipData<Source[K]> } = {
    [K in keyof Source]: CreateRelationshipData<Source[K]>;
  },
  OptionalKeys extends OptionalCreateDataKey<Source> = OptionalCreateDataKey<Source>
> = Omit<MappedSource, OptionalKeys> & Partial<Pick<MappedSource, OptionalKeys>> & Partial<TimestampOverrides>;

export default class TypedTables<Schema extends Record<string, object>> {
  public list: TablesDB['list'];
  public create: TablesDB['create'];
  public get: TablesDB['get'];
  public update: TablesDB['update'];
  public delete: TablesDB['delete'];
  public listTables: TablesDB['listTables'];

  public constructor(private tablesDb: TablesDB) {
    this.tablesDb = tablesDb;
    this.list = tablesDb.list.bind(tablesDb);
    this.create = tablesDb.create.bind(tablesDb);
    this.get = tablesDb.get.bind(tablesDb);
    this.update = tablesDb.update.bind(tablesDb);
    this.delete = tablesDb.delete.bind(tablesDb);
    this.listTables = tablesDb.listTables.bind(tablesDb);
  }

  public async createTable(params: {
    databaseId: string;
    tableId: keyof Schema & string;
    name: string;
    permissions?: string[];
    rowSecurity?: boolean;
    enabled?: boolean;
  }): Promise<Models.Table> {
    return this.tablesDb.createTable(params);
  }

  public async getTable(params: { databaseId: string; tableId: keyof Schema & string }): Promise<Models.Table> {
    return this.tablesDb.getTable(params);
  }

  public async updateTable(params: {
    databaseId: string;
    tableId: keyof Schema & string;
    name: string;
    permissions?: string[];
    rowSecurity?: boolean;
    enabled?: boolean;
  }): Promise<Models.Table> {
    return this.tablesDb.updateTable(params);
  }

  public async deleteTable(params: { databaseId: string; tableId: keyof Schema & string }): Promise<{}> {
    return this.tablesDb.deleteTable(params);
  }

  public async listColumns(params: {
    databaseId: string;
    tableId: keyof Schema & string;
    queries?: string[];
  }): Promise<Models.ColumnList> {
    return this.tablesDb.listColumns(params);
  }

  public async createBooleanColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], boolean> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, boolean, Key>>): Promise<Models.ColumnBoolean> {
    return this.tablesDb.createBooleanColumn(params);
  }

  public async updateBooleanColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], boolean> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, boolean, Key>>): Promise<Models.ColumnBoolean> {
    return this.tablesDb.updateBooleanColumn(params);
  }

  public async createDatetimeColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnDatetime> {
    return this.tablesDb.createDatetimeColumn(params);
  }

  public async updateDatetimeColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnDatetime> {
    return this.tablesDb.updateDatetimeColumn(params);
  }

  public async createEmailColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnEmail> {
    return this.tablesDb.createEmailColumn(params);
  }

  public async updateEmailColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnEmail> {
    return this.tablesDb.updateEmailColumn(params);
  }

  public async createEnumColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(
    params: Simplify<CreateColumnParams<Schema, TableId, string, Key> & { elements: Schema[TableId][Key][] }>
  ): Promise<Models.ColumnEnum> {
    return this.tablesDb.createEnumColumn(params as any);
  }

  public async updateEnumColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(
    params: Simplify<UpdateColumnParams<Schema, TableId, string, Key> & { elements: Schema[TableId][Key][] }>
  ): Promise<Models.ColumnEnum> {
    return this.tablesDb.updateEnumColumn(params as any);
  }

  public async createFloatColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], number> & string
  >(
    params: Simplify<CreateColumnParams<Schema, TableId, number, Key> & { min?: number; max?: number }>
  ): Promise<Models.ColumnFloat> {
    return this.tablesDb.createFloatColumn(params);
  }

  public async updateFloatColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], number> & string
  >(
    params: Simplify<UpdateColumnParams<Schema, TableId, number, Key> & { min?: number; max?: number }>
  ): Promise<Models.ColumnFloat> {
    return this.tablesDb.updateFloatColumn(params);
  }

  public async createIntegerColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], number> & string
  >(
    params: Simplify<CreateColumnParams<Schema, TableId, number, Key> & { min?: number; max?: number }>
  ): Promise<Models.ColumnInteger> {
    return this.tablesDb.createIntegerColumn(params);
  }

  public async updateIntegerColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], number> & string
  >(
    params: Simplify<UpdateColumnParams<Schema, TableId, number, Key> & { min?: number; max?: number }>
  ): Promise<Models.ColumnInteger> {
    return this.tablesDb.updateIntegerColumn(params);
  }

  public async createIpColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnIp> {
    return this.tablesDb.createIpColumn(params);
  }

  public async updateIpColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnIp> {
    return this.tablesDb.updateIpColumn(params);
  }

  public async createLineColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], [number, number][]> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, [number, number][], Key>>): Promise<Models.ColumnLine> {
    return this.tablesDb.createLineColumn(params);
  }

  public async updateLineColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], [number, number][]> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, [number, number][], Key>>): Promise<Models.ColumnLine> {
    return this.tablesDb.updateLineColumn(params);
  }

  public async createPointColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], [number, number]> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, [number, number], Key>>): Promise<Models.ColumnPoint> {
    return this.tablesDb.createPointColumn(params);
  }

  public async updatePointColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], [number, number]> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, [number, number], Key>>): Promise<Models.ColumnPoint> {
    return this.tablesDb.updatePointColumn(params);
  }

  public async createPolygonColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], [number, number][][]> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, [number, number][][], Key>>): Promise<Models.ColumnPolygon> {
    return this.tablesDb.createPolygonColumn(params);
  }

  public async updatePolygonColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], [number, number][][]> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, [number, number][][], Key>>): Promise<Models.ColumnPolygon> {
    return this.tablesDb.updatePolygonColumn(params);
  }

  public async createRelationshipColumn<
    const TableId extends keyof Schema & string,
    const RelatedTableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], object> & string
  >(
    params: Simplify<{
      databaseId: string;
      tableId: TableId;
      relatedTableId: RelatedTableId;
      key: Key;
      type: Schema[TableId][Key] extends unknown[]
        ? RelationshipType.ManyToMany | RelationshipType.OneToMany
        : RelationshipType.ManyToOne | RelationshipType.OneToOne;
      twoWay?: false;
      onDelete?: RelationMutate;
    }>
  ): Promise<Models.ColumnRelationship>;

  public async createRelationshipColumn<
    const TableId extends keyof Schema & string,
    const RelatedTableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], object> & string,
    const TwoWayKey extends KeysOfType<Schema[RelatedTableId], object> & string
  >(
    params: Simplify<{
      databaseId: string;
      tableId: TableId;
      relatedTableId: RelatedTableId;
      key: Key;
      type: Schema[TableId][Key] extends unknown[]
        ? Schema[RelatedTableId][TwoWayKey] extends unknown[]
          ? RelationshipType.ManyToMany
          : RelationshipType.OneToMany
        : Schema[RelatedTableId][TwoWayKey] extends unknown[]
        ? RelationshipType.ManyToOne
        : RelationshipType.OneToOne;
      twoWay: true;
      twoWayKey: TwoWayKey;
      onDelete?: RelationMutate;
    }>
  ): Promise<Models.ColumnRelationship>;

  public async createRelationshipColumn(params: any): Promise<Models.ColumnRelationship> {
    return this.tablesDb.createRelationshipColumn(params);
  }

  public async createStringColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(
    params: Simplify<CreateColumnParams<Schema, TableId, string, Key> & { size: number; encrypt?: boolean }>
  ): Promise<Models.ColumnString> {
    return this.tablesDb.createStringColumn(params);
  }

  public async updateStringColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(
    params: Simplify<UpdateColumnParams<Schema, TableId, string, Key> & { size?: number; encrypt?: boolean }>
  ): Promise<Models.ColumnString> {
    return this.tablesDb.updateStringColumn(params);
  }

  public async createUrlColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<CreateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnUrl> {
    return this.tablesDb.createUrlColumn(params);
  }

  public async updateUrlColumn<
    const TableId extends keyof Schema & string,
    const Key extends KeysOfType<Schema[TableId], string> & string
  >(params: Simplify<UpdateColumnParams<Schema, TableId, string, Key>>): Promise<Models.ColumnUrl> {
    return this.tablesDb.updateUrlColumn(params);
  }

  public async getColumn<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    key: keyof Schema[TableId] & string;
  }): Promise<{}> {
    return this.tablesDb.getColumn(params);
  }

  public async updateRelationshipColumn<const TableId extends keyof Schema & string>(
    params: Simplify<{
      databaseId: string;
      tableId: TableId;
      key: KeysOfType<Schema[TableId], object> & string;
      onDelete?: RelationMutate;
    }>
  ): Promise<Models.ColumnRelationship> {
    return this.tablesDb.updateRelationshipColumn(params);
  }

  public async listIndexes(params: {
    databaseId: string;
    tableId: keyof Schema & string;
    queries?: string[];
  }): Promise<Models.ColumnIndexList> {
    return this.tablesDb.listIndexes(params);
  }

  public async createIndex<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    key: string;
    type: IndexType;
    columns: (keyof Schema[TableId] & string)[];
    orders?: string[];
    lengths?: number[];
  }): Promise<Models.ColumnIndex> {
    return this.tablesDb.createIndex(params);
  }

  public async getIndex(params: {
    databaseId: string;
    tableId: keyof Schema & string;
    key: string;
  }): Promise<Models.ColumnIndex> {
    return this.tablesDb.getIndex(params);
  }

  public async deleteIndex(params: { databaseId: string; tableId: keyof Schema & string; key: string }): Promise<{}> {
    return this.tablesDb.deleteIndex(params);
  }

  public async listRows<
    const TableId extends keyof Schema & string,
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[]
  >(params: {
    databaseId: string;
    tableId: TableId;
    select?: RowSelectors;
    queries?: string[];
  }): Promise<RowList<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, RowSelectors>>>> {
    return this.tablesDb.listRows<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, RowSelectors>> & SelectableRowMeta
    >(params);
  }

  public async createRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data: Simplify<CreateRowData<Schema[TableId]>>;
    permissions?: string[];
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>> {
    return this.tablesDb.createRow<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async createRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rows: Simplify<CreateRowData<Schema[TableId]> & { $id?: string }>[];
  }): Promise<RowList<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>>> {
    return this.tablesDb.createRows<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async upsertRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rows: Simplify<CreateRowData<Schema[TableId]> & { $id: string }>[];
  }): Promise<RowList<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>>> {
    return this.tablesDb.upsertRows<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async updateRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    data: Simplify<CreateRowData<Schema[TableId]>>[];
    queries?: string[];
  }): Promise<RowList<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>>> {
    return this.tablesDb.updateRows<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async deleteRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    queries?: string[];
  }): Promise<RowList<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>>> {
    return this.tablesDb.deleteRows<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async getRow<
    const TableId extends keyof Schema & string,
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[]
  >(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    select?: RowSelectors;
    queries?: string[];
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, RowSelectors>>> {
    return this.tablesDb.getRow<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, RowSelectors>> & SelectableRowMeta
    >(params);
  }

  public async upsertRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data?: Simplify<CreateRowData<Schema[TableId]> & { $id: string }>[];
    permissions?: string[];
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>> {
    return this.tablesDb.upsertRow<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async updateRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data: Simplify<CreateRowData<Schema[TableId]>>[];
    permissions?: string[];
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>> {
    return this.tablesDb.updateRow<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async deleteRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
  }): Promise<{}> {
    return this.tablesDb.deleteRow(params);
  }

  public async decrementRowColumn<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    column: KeysOfType<Schema[TableId], number> & string;
    value?: number;
    min?: number;
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>> {
    return this.tablesDb.decrementRowColumn<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }

  public async incrementRowColumn<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    column: KeysOfType<Schema[TableId], number> & string;
    value?: number;
    max?: number;
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>> {
    return this.tablesDb.incrementRowColumn<
      Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>> & SelectableRowMeta
    >(params);
  }
}
