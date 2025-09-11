import { type Models, type TablesDB, Query } from 'appwrite';
import type {
  Selectors,
  SelectableRowMeta,
  RowList,
  Simplify,
  RowMeta,
  SelectAll,
  CreateRowData,
  KeysOfType,
} from './types';

export default class TypedDB<Schema extends Record<string, object>> {
  public constructor(private tablesDb: TablesDB) {
    this.tablesDb = tablesDb;
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
    >({
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
  }): Promise<Simplify<RowMeta & SelectAll<Schema[TableId] & SelectableRowMeta, []>>> {
    return this.tablesDb.createRow<
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
    >({
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
