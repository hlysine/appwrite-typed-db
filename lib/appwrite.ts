import { type TablesDB, AppwriteException, Query } from 'appwrite';
import type {
  Selectors,
  SelectableRowMeta,
  RowList,
  Simplify,
  Select,
  CreateRowData,
  KeysOfType,
  EmptyReturn,
  Row,
  DefaultSchema,
  Populate,
} from './types';

export class TypedDB<Schema extends DefaultSchema = DefaultSchema> {
  public constructor(private tablesDb: TablesDB) {
    this.tablesDb = tablesDb;
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
    return this.tablesDb.getRow<Row & Select<Schema[TableId], RowSelectors>>({
      ...params,
      queries: params.select ? [Query.select(params.select), ...(params.queries ?? [])] : params.queries,
    });
  }

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
