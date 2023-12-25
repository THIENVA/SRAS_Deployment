import MaterialReactTable from 'material-react-table'

import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ManuscriptTable = ({
    columns,
    tableData,
    totalCount,
    setPagination,
    setGlobalFilter,
    pagination,
    loading,
    isRefetching,
    buttonLoading,
    tab,
    handleDownload,
    columnVisibility,
    setVisibility,
}) => {
    return (
        <MaterialReactTable
            columns={columns}
            data={tableData}
            enableColumnFilterModes
            enableColumnResizing
            enableStickyHeader
            manualPagination
            enablePinning
            enableRowNumbers
            rowCount={totalCount}
            positionActionsColumn="last"
            positionToolbarAlertBanner="bottom"
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
            renderDetailPanel={({ row }) => {
                return (
                    <Box mx={4}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>Abstract:</Typography>
                        <Typography sx={{ fontSize: 14, color: AppStyles.colors['#586380'] }}>
                            {row.original.abstract}
                        </Typography>
                    </Box>
                )
            }}
            muiTableBodyCellEditTextFieldProps={() => ({
                variant: 'outlined',
            })}
            onPaginationChange={setPagination}
            onGlobalFilterChange={setGlobalFilter}
            onColumnVisibilityChange={setVisibility}
            state={{
                pagination,
                isLoading: loading,
                showProgressBars: isRefetching,
                columnVisibility: columnVisibility,
            }}
            initialState={{
                density: 'compact',
                columnVisibility: { primarySubjectArea: false, secondarySubjectArea: false },
            }}
            // renderTopToolbarCustomActions={() => {
            //     return (
            //         <Box sx={{ gap: '0.5rem' }}>
            //             <LoadingButton
            //                 variant="outlined"
            //                 startIcon={<DownloadOutlined />}
            //                 // loading={buttonLoading}
            //                 disabled={buttonLoading}
            //                 loadingPosition="start"
            //                 size="medium"
            //                 onClick={() => handleDownload()}
            //             >
            //                 Download{' '}
            //                 {tab === 'all'
            //                     ? 'All ManuScript'
            //                     : tab === 'registered'
            //                     ? 'All Registered Manuscripts'
            //                     : tab === 'requestedforpresentation'
            //                     ? 'All Presentation'
            //                     : 'Presentation-submitted Manuscripts'}
            //             </LoadingButton>
            //             {buttonLoading && (
            //                 <Box mt={1} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            //                     <Box sx={{ width: '100%' }}>
            //                         <LinearProgress />
            //                     </Box>
            //                     <Box sx={{ minWidth: 35, mt: 0.5 }}>
            //                         <Typography variant="body2" color="text.secondary">
            //                             This might take several minutes...
            //                         </Typography>
            //                     </Box>
            //                 </Box>
            //             )}
            //         </Box>
            //     )
            // }}
        />
    )
}

export default ManuscriptTable
