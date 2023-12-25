import React, { useEffect, useMemo, useState } from 'react'

import { cloneDeep } from 'lodash'
import MaterialReactTable from 'material-react-table'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Send, VisibilityOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, IconButton, Tooltip, Typography, Zoom } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import ConferenceDetail from '../ConferenceDetail'
import EmailInfoModal from './EmailInfoModal'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useEmail from '~/api/common/email'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import { formatDateTime } from '~/utils/commonFunction'

const EmailHistory = () => {
    const { conferenceId } = useParams()
    const {
        trackConference: { trackId, trackName },
        roleConference: { roleName },
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefetching, setIsRefetching] = useState(false)
    const { userId } = useAppSelector((state) => state.auth)
    const [emailRetryLoading, setEmailRetryLoading] = useState({ emailId: '', status: false })
    const { getEmailHistory, retryEmailAgain, retryAllEmailAgain } = useEmail()
    const [tableData, setTableData] = useState([])
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [paperInfo, setPaperInfo] = useState()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [unique, setUnique] = useState(uuid())
    const [loadingRetryAll, setLoadingRetryAll] = useState(false)
    const { pageIndex, pageSize } = pagination
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const track = roleName === ROLES_NAME.CHAIR ? null : trackId
    const [totalCount, setTotalCount] = useState(0)
    const showSnackbar = useSnackbar()

    const handleOpenPaperModal = (row) => {
        setPaperInfo(row)
        setOpenPaperModal(true)
    }

    const retryEmail = (row) => {
        const emailId = row.original.emailId
        const updatedTable = cloneDeep(tableData)
        const index = row.index
        setEmailRetryLoading({ emailId, status: true })
        retryEmailAgain(emailId)
            .then(() => {
                updatedTable[index].status = 'Sent'
                setTableData(updatedTable)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Retry sending email fail. Please try again later.',
                })
            })
            .finally(() => {
                setEmailRetryLoading({ emailId: '', status: false })
            })
    }

    const sendAllEmailFailed = () => {
        const getTrackId = roleName === ROLES_NAME.CHAIR ? null : trackId
        setLoadingRetryAll(true)
        retryAllEmailAgain(conferenceId, getTrackId, userId)
            .then(() => {
                setUnique(uuid())
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Retry sending email fail. Please try again later.',
                })
            })
            .finally(() => {
                setLoadingRetryAll(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            if (!tableData.length) {
                setIsLoading(true)
            } else {
                setIsRefetching(true)
            }
            const info = {
                SkipCount: pageIndex * pageSize,
                MaxResultCount: pageSize,
                InclusionText: globalFilter === undefined ? '' : globalFilter,
                Sorting: sorting[0]?.id,
                SortedAsc: !sorting[0]?.desc,
                AccountId: userId,
                TrackId: track,
                ConferenceId: conferenceId,
            }
            getEmailHistory(info, controller.signal)
                .then((response) => {
                    const data = response.data
                    setTotalCount(data.totalCount ? data.totalCount : 0)
                    setTableData(data?.items ? data?.items : [])
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {
                    setIsLoading(false)
                    setIsRefetching(false)
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId, track, pageIndex, pageSize, globalFilter, sorting, unique])

    const columns = useMemo(
        () => [
            {
                id: 'sentTime',
                accessorKey: 'sentTime',
                header: 'Sent Time',
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 16 }}>
                        {row.original.sentTime && formatDateTime(row.original.sentTime)}
                    </Typography>
                ),
            },
            {
                id: 'status',
                accessorKey: 'status',
                header: 'Status',
                size: 140,
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 16, color: row.original.status === 'Sent' ? '#13ed13' : 'red' }}>
                        {row.original.status}
                    </Typography>
                ),
            },
            {
                id: 'senderFullName',
                accessorKey: 'senderFullName',
                header: 'From Name',
            },
            {
                id: 'senderEmail',
                accessorKey: 'senderEmail',
                header: 'From Email',
            },
            {
                id: 'senderRoleName',
                accessorKey: 'senderRoleName',
                header: 'From Role',
                // size: 150,
            },
            {
                id: 'recipientName',
                accessorKey: 'recipientName',
                header: 'To Name',
            },
            {
                id: 'recipientEmail',
                accessorKey: 'recipientEmail',
                header: 'To Email',
            },
            {
                id: 'subject',
                accessorKey: 'subject',
                header: 'Subject',
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    const handleClosePaperModal = () => setOpenPaperModal(false)

    return (
        <ConferenceDetail>
            {openPaperModal && (
                <EmailInfoModal open={openPaperModal} handleClose={handleClosePaperModal} row={paperInfo} />
            )}
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={1}>
                    <Typography sx={{ fontSize: 28, fontWeight: 600 }}>Email History</Typography>
                </Box>
                <Box ml={1} mb={1}>
                    <ListItemPopupInfo
                        itemName="Conference name"
                        value={conferenceFullName}
                        itemWidth={1.5}
                        valueWidth={10.5}
                        outerStyle={{ boxShadow: 'none', my: 1 }}
                    />
                    <ListItemPopupInfo
                        itemName="Short name"
                        value={conferenceName}
                        itemWidth={1.5}
                        valueWidth={10.5}
                        outerStyle={{ boxShadow: 'none', my: 1 }}
                    />
                    {track && (
                        <ListItemPopupInfo
                            itemName="Track name"
                            value={trackName}
                            itemWidth={1.5}
                            valueWidth={10.5}
                            outerStyle={{ boxShadow: 'none', my: 1 }}
                        />
                    )}
                </Box>
                <Box display="flex" justifyContent="flex-end" sx={{ my: 2 }}>
                    <LoadingButton
                        onClick={sendAllEmailFailed}
                        loading={loadingRetryAll}
                        disabled={loadingRetryAll}
                        startIcon={<Send />}
                        loadingPosition="start"
                        variant="outlined"
                    >
                        Retry sending all failed email
                    </LoadingButton>
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    enableRowNumbers
                    enableColumnFilterModes
                    enableColumnResizing
                    rowCount={totalCount}
                    enableStickyHeader
                    enableRowActions
                    manualPagination
                    onSortingChange={setSorting}
                    onGlobalFilterChange={setGlobalFilter}
                    onPaginationChange={setPagination}
                    state={{
                        pagination,
                        isLoading: isLoading,
                        showProgressBars: isRefetching || loadingRetryAll,
                        sorting,
                    }}
                    positionActionsColumn="last"
                    muiTableHeadCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                            fontSize: 16,
                        },
                        align: 'center',
                    }}
                    muiTableBodyCellProps={{
                        sx: {
                            borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                            ':last-child': {
                                borderRight: 'none',
                            },
                            fontSize: 16,
                        },
                        align: 'center',
                    }}
                    displayColumnDefOptions={{
                        'mrt-row-numbers': {
                            size: 10,
                        },
                    }}
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(4n+1)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    renderDetailPanel={({ row }) => (
                        <Box
                            ml={4}
                            sx={{
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                border: '1px solid rgba(0, 0, 0, 0.15)',
                                p: 1,
                                borderRadius: 1,
                            }}
                        >
                            <Typography mb={1} sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                Body:
                            </Typography>
                            <Typography
                                component={'pre'}
                                sx={{
                                    fontSize: 14,
                                    color: AppStyles.colors['#586380'],
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {row.original.body}
                            </Typography>
                        </Box>
                    )}
                    renderTopToolbarCustomActions={() => {
                        return (
                            <Typography my={1} mx={2} sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                {totalCount} emails in total
                            </Typography>
                        )
                    }}
                    initialState={{ pagination, density: 'compact' }}
                    renderRowActions={({ row }) => (
                        <React.Fragment>
                            <Tooltip TransitionComponent={Zoom} title="View Email Details" placement="bottom-start">
                                <IconButton onClick={() => handleOpenPaperModal(row.original)}>
                                    <VisibilityOutlined fontSize="small" sx={{ color: AppStyles.colors['#027A9D'] }} />
                                </IconButton>
                            </Tooltip>
                            {row.original.status === 'Sent Fail' && (
                                <Tooltip TransitionComponent={Zoom} title="Send again" placement="bottom-start">
                                    <IconButton
                                        disabled={
                                            emailRetryLoading.status &&
                                            emailRetryLoading.emailId === row.original.emailId
                                        }
                                        onClick={() => retryEmail(row)}
                                    >
                                        <Send fontSize="small" sx={{ color: AppStyles.colors['#027A9D'] }} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </React.Fragment>
                    )}
                />
            </Box>
        </ConferenceDetail>
    )
}

export default EmailHistory
