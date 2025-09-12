import {
  type IndexType,
  type RelationshipType,
  type Models,
  type RelationMutate,
  type TablesDB,
  Query,
  AppwriteException,
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
  DefaultSchema,
  Populate,
} from './types';

export class TypedDB<Schema extends DefaultSchema = DefaultSchema> {
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
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[] = ['*']
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

  /**
   * Create a new Row, or return null if it already exists. Before using this route, you should create a new table resource using either a [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreateTable) API or directly from your database console.
   *
   * @param params.databaseId - Database ID.
   * @param params.tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate). Make sure to define columns before creating rows.
   * @param params.rowId - Row ID. Choose a custom ID or generate a random ID with `ID.unique()`. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore. Can't start with a special char. Max length is 36 chars.
   * @param params.data - Row data as JSON object.
   * @param params.permissions - An array of permissions strings. By default, only the current user is granted all permissions. [Learn more about permissions](https://appwrite.io/docs/permissions).
   * @throws {AppwriteException}
   */
  public async createRowOptional<const TableId extends keyof Schema & string>(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    data: Simplify<CreateRowData<Schema[TableId]>>;
    permissions?: string[];
  }): Promise<Select<Schema[TableId]> | null> {
    try {
      return await this.createRow(params);
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 409) {
        return null;
      }
      throw error;
    }
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
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[] = ['*']
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

  /**
   * Get a row by its unique ID, or return null if not found. This endpoint response returns a JSON object with the row data.
   *
   * @param params.databaseId - Database ID.
   * @param params.tableId - Table ID. You can create a new table using the Database service [server integration](https://appwrite.io/docs/server/tablesdb#tablesDBCreate).
   * @param params.rowId - Row ID.
   * @param params.queries - Array of query strings generated using the Query class provided by the SDK. [Learn more about queries](https://appwrite.io/docs/queries). Maximum of 100 queries are allowed, each 4096 characters long.
   * @throws {AppwriteException}
   */
  public async getRowOptional<
    const TableId extends keyof Schema & string,
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[] = ['*']
  >(params: {
    databaseId: string;
    tableId: TableId;
    rowId: string;
    select?: RowSelectors;
    queries?: string[];
  }): Promise<Select<Schema[TableId], RowSelectors> | null> {
    try {
      return await this.getRow(params);
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 404) {
        return null;
      }
      throw error;
    }
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

  /**
   * Populate a string or string array column with the referenced row(s) from another table. This is a helper method that fetches the referenced rows and replaces the IDs in the original row with the full row objects.
   *
   * @param param0.row - The source row containing the reference column.
   * @param param0.column - The column in the source row that contains the reference ID(s).
   * @param param0.databaseId - The ID of the database containing the referenced table.
   * @param param0.tableId - The ID of the table containing the referenced rows.
   * @param param0.select - Optional selectors to specify which fields to retrieve from the referenced rows.
   * @param param0.defaultValue - The value to use if a referenced row is not found. Defaults to null.
   * @returns A promise that resolves to the source row with the reference column populated with full row objects.
   * @throws {AppwriteException} If there is an error fetching the referenced rows.
   */
  public async populateRow<
    const Source extends object,
    const Column extends keyof Source & string,
    const TableId extends keyof Schema & string,
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[] = ['*']
  >({
    row,
    column,
    databaseId,
    tableId,
    select,
    defaultValue = null,
  }: {
    row: Source;
    column: Column;
    databaseId: string;
    tableId: TableId;
    select?: RowSelectors;
    defaultValue?: Select<Schema[TableId], RowSelectors> | null;
  }): Promise<Populate<Source, Column, Select<Schema[TableId], RowSelectors>>> {
    const populated = row as Populate<Source, Column, Select<Schema[TableId], RowSelectors>>;
    const value = row[column];
    if (!value) {
      return populated;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return populated;
      }
      const results = await this.listRows({
        databaseId,
        tableId,
        select,
        queries: [Query.equal('$id', value), Query.limit(Math.max(1000, value.length))],
      });
      populated[column] = value.map(id => results.rows.find(row => row.$id === id) ?? defaultValue) as any;
    } else {
      const result = await this.getRowOptional({
        databaseId,
        tableId,
        rowId: value as string,
        select,
      });
      if (result) {
        populated[column] = result as any;
      } else {
        populated[column] = defaultValue as any;
      }
    }
    return populated;
  }

  /**
   * Populate a string or string array column with the referenced row(s) from another table. This is a helper method that fetches the referenced rows and replaces the IDs in the original rows with the full row objects.
   *
   * @param param0.rows - The source rows containing the reference column.
   * @param param0.column - The column in the source rows that contains the reference ID(s).
   * @param param0.databaseId - The ID of the database containing the referenced table.
   * @param param0.tableId - The ID of the table containing the referenced rows.
   * @param param0.select - Optional selectors to specify which fields to retrieve from the referenced rows.
   * @param param0.defaultValue - The value to use if a referenced row is not found. Defaults to null.
   * @returns A promise that resolves to the source rows with the reference column populated with full row objects.
   * @throws {AppwriteException} If there is an error fetching the referenced rows.
   */
  public async populateRows<
    const Source extends object,
    const Column extends keyof Source & string,
    const TableId extends keyof Schema & string,
    const RowSelectors extends Selectors<Schema[TableId] & SelectableRowMeta>[] = ['*']
  >({
    rows,
    column,
    databaseId,
    tableId,
    select,
    defaultValue = null,
  }: {
    rows: Source[];
    column: Column;
    databaseId: string;
    tableId: TableId;
    select?: RowSelectors;
    defaultValue?: Select<Schema[TableId], RowSelectors> | null;
  }): Promise<Populate<Source, Column, Select<Schema[TableId], RowSelectors>>[]> {
    if (rows.length === 0) {
      return rows as [];
    }
    const populated = rows as Populate<Source, Column, Select<Schema[TableId], RowSelectors>>[];
    const values = rows.flatMap(model => {
      if (model[column] === null) {
        return [];
      } else if (Array.isArray(model[column])) {
        return model[column] as string[];
      } else {
        return [model[column] as string];
      }
    });
    const results = await this.listRows({
      databaseId,
      tableId,
      select,
      queries: [Query.equal('$id', values), Query.limit(Math.max(1000, values.length))],
    });
    populated.forEach(model => {
      const value = model[column];
      if (!value) {
        return;
      }
      if (Array.isArray(value)) {
        model[column] = value.map(id => results.rows.find(row => row.$id === id) ?? defaultValue) as any;
      } else {
        model[column] = (results.rows.find(row => row.$id === (value as string)) ?? defaultValue) as any;
      }
    });
    return populated;
  }
}
