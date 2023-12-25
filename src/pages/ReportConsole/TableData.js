import { Fragment } from 'react'

import MaterialReactTable from 'material-react-table'

import { Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TableData = ({
    columns,
    tableData,
    setPagination,
    isLoading,
    isFetching,
    pagination,
    totalCount,
    setGlobalFilter,
    setSorting,
    reviewedCount,
    sorting,
}) => {
    return (
        <MaterialReactTable
            columns={columns}
            data={tableData}
            enableColumnFilterModes
            enableColumnResizing
            enableStickyHeader
            positionToolbarAlertBanner="bottom"
            enablePinning
            enableRowNumbers
            renderTopToolbarCustomActions={() => {
                return (
                    <Fragment>
                        <Typography sx={{ m: 2, fontSize: 16, fontWeight: 'bold' }}>
                            {totalCount ? totalCount : 0} submissions in total
                        </Typography>
                    </Fragment>
                )
            }}
            muiTableBodyProps={{
                sx: () => ({
                    '& tr:nth-of-type(4n+1)': {
                        backgroundColor: AppStyles.colors['#F7FCFF'],
                    },
                }),
            }}
            muiTableHeadCellProps={{
                sx: {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    ':last-child': {
                        borderRight: 'none',
                    },
                    fontSize: 14,
                },
                align: 'center',
            }}
            muiTableBodyCellProps={{
                sx: {
                    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                    ':last-child': {
                        borderRight: 'none',
                    },
                    fontSize: 14,
                },
                align: 'center',
            }}
            displayColumnDefOptions={{
                'mrt-row-expand': {
                    size: 10,
                },
            }}
            rowCount={totalCount}
            manualPagination
            onSortingChange={setSorting}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            state={{
                pagination,
                isLoading: !!isLoading,
                showProgressBars: !!isFetching,
                sorting,
            }}
            initialState={{ columnVisibility: { primarySubjectArea: false, secondarySubjectArea: false } }}
        />
    )
}

export default TableData
