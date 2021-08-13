import React, { useCallback, useMemo } from 'react';
import RcTable from 'rc-table';
import { TableProps as RCProps } from 'rc-table/lib/Table';
import { TableComponents } from 'rc-table/lib/interface';
import cn from 'classnames';

import styles from './styles.scss';

import Tooltip from '@components/Table/Tooltip';
import { ColumnSortState, ColumnsType, DataConstraint, SortOrder, } from '@ui/Table/types';
import { Pagination, PaginationProps, Text } from '@ui';
import { TConfigTable } from '@components/Table/types';
import { PaginationPerPage, TPaginationPerPageProps } from '@components/PaginationPerPage';
import TableHeader from './TableHeader';


type TableProps<T extends Record<string, any>> = {
  rowKey?: DataConstraint<T>;
  rowExpandable?: (record: T) => boolean;
  pagination?: PaginationProps;
  paginationPerPageSettings?: TPaginationPerPageProps;
  columns: ColumnsType<T>;
  onSortChange?: (columnDataIndex: string, sortingState: SortOrder) => void;
  defaultSortState?: ColumnSortState;
  isLoading?: boolean;
  configTable: TConfigTable<T>;
  } & RCProps<T>;


const Table = <T extends Record<string, string>>({
                                                   className,
                                                   columns = [],
                                                   data = [],
                                                   pagination,
                                                   paginationPerPageSettings,
                                                   rowKey = 'key',
                                                   rowExpandable,
                                                   onSortChange,
                                                   defaultSortState,
                                                   isLoading,
                                                   configTable,
                                                   ...rest
                                                 }: TableProps<T>) => {

  const handlePageChange = useCallback(
    (nextPage: number) => {
      if (pagination) {
        pagination.onChange(nextPage);
      }
    },
    [pagination],
  );

  const components: TableComponents<T> = {
    header: {
      row: TableHeader(defaultSortState, onSortChange),
    },
  };

  const adaptedData = useMemo(() => data.map((column) => Object.entries(column).reduce(
    (result, [fieldKey, fieldValue]) => {
      const renderer = configTable.renderer && configTable.renderer[ fieldKey ];
      if (renderer) {
        return {
          ...result,
          [ fieldKey ]: renderer({ value: fieldValue })
        };
      }
      return {
        ...result,
        [ fieldKey ]: <Tooltip text={fieldValue}>{fieldValue}</Tooltip>
      };
    }, { key: column[ configTable.uniqueKey ] } as unknown as T)
  ), [data, configTable.renderer, configTable.uniqueKey]);

  return (
    <>
      <RcTable
        tableLayout="fixed"
        columns={columns}
        data={adaptedData}
        rowKey={(record: T) => record.key}
        className={cn(
          styles.table,
          styles[ 'table--fullScreen' ],
          { [ styles[ 'table--withoutHead' ] ]: !rest.showHeader },
          className,
        )}
        rowClassName={cn(styles.tableRow)}
        components={components}
        emptyText={
          <Text.LongMd>
            <b>Data not found</b>
          </Text.LongMd>
        }
        {...rest}
      />
      {pagination && (
        <div className={styles.pagination}>
          <Pagination {...pagination}
                      onChange={handlePageChange} />
          {paginationPerPageSettings && (
            <PaginationPerPage {...paginationPerPageSettings} />
          )}
        </div>
      )}
    </>
  );
};

export default Table;
