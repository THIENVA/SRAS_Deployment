import React, { useMemo, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import MaterialReactTable from 'material-react-table'
import { useHistory } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import {
    CheckCircle,
    DownloadOutlined,
    HowToVoteOutlined,
    NotInterestedOutlined,
    TextSnippetOutlined,
} from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Divider, LinearProgress, MenuItem as MenuItemMUI, Select, Typography } from '@mui/material'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'

const SubmissionTable = ({
    conferenceId,
    handleOpenModal,
    handleChangeDecision,
    statusId,
    paperStatus,
    handleOpenDeskReject,
    handleChangeDecisionNotify,
    statusNotifyID,
    handleChangeRevision,
    isRevisionSubmit,
    handleRequestCameraReady,
    tableData,
    loading,
    data,
    setPagination,
    setSorting,
    setGlobalFilter,
    setVisibility,
    pagination,
    isLoading,
    isFetching,
    sorting,
    columnVisibility,
    stepSelected,
    track,
    handleOpenConfirmModal,
    handleOpenConfirmDeskReject,
}) => {
    const history = useHistory()
    const tableFontSize = 14
    const [buttonLoading, setButtonLoading] = useState(false)
    const showSnackbar = useSnackbar()
    const handleDownload = () => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/conference-submissions-aggregation-file`,
            method: 'GET',
            responseType: 'blob',
            params: {
                conferenceId: conferenceId,
                trackId: track,
            },
        })
            .then((response) => {
                saveAs(response.data, `submissions.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }
    const columns = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Paper',
                Cell: ({ row }) => (
                    <Box textAlign="left">
                        <Typography
                            sx={{
                                color: AppStyles.colors['#027A9D'],
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                                fontSize: tableFontSize,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                            onClick={() =>
                                history.push(`/conferences/${conferenceId}/submission-summary/${row.original.paperId}`)
                            }
                        >
                            {row.original.title}
                        </Typography>
                    </Box>
                ),
                filterFn: 'contains',
                size: 200,
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'trackName',
                header: 'Track',
                size: 120,
                filterFn: 'contains',
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'authors',
                header: 'Authors',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            {row.original?.authors?.map((author, index) => {
                                let color = ''
                                if (author?.isFirstAuthor === true) {
                                    color = 'primary'
                                } else if (author?.isCorrespondingAuthor === true) {
                                    color = 'secondary'
                                }
                                return (
                                    <Box key={index} sx={{ mb: 1 }}>
                                        <Box display={'flex'} alignItems={'center'}>
                                            <Typography textAlign="left" color={color} sx={{ fontSize: 12 }}>
                                                •{' '}
                                                {color || author?.isPrimaryContact ? (
                                                    <strong>
                                                        {author.authorNamePrefix} {author.authorFullName}
                                                    </strong>
                                                ) : (
                                                    <>
                                                        {author.authorNamePrefix} {author.authorFullName}
                                                    </>
                                                )}{' '}
                                                ({author.authorEmail}){' '}
                                                <Typography component={'span'} alignItems={'center'}>
                                                    {author.hasAccount && (
                                                        <CheckCircle
                                                            sx={{
                                                                fontSize: 12,
                                                                color: AppStyles.colors['#027A9D'],
                                                            }}
                                                        />
                                                    )}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                        <Typography
                                            textAlign="left"
                                            sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}
                                        >
                                            <b>Organization:</b> {author.authorOrganization}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </Box>
                    )
                },
                size: 250,
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'chairNoteId',
                header: 'Chair Note',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" justifyContent="center">
                            <Button
                                variant="text"
                                sx={{ color: AppStyles.colors['#027A9D'] }}
                                endIcon={<TextSnippetOutlined />}
                                onClick={() => {
                                    handleOpenModal(row.original)
                                }}
                            >
                                {row.original.chairNote ? 'Add Chair Note' : 'Update Chair Note'}
                            </Button>
                        </Box>
                    )
                },
                enableColumnFilter: false,
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableSorting: false,
            },
            {
                accessorKey: 'reviewerConflicts',
                header: 'Reviewer Conflicts',
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: AppStyles.colors['#027A9D'],
                            ':hover': {
                                textDecoration: 'underline',
                            },
                            cursor: 'pointer',
                            fontSize: 16,
                        }}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/edit-conflict/${row.original.paperId}`)
                        }
                    >
                        {row.original.reviewerConflicts ? row.original.reviewerConflicts : 0}
                    </Typography>
                ),
                size: 215,
                filterFn: 'contains',
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'submissionConflicts',
                header: 'Submission Conflicts',
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 16 }}>
                        {row.original.submissionConflicts ? row.original.submissionConflicts : 0}
                    </Typography>
                ),
                size: 200,
                filterFn: 'contains',
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'assigned',
                header: 'Assigned',
                Cell: ({ row }) => (
                    <React.Fragment>
                        <Typography
                            sx={{
                                fontWeight: 500,
                                color: AppStyles.colors['#027A9D'],
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                                cursor: 'pointer',
                            }}
                            onClick={() =>
                                history.push(`/conferences/${conferenceId}/dashboard-console/${row.original.paperId}`)
                            }
                        >
                            {row.original.assigned ? row.original.assigned : 0}
                        </Typography>
                        {!row.original.assigned && (
                            <Button
                                variant="text"
                                sx={{ textTransform: 'none' }}
                                onClick={() =>
                                    history.push(
                                        `/conferences/${conferenceId}/dashboard-console/${row.original.paperId}`
                                    )
                                }
                            >
                                Assign Reviewer
                            </Button>
                        )}
                    </React.Fragment>
                ),
                size: 160,
                filterFn: 'contains',
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'reviewed',
                header: 'Progress',
                Cell: ({ row }) => {
                    const percentProgress =
                        row.original.reviewed !== null ? (row.original.reviewed / row.original.assigned) * 100 : 0
                    return (
                        <React.Fragment>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                    <LinearProgress variant="determinate" value={percentProgress} />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                                        percentProgress
                                    )}%`}</Typography>
                                </Box>
                            </Box>
                            <Box textAlign="left">
                                <Typography variant="caption">
                                    {row.original.reviewed ? row.original.reviewed : 0}/
                                    {row.original.assigned ? row.original.assigned : 0}
                                </Typography>
                            </Box>
                        </React.Fragment>
                    )
                },
                enableColumnFilter: false,
                enableSorting: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'averageScore',
                header: 'Average Score',
                Cell: ({ row }) => (
                    <Typography textAlign="center">
                        {row.original.averageScore ? row.original.averageScore : ''}
                    </Typography>
                ),
                columnFilterModeOptions: ['greaterThan', 'greaterThanOrEqualTo', 'lessThan', 'lessThanOrEqualTo'],
                filterFn: 'greaterThan',
                size: 190,
                enableColumnFilter: false,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: 'Status',
                Filter: () => (
                    <Select
                        fullWidth
                        variant="standard"
                        size="small"
                        onChange={(event) => handleChangeDecision(event.target.value)}
                        value={statusId}
                        style={{ textAlign: 'center' }}
                    >
                        <MenuItemMUI value={''} sx={{ fontStyle: 'italic' }}>
                            None
                        </MenuItemMUI>
                        {paperStatus?.map((status) => (
                            <MenuItemMUI key={status.id} value={status.id}>
                                {status.text}
                            </MenuItemMUI>
                        ))}
                    </Select>
                ),
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection="column">
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    color:
                                        row.original.status === 'Accept'
                                            ? '#008000'
                                            : row.original.status === 'Revision'
                                            ? '#af861f '
                                            : row.original.status === 'Desk Reject'
                                            ? '#b71c1c '
                                            : row.original.status === 'Awaiting Decision'
                                            ? '#1976d2'
                                            : '#a13311',
                                }}
                            >
                                {row.original.status}
                            </Typography>
                            {row.original.notifiedStatus === 'Accept' ||
                            row.original.notifiedStatus === 'Reject' ||
                            row.original.notifiedStatus === 'Desk Reject' ? (
                                ''
                            ) : (
                                <Button
                                    variant="outlined"
                                    sx={{ color: AppStyles.colors['#027A9D'], mt: 1, textTransform: 'none' }}
                                    endIcon={<HowToVoteOutlined />}
                                    onClick={() =>
                                        history.push({
                                            pathname: `/conferences/${conferenceId}/submission/${row.original.paperId}/decision`,
                                            state: { statusId: row.original.statusId, statusName: row.original.status },
                                        })
                                    }
                                    // disabled={
                                    //     stepSelected?.guidelineGroup &&
                                    //     !stepSelected?.guidelineGroup?.toUpperCase().includes('DECISION')
                                    // }
                                >
                                    Decide on Paper
                                </Button>
                            )}
                            {row.original.status !== 'Desk Reject' &&
                                row.original.notifiedStatus !== 'Desk Reject' &&
                                row.original.notifiedStatus !== 'Accept' &&
                                row.original.notifiedStatus !== 'Revision' &&
                                row.original.notifiedStatus !== 'Reject' && (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ mt: 1, textTransform: 'none' }}
                                        endIcon={<NotInterestedOutlined />}
                                        onClick={() => handleOpenDeskReject(row.original)}
                                    >
                                        Desk Reject
                                    </Button>
                                )}
                            {row.original.status === 'Desk Reject' && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    sx={{ mt: 1, textTransform: 'none' }}
                                    // endIcon={<NotInterestedOutlined />}
                                    onClick={() => handleOpenConfirmDeskReject(row.original)}
                                >
                                    Remove Desk Reject
                                </Button>
                            )}
                        </Box>
                    )
                },
                size: 165,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                filterFn: 'contains',
                enableSorting: false,
            },
            {
                id: 'notifyStatus',
                accessorKey: 'notifiedStatus',
                header: 'Notify Status',
                Filter: () => (
                    <Select
                        fullWidth
                        variant="standard"
                        size="small"
                        onChange={(event) => handleChangeDecisionNotify(event.target.value)}
                        value={statusNotifyID}
                        style={{ textAlign: 'center' }}
                    >
                        <MenuItemMUI value={''} sx={{ fontStyle: 'italic' }}>
                            None
                        </MenuItemMUI>
                        {paperStatus?.map((status) => (
                            <MenuItemMUI key={status.id} value={status.id}>
                                {status.text}
                            </MenuItemMUI>
                        ))}
                    </Select>
                ),
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection="column">
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    color:
                                        row.original.notifiedStatus === 'Accept'
                                            ? '#008000'
                                            : row.original.notifiedStatus === 'Revision'
                                            ? '#af861f '
                                            : row.original.notifiedStatus === 'Desk Reject'
                                            ? '#b71c1c '
                                            : row.original.notifiedStatus === 'Awaiting Decision'
                                            ? '#1976d2'
                                            : '#a13311',
                                }}
                            >
                                {row.original.notifiedStatus}
                            </Typography>
                        </Box>
                    )
                },
                size: 165,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                filterFn: 'contains',
                enableSorting: false,
            },
            {
                accessorKey: 'revisionSubmitted',
                header: 'Revision Submitted?',
                Filter: () => (
                    <Select
                        fullWidth
                        variant="standard"
                        size="small"
                        onChange={(event) => handleChangeRevision(event.target.value)}
                        value={isRevisionSubmit}
                        style={{ textAlign: 'center' }}
                    >
                        <MenuItemMUI value={''} sx={{ fontStyle: 'italic' }}>
                            None
                        </MenuItemMUI>
                        <MenuItemMUI value={'notapplied'}>Not Applied</MenuItemMUI>
                        <MenuItemMUI value={'true'}>Yes</MenuItemMUI>
                        <MenuItemMUI value={'false'}>No</MenuItemMUI>
                    </Select>
                ),
                Cell: ({ row }) => {
                    return <Typography>{row.original.revisionSubmitted === true ? 'Yes' : 'No'}</Typography>
                },
                size: 230,
                muiTableHeadCellProps: {
                    align: 'center',
                },

                enableSorting: false,
            },
            {
                accessorKey: 'isRequestedForCameraReady',
                header: 'Requested for Camera Ready?',
                Cell: ({ row }) => {
                    return (
                        <Select
                            size="small"
                            onChange={(event) => handleRequestCameraReady(event.target.value, row)}
                            value={row.original.isRequestedForCameraReady}
                            disabled={
                                (loading.status && row.original.paperId === loading.rowId) ||
                                row.original.status !== 'Accept'
                            }
                        >
                            <MenuItemMUI value={true}>Yes</MenuItemMUI>
                            <MenuItemMUI value={false}>No</MenuItemMUI>
                        </Select>
                    )
                },
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                accessorKey: 'cameraReadySubmitted',
                header: 'Camera Ready Submitted?',
                Cell: ({ row }) => {
                    return <Typography>{row.original.cameraReadySubmitted === true ? 'Yes' : 'No'}</Typography>
                },
                size: 240,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                enableColumnFilter: false,
                enableSorting: false,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            tableData,
            loading.status,
            statusId,
            paperStatus,
            isRevisionSubmit,
            statusNotifyID,
            stepSelected?.guidelineGroup,
        ]
    )
    return (
        <MaterialReactTable
            columns={columns}
            data={tableData}
            enableColumnFilterModes
            enableRowActions
            enableColumnResizing
            enablePinning
            enableStickyHeader
            enableRowNumbers
            manualPagination
            rowCount={data?.totalCount}
            positionActionsColumn="last"
            positionToolbarAlertBanner="bottom"
            renderTopToolbarCustomActions={() => {
                return (
                    <Box sx={{ gap: '0.5rem' }}>
                        <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                            {data?.totalCount && <>{data?.totalCount ? data?.totalCount : 0} submissions in total</>}
                        </Typography>
                        <Box>
                            <LoadingButton
                                variant="outlined"
                                startIcon={<DownloadOutlined />}
                                disabled={buttonLoading}
                                loadingPosition="start"
                                size="medium"
                                onClick={() => handleDownload()}
                            >
                                Download All Submissions
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
                        </Box>
                    </Box>
                )
            }}
            muiTableBodyProps={{
                sx: () => ({
                    '& tr:nth-of-type(4n+1)': {
                        backgroundColor: AppStyles.colors['#F7FCFF'],
                    },
                }),
            }}
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
                },
            })}
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
            renderRowActionMenuItems={({ row }) => [
                <MenuItemMUI
                    key={uuid()}
                    onClick={() =>
                        history.push(`/conferences/${conferenceId}/submission-summary/${row.original.paperId}`)
                    }
                    sx={{ m: 0 }}
                >
                    View Submission
                </MenuItemMUI>,
                row.original.notifiedStatus === 'Awaiting Decision' && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push({
                                pathname: `/conferences/${conferenceId}/submission/${row.original.trackId}/update-paper-submission/${row.original.paperId}`,
                                state: { trackName: row.original.trackName },
                            })
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Edit Submission
                        <Divider />
                    </MenuItemMUI>
                ),
                row.original.notifiedStatus === 'Awaiting Decision' && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() => handleOpenConfirmModal(row)}
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Delete Submission
                    </MenuItemMUI>
                ),
                (row.original.notifiedStatus === 'Awaiting Decision' || row.original.notifiedStatus === 'Revision') && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/edit-conflict/${row.original.paperId}`)
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Edit Conflicts
                        <Divider />
                    </MenuItemMUI>
                ),
                (row.original.notifiedStatus === 'Awaiting Decision' || row.original.notifiedStatus === 'Revision') && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/dashboard-console/${row.original.paperId}`)
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Edit Reviewer Assignments
                        <Divider />
                    </MenuItemMUI>
                ),
                row.original.assigned && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/submission/${row.original.paperId}/review`)
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        View Reviews
                        <Divider />
                    </MenuItemMUI>
                ),
                row.original.notifiedStatus === 'Revision' && !row.original.revisionSubmitted && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/submission/${row.original.paperId}/revision`)
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Upload Revision
                        <Divider />
                    </MenuItemMUI>
                ),
                row.original.notifiedStatus === 'Revision' && row.original.revisionSubmitted && (
                    <MenuItemMUI
                        key={uuid()}
                        onClick={() =>
                            history.push(
                                `/conferences/${conferenceId}/submission/${row.original.paperId}/edit-revision`
                            )
                        }
                        sx={{ m: 0, boxShadow: 'inset 0 -1px 0 #edeeef' }}
                    >
                        Edit Revision
                        <Divider />
                    </MenuItemMUI>
                ),
            ]}
            muiTableBodyCellEditTextFieldProps={() => ({
                variant: 'outlined',
            })}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            onGlobalFilterChange={setGlobalFilter}
            onColumnVisibilityChange={setVisibility}
            state={{
                pagination,
                isLoading: !!isLoading,
                showProgressBars: !!isFetching || loading.status,
                sorting,
                columnVisibility: columnVisibility,
            }}
            initialState={{
                density: 'compact',
                columnVisibility: { chairNoteId: false },
            }}
        />
    )
}

export default SubmissionTable
