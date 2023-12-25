import { Fragment } from 'react'

import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { DownloadOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Divider, LinearProgress, MenuItem as MenuItemMUI, Typography } from '@mui/material'

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
    handleOpenConfirmModal,
}) => {
    const { conferenceId } = useParams()
    const history = useHistory()
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
            enableRowActions
            rowCount={totalCount}
            positionActionsColumn="last"
            positionToolbarAlertBanner="bottom"
            renderRowActionMenuItems={({ row }) => [
                !row.original.isPresentationSubmitted && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/submission/${row.original.paperId}/presentation`)
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Upload Presentation
                        <Divider />
                    </MenuItemMUI>
                ),
                row.original.isPresentationSubmitted && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(
                                `/conferences/${conferenceId}/submission/${row.original.paperId}/edit-presentation`
                            )
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Edit Presentation
                        <Divider />
                    </MenuItemMUI>
                ),
                !row.original?.cameraReadySubmitted && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(
                                `/conferences/${conferenceId}/track/${row.original.trackId}/paper/${row.original.paperId}/camera-ready`
                            )
                        }
                        sx={{ m: 0 }}
                    >
                        Create Camera Ready
                    </MenuItemMUI>
                ),
                row.original?.cameraReadySubmitted && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(
                                `/conferences/${conferenceId}/track/${row.original.trackId}/paper/${row.original.paperId}/edit-camera-ready`
                            )
                        }
                        sx={{ m: 0 }}
                    >
                        Edit Camera Ready
                    </MenuItemMUI>
                ),
                row.original?.cameraReadySubmitted && (
                    <MenuItemMUI key={uuid()} onClick={() => handleOpenConfirmModal(row.original)} sx={{ m: 0 }}>
                        Delete Camera Ready
                    </MenuItemMUI>
                ),
            ]}
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
            renderTopToolbarCustomActions={() => {
                return (
                    <Box sx={{ gap: '0.5rem' }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                            {totalCount && <>{totalCount ? totalCount : 0} submissions in total</>}
                        </Typography>
                        {(tab === 'all' ||
                            tab === 'registered' ||
                            tab === 'requestedforpresentation' ||
                            tab === 'presented') && (
                            <Fragment>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    {tab === 'all'
                                        ? 'All ManuScript:'
                                        : tab === 'registered'
                                        ? 'All Registered Manuscripts:'
                                        : tab === 'requestedforpresentation'
                                        ? 'Request for Presentation Papers:'
                                        : 'Presentation-submitted Manuscripts:'}
                                </Typography>
                                <LoadingButton
                                    variant="outlined"
                                    startIcon={<DownloadOutlined />}
                                    disabled={buttonLoading}
                                    loadingPosition="start"
                                    size="medium"
                                    onClick={() => handleDownload()}
                                >
                                    Download{' '}
                                </LoadingButton>
                                {buttonLoading && (
                                    <Box mt={1} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress />
                                        </Box>
                                        <Box sx={{ minWidth: 35, mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                This might take several minutes...
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Fragment>
                        )}
                    </Box>
                )
            }}
        />
    )
}

export default ManuscriptTable
