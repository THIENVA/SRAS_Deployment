import MaterialReactTable from 'material-react-table'

import { Box, Checkbox } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TableReview = ({
    columns,
    reviewersData,
    totalCount,
    setPagination,
    handleCheckChange,
    isDisabled,
    setGlobalFilter,
    pagination,
    loading,
    reviewers,
    handleOpenConfirm,
}) => {
    return (
        <MaterialReactTable
            columns={columns}
            data={reviewersData}
            enableColumnFilterModes
            enablePinning
            enableRowNumbers
            enableColumnResizing
            enableStickyHeader
            positionToolbarAlertBanner="bottom"
            enableRowActions
            positionActionsColumn="last"
            manualPagination
            rowCount={totalCount}
            onPaginationChange={setPagination}
            muiTableBodyProps={{
                sx: () => ({
                    '& tr:nth-of-type(odd)': {
                        backgroundColor: AppStyles.colors['#F7FCFF'],
                    },
                }),
            }}
            displayColumnDefOptions={{
                'mrt-row-actions': {
                    header: 'Assign',
                },
            }}
            renderRowActions={({ row }) => {
                const reviewerId = row.original.reviewerId
                return (
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                        <Checkbox
                            size="medium"
                            name="isCorrect"
                            onChange={(event) => {
                                if (row.original.relevance === 0 && event.target.checked === true) {
                                    handleOpenConfirm(event.target.checked, row)
                                } else {
                                    handleCheckChange(event.target.checked, row)
                                }
                            }}
                            checked={
                                reviewers.find((reviewer) => reviewer.reviewerId === reviewerId)
                                    ? reviewers.find((reviewer) => reviewer.reviewerId === reviewerId).isAssigned
                                    : row.original.isAssigned
                            }
                            disabled={isDisabled}
                            sx={{ mr: 1.5 }}
                        />
                    </Box>
                )
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
            onGlobalFilterChange={setGlobalFilter}
            state={{ pagination, isLoading: loading, showProgressBars: isDisabled }}
            initialState={{
                columnVisibility: { secondarySubjectArea: false, primarySubjectArea: false },
                density: 'compact',
            }}
        />
    )
}

export default TableReview
