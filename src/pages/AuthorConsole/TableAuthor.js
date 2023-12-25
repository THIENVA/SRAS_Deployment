import React from 'react'

import MaterialReactTable from 'material-react-table'

import { Box, Typography } from '@mui/material'

import ActionTable from './ActionTable'

import { AppStyles } from '~/constants/colors'

const TableAuthor = ({
    columns,
    tableData,
    data,
    conferenceId,
    handleOpenConfirmModal,
    handleSaveRow,
    setSorting,
    setGlobalFilter,
    setPagination,
    pagination,
    isLoading,
    isFetching,
    sorting,
}) => {
    return (
        <MaterialReactTable
            columns={columns}
            data={tableData}
            enableRowNumbers
            enableColumnFilterModes
            enablePinning
            enableColumnResizing
            enableStickyHeader
            enableRowActions
            rowCount={data?.totalCount}
            manualPagination
            positionActionsColumn="last"
            positionToolbarAlertBanner="bottom"
            muiTableBodyRowProps={({ row }) => ({
                sx: {
                    backgroundColor:
                        row.getValue('status') === 'Accept'
                            ? '#f3f9ed !important'
                            : row.getValue('status') === 'Revision'
                            ? '#fffdeb !important'
                            : row.getValue('status') === 'Desk Reject'
                            ? '#ffebee !important'
                            : row.getValue('status') === 'Reject'
                            ? '#fbedeb !important'
                            : '',
                    // fontStyle: 'italic',
                },
            })}
            renderTopToolbarCustomActions={() => {
                return (
                    <React.Fragment>
                        <Typography sx={{ m: 2, fontSize: 16, fontWeight: 'bold' }}>
                            {data?.totalCount && <>{data?.totalCount ? data?.totalCount : 0} submissions in total</>}
                        </Typography>
                    </React.Fragment>
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
            renderRowActions={({ row }) => (
                <React.Fragment>
                    <ActionTable
                        row={row}
                        conferenceId={conferenceId}
                        handleOpenConfirmModal={handleOpenConfirmModal}
                    />
                </React.Fragment>
            )}
            renderDetailPanel={({ row }) => {
                return (
                    <Box mx={4}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Chair Note:
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 14,
                                color: AppStyles.colors['#586380'],
                                fontStyle: !row.original.chairNote && 'italic',
                            }}
                        >
                            {row.original.chairNote ? row.original.chairNote : 'No note to display'}
                        </Typography>
                    </Box>
                )
            }}
            muiTableBodyCellEditTextFieldProps={() => ({
                variant: 'outlined',
            })}
            onEditingRowSave={handleSaveRow}
            displayColumnDefOptions={{
                'mrt-row-actions': {
                    size: 300,
                },
                'mrt-row-expand': {
                    size: 10,
                },
            }}
            onSortingChange={setSorting}
            onGlobalFilterChange={setGlobalFilter}
            onPaginationChange={setPagination}
            state={{ pagination, isLoading: !!isLoading, showProgressBars: !!isFetching, sorting }}
            initialState={{
                density: 'compact',
            }}
        />
    )
}

export default TableAuthor
