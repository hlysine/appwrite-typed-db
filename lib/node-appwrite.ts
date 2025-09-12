import {
  type IndexType,
  type RelationshipType,
  type Models,
  type RelationMutate,
  type TablesDB,
  Query,
} from 'node-appwrite';
import type {
  KeysOfType,
  Simplify,
  CreateColumnParams,
  UpdateColumnParams,
  Selectors,
  SelectableRowMeta,
  RowList,
  Select,
  CreateRowData,
  EmptyReturn,
  Row,
} from './types';

export class TypedDB<Schema extends Record<string, object>> {
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

  public async deleteTable(params: { databaseId: string; tableId: keyof Schema & string }): Promise<EmptyReturn> {
    return this.tablesDb.deleteTable(params) as Promise<EmptyReturn>;
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
  }): Promise<EmptyReturn> {
    return this.tablesDb.getColumn(params) as Promise<EmptyReturn>;
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

  public async deleteIndex(params: {
    databaseId: string;
    tableId: keyof Schema & string;
    key: string;
  }): Promise<EmptyReturn> {
    return this.tablesDb.deleteIndex(params) as Promise<EmptyReturn>;
  }

  public async listRows<
    const TableId extends keyof Schema & string,
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[]
  >(params: {
    databaseId: string;
    tableId: TableId;
    select?: RowSelectors;
    queries?: string[];
  }): Promise<RowList<Select<Schema[TableId], RowSelectors>>> {
    return this.tablesDb.listRows<Row & Select<Schema[TableId], RowSelectors>>({
      ...params,
      queries: params.select ? [Query.select(params.select), ...(params.queries ?? [])] : params.queries,
    });
  }

  public async createRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data: Simplify<CreateRowData<Schema[TableId]>>;
    permissions?: string[];
  }): Promise<Select<Schema[TableId]>> {
    return this.tablesDb.createRow<Row & Select<Schema[TableId]>>(params as any);
  }

  public async createRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rows: Simplify<CreateRowData<Schema[TableId]> & { $id?: string }>[];
  }): Promise<RowList<Select<Schema[TableId]>>> {
    return this.tablesDb.createRows<Row & Select<Schema[TableId]>>(params);
  }

  public async upsertRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rows: Simplify<CreateRowData<Schema[TableId]> & { $id: string }>[];
  }): Promise<RowList<Select<Schema[TableId]>>> {
    return this.tablesDb.upsertRows<Row & Select<Schema[TableId]>>(params);
  }

  public async updateRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    data: Simplify<Partial<CreateRowData<Schema[TableId]>>>[];
    queries?: string[];
  }): Promise<RowList<Select<Schema[TableId]>>> {
    return this.tablesDb.updateRows<Row & Select<Schema[TableId]>>(params);
  }

  public async deleteRows<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    queries?: string[];
  }): Promise<RowList<Select<Schema[TableId]>>> {
    return this.tablesDb.deleteRows<Row & Select<Schema[TableId]>>(params);
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
  }): Promise<Select<Schema[TableId], RowSelectors>> {
    return this.tablesDb.getRow<Select<Schema[TableId], RowSelectors> & Row>({
      ...params,
      queries: params.select ? [Query.select(params.select), ...(params.queries ?? [])] : params.queries,
    });
  }

  public async upsertRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data?: Simplify<CreateRowData<Schema[TableId]> & { $id: string }>[];
    permissions?: string[];
  }): Promise<Select<Schema[TableId]>> {
    return this.tablesDb.upsertRow<Row & Select<Schema[TableId]>>(params as any);
  }

  public async updateRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data: Simplify<Partial<CreateRowData<Schema[TableId]>>>;
    permissions?: string[];
  }): Promise<Select<Schema[TableId]>> {
    return this.tablesDb.updateRow<Row & Select<Schema[TableId]>>(params as any);
  }

  public async deleteRow<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
  }): Promise<EmptyReturn> {
    return this.tablesDb.deleteRow(params) as Promise<EmptyReturn>;
  }

  public async decrementRowColumn<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    column: KeysOfType<Schema[TableId], number> & string;
    value?: number;
    min?: number;
  }): Promise<Select<Schema[TableId]>> {
    return this.tablesDb.decrementRowColumn<Row & Select<Schema[TableId]>>(params);
  }

  public async incrementRowColumn<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    column: KeysOfType<Schema[TableId], number> & string;
    value?: number;
    max?: number;
  }): Promise<Select<Schema[TableId]>> {
    return this.tablesDb.incrementRowColumn<Row & Select<Schema[TableId]>>(params);
  }
}
