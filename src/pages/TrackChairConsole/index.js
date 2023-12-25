import { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { ArrowDropDown, Info } from '@mui/icons-material'
import { Box, Button, Container, Tooltip, Typography, Zoom } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import ChairNoteModal from './ChairNoteModal'
import ConfirmPopup from './ConfirmPopup'
import ConfirmRemoveDeskReject from './ConfirmRemoveDeskReject'
import DeskRejectModal from './DeskRejectModal'
import SubmissionTable from './SubmissionTable'

import { Menu, MenuDivider, MenuItem, SubMenu } from '@szhsin/react-menu'
import { useSnackbar } from '~/HOCs/SnackbarContext'
import {
    useBulkAllRequestCameraReadyMutation,
    useEditRequestedCameraReadyMutation,
    useGetPapersQuery,
} from '~/api/common/RTKQuery/TrackChairConsole'
import useEmail from '~/api/common/email'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useStatistic } from '~/api/common/statistic'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const TrackChairConsole = () => {
    const history = useHistory()
    const { stepSelected } = useAppSelector((state) => state.guidelines)
    const [sync, setSync] = useState(uuid())
    const { conferenceId } = useParams()
    const { deleteSubmission, getPaperStatuses } = usePaperSubmission()
    const { getSubmissionStatis } = useStatistic()
    const { sendEmailRequestCameraReady } = useEmail()
    const {
        trackConference: { trackId, trackName },
        roleConference: { roleName },
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const { tracks } = useAppSelector((state) => state.trackForChair)
    const [loading, setLoading] = useState({ status: false, rowId: null })
    const [paperInfo, setPaperInfo] = useState(null)
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const [columnVisibility, setVisibility] = useState({
        title: true,
        trackName: true,
        authors: true,
        chairNoteId: false,
        reviewerConflicts: true,
        submissionConflicts: true,
        assigned: true,
        reviewed: true,
        averageScore: true,
        status: true,
        notifyStatus: true,
        revisionSubmitted: true,
        isRequestedForCameraReady: true,
        cameraReadySubmitted: true,
    })
    const [clickFilter, setClickFilter] = useState({
        awaiting: false,
        accept: false,
        reject: false,
        revision: false,
        deskReject: false,
        paperRevisionSubmitted: false,
        paperRevisionNotSubmitted: false,
        cameraReady: false,
        toBeReview: false,
        reviewAssigned: false,
        reviewNotAssigned: false,
        reviewComplete: false,
        reviewIncomplete: false,
        notifiedDeskReject: false,
        notifiedAccepted: false,
        firstAttemptAccepted: false,
        afterRevisionAccepted: false,
        notifiedRejected: false,
        notifiedRevision: false,
    })
    const [sorting, setSorting] = useState([])
    const track = roleName === ROLES_NAME.CHAIR ? null : trackId
    const { pageIndex, pageSize } = pagination
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [openConfirmDeskRject, setOpenConfirmDeskReject] = useState(false)
    const [openDeskReject, setOpenDeskReject] = useState(false)
    const [statusId, setStatusId] = useState('')
    const [statusNotifyID, setStatusNotifyID] = useState('')
    const [isRevisionSubmit, setRevisionSubmit] = useState('')
    const showSnackbar = useSnackbar()
    const [statisData, setStatisData] = useState({})
    const [statisticShow, setStatisticShow] = useState({})
    const {
        data = { items: [], totalCount: 0 },
        isFetching,
        isLoading,
        refetch,
    } = useGetPapersQuery({
        conferenceId,
        track,
        page: pageIndex,
        pageSize,
        globalFilter: globalFilter === undefined ? '' : globalFilter,
        StatusId: statusId,
        IsSortedByAverageScoreAsc: sorting.length === 0 ? '' : !sorting[0]?.desc,
        IsRevisionSubmitted: isRevisionSubmit,
        NotifiedStatusId: statusNotifyID,
        IsToBeReviewedPapers: clickFilter.toBeReview ? clickFilter.toBeReview : '',
        IsReviewerAssigned: clickFilter.reviewAssigned ? true : clickFilter.reviewNotAssigned ? false : '',
        IsReviewProcessComplete: clickFilter.reviewComplete ? true : clickFilter.reviewIncomplete ? false : '',
        IsRequestedForCameraReady: clickFilter.cameraReady ? clickFilter.cameraReady : '',
        IsFirstAttemptFinalDecided: clickFilter.firstAttemptAccepted
            ? true
            : clickFilter.afterRevisionAccepted
            ? false
            : '',
    })

    const [paperStatus, setPaperStatus] = useState([])
    const [tableData, setTableData] = useState([])

    const statisticVisible = stepSelected?.guideLineSelected?.consoleFigures
        ? stepSelected?.guideLineSelected?.consoleFigures
        : ''
    const columnVisible = stepSelected?.guideLineSelected?.consoleUIColumns
        ? stepSelected?.guideLineSelected?.consoleUIColumns
        : ''

    const [editRequestedCameraReady] = useEditRequestedCameraReadyMutation()
    const [bulkAllRequestCameraReady] = useBulkAllRequestCameraReadyMutation()
    const handleOpenModal = (row) => {
        setPaperInfo(row)
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setPaperInfo(null)
        setOpenPaperModal(false)
    }

    const handleOpenDeskReject = (row) => {
        setPaperInfo(row)
        setOpenDeskReject(true)
    }

    const handleCloseDeskReject = () => {
        setPaperInfo(null)
        setOpenDeskReject(false)
    }

    const handleRequestCameraReady = (value, rowData) => {
        const paperId = rowData.original.paperId
        const cloneRow = cloneDeep(rowData.original)
        setLoading({ status: true, rowId: paperId })
        cloneRow.isRequestedForCameraReady = value
        editRequestedCameraReady({
            conferenceId,
            trackId: rowData.original.trackId,
            paperId,
            isCameraReadyRequested: value,
        })
            .then(() => {
                const updateTable = cloneDeep(tableData)
                updateTable[rowData.index] = cloneRow
                setTableData(updateTable)
            })
            .catch(() => {})
            .finally(() => {
                setLoading({ status: false, rowId: null })
            })
    }

    const sendMailCameraReady = () => {
        sendEmailRequestCameraReady(conferenceId, track)
        showSnackbar({
            severity: 'success',
            children: 'Send emails successfully.',
        })
    }

    const handleChangeDecision = (event) => {
        setStatusId(event)
    }

    const handleChangeDecisionNotify = (event) => {
        setStatusNotifyID(event)
    }

    const handleChangeRevision = (event) => {
        setRevisionSubmit(event)
    }

    useEffect(() => {
        if (!isFetching) {
            setTableData(data?.items ? data?.items : [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pageIndex,
        pageSize,
        isFetching,
        track,
        globalFilter,
        sorting,
        statusId,
        isRevisionSubmit,
        statusNotifyID,
        clickFilter.toBeReview,
        clickFilter.reviewAssigned,
        clickFilter.reviewNotAssigned,
        clickFilter.reviewComplete,
        clickFilter.reviewIncomplete,
        clickFilter.cameraReady,
    ])

    useEffect(() => {
        const controller = new AbortController()

        const signal = controller.signal

        if (conferenceId) {
            getPaperStatuses(null, signal)
                .then((response) => {
                    const statusData = response.data?.map(({ statusId, statusName }) => ({
                        value: statusName,
                        text: statusName,
                        id: statusId,
                    }))

                    setPaperStatus(statusData)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

    const handleOpenConfirmModal = (row) => {
        setPaperInfo(row)
        setOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setPaperInfo(null)
        setOpenConfirmModal(false)
    }

    const handleOpenConfirmDeskReject = (row) => {
        setPaperInfo(row)
        setOpenConfirmDeskReject(true)
    }

    const handleCloseConfirmDeskReject = () => {
        setPaperInfo(null)
        setOpenConfirmDeskReject(false)
    }

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            getSubmissionStatis(conferenceId, track, controller.signal)
                .then((res) => {
                    setStatisData(res.data)
                })
                .catch(() => {})
                .finally(() => {})
            return () => {
                controller.abort()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId, track, sync])

    useEffect(() => {
        if (stepSelected?.guideLineSelected?.route === '/conferences/:conferenceId/submission/submission-console') {
            if (statisticVisible !== '') {
                const statistic = JSON.parse(statisticVisible)
                setStatisticShow(statistic)
            }
            if (columnVisible !== '') {
                const column = JSON.parse(columnVisible)
                setVisibility(column)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnVisible, statisticVisible])

    return (
        <ConferenceDetail>
            {openPaperModal && <ChairNoteModal open={openPaperModal} handleClose={handleCloseModal} row={paperInfo} />}
            {openConfirmModal && (
                <ConfirmPopup
                    open={openConfirmModal}
                    handleClose={handleCloseConfirmModal}
                    deleteSubmission={deleteSubmission}
                    row={paperInfo}
                    refetch={refetch}
                    setSync={setSync}
                />
            )}
            {openConfirmDeskRject && (
                <ConfirmRemoveDeskReject
                    open={openConfirmDeskRject}
                    handleClose={handleCloseConfirmDeskReject}
                    row={paperInfo}
                    setSync={setSync}
                />
            )}
            {openDeskReject && (
                <DeskRejectModal
                    open={openDeskReject}
                    handleClose={handleCloseDeskReject}
                    row={paperInfo}
                    setSync={setSync}
                />
            )}
            <Container maxWidth="xl">
                <Box mb={1} display="flex" justifyContent="space-between">
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        {roleName} Console
                    </Typography>
                    <Box display="flex" alignItems="center">
                        <Menu
                            align={'end'}
                            menuButton={
                                <Button
                                    sx={{
                                        height: 36,
                                        textTransform: 'none',
                                        border: '1px solid #0077CC',
                                        backgroundImage: 'linear-gradient(#42A1EC, #0070C9)',
                                        borderRadius: 1,
                                        color: AppStyles.colors['#FFFFFF'],
                                        fontWeight: 500,
                                        padding: '4px 15px',
                                        ':hover': {
                                            backgroundImage: 'linear-gradient(#51A9EE, #147BCD)',
                                            borderColor: '#1482D0',
                                            textDecoration: 'none',
                                        },
                                        ':active': {
                                            backgroundImage: 'linear-gradient(#3D94D9, #0067B9)',
                                            borderColor: '#006DBC',
                                            outline: 'none',
                                        },
                                        ':focus': {
                                            boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                                            outline: 'none',
                                        },
                                    }}
                                >
                                    <Typography> Actions</Typography>
                                    <ArrowDropDown fontSize="medium" sx={{ color: AppStyles.colors['#FFFFFF'] }} />
                                </Button>
                            }
                        >
                            {roleName === ROLES_NAME.TRACK_CHAIR ? (
                                <MenuItem
                                    onClick={() =>
                                        history.push({
                                            pathname: `/conferences/${conferenceId}/submission/${trackId}/create-new-paper`,
                                            state: { trackName: trackName },
                                        })
                                    }
                                >
                                    Create New Submission
                                </MenuItem>
                            ) : (
                                <SubMenu label="Create New Submission">
                                    {tracks?.map((track) => (
                                        <MenuItem
                                            key={track.id}
                                            onClick={() =>
                                                history.push({
                                                    pathname: `/conferences/${conferenceId}/submission/${track.id}/create-new-paper`,
                                                    state: { trackName: track.name },
                                                })
                                            }
                                        >
                                            {track.name}
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                            )}
                            <MenuDivider />
                            {roleName === ROLES_NAME.TRACK_CHAIR ? (
                                <MenuItem
                                    onClick={() => {
                                        setLoading((prev) => ({ ...prev, status: true }))
                                        bulkAllRequestCameraReady({
                                            conferenceId,
                                            trackId,
                                            isRequest: true,
                                        }).finally(() => {
                                            setSync(uuid())
                                            setLoading((prev) => ({ ...prev, status: false }))
                                        })
                                    }}
                                >
                                    Bulk Enable
                                </MenuItem>
                            ) : (
                                <SubMenu label="Camera Ready Bulk Enable">
                                    <MenuItem
                                        onClick={() => {
                                            setLoading((prev) => ({ ...prev, status: true }))
                                            bulkAllRequestCameraReady({
                                                conferenceId,
                                                trackId: null,
                                                isRequest: true,
                                            }).finally(() => {
                                                setSync(uuid())
                                                setLoading((prev) => ({ ...prev, status: false }))
                                            })
                                        }}
                                    >
                                        All Tracks
                                    </MenuItem>
                                    {tracks?.map((track) => (
                                        <MenuItem
                                            onClick={() => {
                                                setLoading((prev) => ({ ...prev, status: true }))
                                                bulkAllRequestCameraReady({
                                                    conferenceId,
                                                    trackId: track.id,
                                                    isRequest: true,
                                                }).finally(() => {
                                                    setSync(uuid())
                                                    setLoading((prev) => ({ ...prev, status: false }))
                                                })
                                            }}
                                            key={track.id}
                                        >
                                            {track.name}
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                            )}

                            {roleName === ROLES_NAME.TRACK_CHAIR ? (
                                <MenuItem
                                    onClick={() => {
                                        setLoading((prev) => ({ ...prev, status: true }))
                                        bulkAllRequestCameraReady({
                                            conferenceId,
                                            trackId,
                                            isRequest: false,
                                        }).finally(() => {
                                            setSync(uuid())
                                            setLoading((prev) => ({ ...prev, status: false }))
                                        })
                                    }}
                                >
                                    Bulk Disable
                                </MenuItem>
                            ) : (
                                <SubMenu label="Camera Ready Bulk Disable">
                                    <MenuItem
                                        onClick={() => {
                                            setLoading((prev) => ({ ...prev, status: true }))
                                            bulkAllRequestCameraReady({
                                                conferenceId,
                                                trackId: null,
                                                isRequest: false,
                                            }).finally(() => {
                                                setSync(uuid())
                                                setLoading((prev) => ({ ...prev, status: false }))
                                            })
                                        }}
                                    >
                                        All Tracks
                                    </MenuItem>
                                    {tracks?.map((track) => (
                                        <MenuItem
                                            onClick={() => {
                                                setLoading((prev) => ({ ...prev, status: true }))
                                                bulkAllRequestCameraReady({
                                                    conferenceId,
                                                    trackId: track.id,
                                                    isRequest: false,
                                                }).finally(() => {
                                                    setSync(uuid())
                                                    setLoading((prev) => ({ ...prev, status: false }))
                                                })
                                            }}
                                            key={track.id}
                                        >
                                            {track.name}
                                        </MenuItem>
                                    ))}
                                </SubMenu>
                            )}

                            <MenuDivider />
                            <MenuItem
                                onClick={() =>
                                    history.push(`/conferences/${conferenceId}/notification-submission-paper`)
                                }
                            >
                                Open For Submission Author Notification
                            </MenuItem>
                            <MenuItem onClick={sendMailCameraReady}>Camera Ready Request Notification</MenuItem>
                            <MenuItem onClick={() => history.push(`/conferences/${conferenceId}/author-notification`)}>
                                Decision Author Notification
                            </MenuItem>
                        </Menu>
                        <SyncComponent
                            setSync={() => {
                                setSync(uuid())
                                refetch()
                            }}
                        />
                    </Box>
                </Box>
                <Box ml={1}>
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
                </Box>

                <Box>
                    <Box display="flex" justifyContent={'space-between'} mb={2}>
                        <Box
                            display="flex"
                            justifyContent={'center'}
                            width="16%"
                            sx={{
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                px: 1,
                                py: 2,
                                borderRadius: 2,
                                boxShadow:
                                    'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Overview</Typography>
                                <Button
                                    onClick={() => {
                                        setGlobalFilter('')
                                        setSorting([])
                                        setRevisionSubmit('')
                                        setStatusNotifyID('')
                                        setStatusId('')
                                        setClickFilter({
                                            awaiting: false,
                                            accept: false,
                                            reject: false,
                                            revision: false,
                                            deskReject: false,
                                            paperRevisionSubmitted: false,
                                            paperRevisionNotSubmitted: false,
                                            cameraReady: false,
                                            toBeReview: false,
                                            reviewAssigned: false,
                                            reviewNotAssigned: false,
                                            reviewComplete: false,
                                            reviewIncomplete: false,
                                            notifiedDeskReject: false,
                                            notifiedAccepted: false,
                                            firstAttemptAccepted: false,
                                            afterRevisionAccepted: false,
                                            notifiedRejected: false,
                                            notifiedRevision: false,
                                        })
                                    }}
                                    variant="outlined"
                                    sx={{
                                        boxShadow: statisticShow?.NumberOfSubmissions && '#1976D2 2.4px 2.4px 3.2px',
                                        textTransform: 'none',
                                        ':disabled': {
                                            // color: AppStyles.colors['#1976D2'],
                                        },
                                        position: 'relative',
                                    }}
                                    // disabled={statisticShow?.numberOfSubmissions === false}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of submissions"
                                        placement="bottom"
                                    >
                                        <Info
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Number of Submissions:{' '}
                                    {statisData?.numberOfSubmissions ? statisData.numberOfSubmissions : 0}
                                </Button>
                            </Box>
                        </Box>

                        <Box
                            width="40%"
                            sx={{
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                px: 2,
                                py: 2,
                                borderRadius: 2,
                                boxShadow:
                                    'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Revision</Typography>
                                <Box display="flex" justifyContent={'space-between'}>
                                    <Button
                                        onClick={() => {
                                            if (clickFilter.paperRevisionSubmitted === false) {
                                                handleChangeRevision('true')
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    paperRevisionSubmitted: true,
                                                    paperRevisionNotSubmitted: false,
                                                }))
                                            } else {
                                                handleChangeRevision('')
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    paperRevisionSubmitted: false,
                                                }))
                                            }
                                        }}
                                        variant={clickFilter.paperRevisionSubmitted ? 'contained' : 'outlined'}
                                        sx={{
                                            border: clickFilter.paperRevisionSubmitted === true && '1px solid #e8f4fd',
                                            boxShadow:
                                                statisticShow?.NumberOfPapersWithRevisionSubmitted &&
                                                '#1976D2 2.4px 2.4px 3.2px',
                                            textTransform: 'none',
                                            ':disabled': {
                                                boxShadow:
                                                    statisticShow?.NumberOfPapersWithRevisionSubmitted &&
                                                    '#1976D2 2.4px 2.4px 3.2px',
                                                // color: AppStyles.colors['#1976D2'],
                                            },
                                            position: 'relative',
                                        }}
                                        disabled={statisData?.numberOfPapersWithRevisionSubmitted === 0}
                                        disableElevation
                                    >
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            title="Number of papers with revision submitted"
                                            placement="bottom"
                                        >
                                            <Info
                                                color={
                                                    statisData?.numberOfPapersWithRevisionSubmitted !== 0
                                                        ? 'primary'
                                                        : 'inherit'
                                                }
                                                fontSize="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    transform: `translate(50%, -50%)`,
                                                }}
                                            />
                                        </Tooltip>
                                        Paper with Revision Submitted:{' '}
                                        {statisData?.numberOfPapersWithRevisionSubmitted
                                            ? statisData?.numberOfPapersWithRevisionSubmitted
                                            : 0}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (clickFilter.paperRevisionNotSubmitted === false) {
                                                handleChangeRevision('false')
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    paperRevisionNotSubmitted: true,
                                                    paperRevisionSubmitted: false,
                                                }))
                                            } else {
                                                handleChangeRevision('')
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    paperRevisionNotSubmitted: false,
                                                }))
                                            }
                                        }}
                                        variant={clickFilter.paperRevisionNotSubmitted ? 'contained' : 'outlined'}
                                        disableElevation
                                        sx={{
                                            border:
                                                clickFilter.paperRevisionNotSubmitted === true && '1px solid #e8f4fd',
                                            boxShadow:
                                                statisticShow?.NumberOfPapersWithRevisionNotYetSubmitted &&
                                                '#1976D2 2.4px 2.4px 3.2px',
                                            textTransform: 'none',
                                            ':disabled': {
                                                boxShadow:
                                                    statisticShow?.NumberOfPapersWithRevisionNotYetSubmitted &&
                                                    '#1976D2 2.4px 2.4px 3.2px',
                                                // color: AppStyles.colors['#1976D2'],
                                            },
                                            position: 'relative',
                                        }}
                                        disabled={statisData?.numberOfPapersWithRevisionNotYetSubmitted === 0}
                                    >
                                        Paper with Revision not Submitted:{' '}
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            title="Number of papers with revision not yet submitted"
                                            placement="bottom"
                                        >
                                            <Info
                                                color={
                                                    statisData?.numberOfPapersWithRevisionNotYetSubmitted !== 0
                                                        ? 'primary'
                                                        : 'inherit'
                                                }
                                                fontSize="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    transform: `translate(50%, -50%)`,
                                                }}
                                            />
                                        </Tooltip>
                                        {statisData?.numberOfPapersWithRevisionNotYetSubmitted
                                            ? statisData?.numberOfPapersWithRevisionNotYetSubmitted
                                            : 0}
                                    </Button>
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            display="flex"
                            justifyContent={'center'}
                            width="18%"
                            sx={{
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                px: 1,
                                py: 2,
                                borderRadius: 2,
                                boxShadow:
                                    'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                            }}
                        >
                            <Box>
                                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Camera Ready</Typography>
                                <Button
                                    onClick={() => {
                                        if (clickFilter.cameraReady === false) {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReady: true,
                                            }))
                                        } else {
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                cameraReady: false,
                                            }))
                                        }
                                    }}
                                    variant={clickFilter.cameraReady ? 'contained' : 'outlined'}
                                    disableElevation
                                    sx={{
                                        border: clickFilter.cameraReady === true && '1px solid #e8f4fd',
                                        boxShadow:
                                            statisticShow?.NumberOfCameraReadyRequestedPapers &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        textTransform: 'none',
                                        ':disabled': {
                                            boxShadow:
                                                statisticShow?.NumberOfCameraReadyRequestedPapers &&
                                                '#1976D2 2.4px 2.4px 3.2px',
                                            // color: AppStyles.colors['#1976D2'],
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfCameraReadyRequestedPapers === 0}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of camera ready requested papers"
                                        placement="bottom"
                                    >
                                        <Info
                                            color={
                                                statisData?.numberOfCameraReadyRequestedPapers !== 0
                                                    ? 'primary'
                                                    : 'inherit'
                                            }
                                            fontSize="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    Camera Ready Requested:{' '}
                                    {statisData?.numberOfCameraReadyRequestedPapers
                                        ? statisData?.numberOfCameraReadyRequestedPapers
                                        : 0}
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            mb: 2,
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            px: 2,
                            py: 2,
                            borderRadius: 2,
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Review</Typography>
                        <Box display="flex" justifyContent={'space-between'} mb={1}>
                            <Button
                                onClick={() => {
                                    if (clickFilter.toBeReview === false) {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            toBeReview: true,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            toBeReview: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.toBeReview ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    border: clickFilter.toBeReview === true && '1px solid #e8f4fd',
                                    boxShadow: statisticShow?.NumberOfToBeReviewedPapers && '#1976D2 2.4px 2.4px 3.2px',
                                    width: 220,
                                    textTransform: 'none',
                                    ':disabled': {
                                        boxShadow:
                                            statisticShow?.NumberOfToBeReviewedPapers && '#1976D2 2.4px 2.4px 3.2px',
                                        // color: AppStyles.colors['#1976D2'],
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfToBeReviewedPapers === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="All paper need to be reviewed"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        color={statisData?.numberOfToBeReviewedPapers !== 0 ? 'primary' : 'inherit'}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Papers:{' '}
                                {statisData?.numberOfToBeReviewedPapers ? statisData?.numberOfToBeReviewedPapers : 0}
                            </Button>

                            <Button
                                onClick={() => {
                                    if (clickFilter.reviewAssigned === false) {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewAssigned: true,
                                            reviewNotAssigned: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewAssigned: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.reviewAssigned ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    border: clickFilter.reviewAssigned === true && '1px solid #e8f4fd',
                                    boxShadow:
                                        statisticShow?.NumberOfReviewerAssignedPapers && '#1976D2 2.4px 2.4px 3.2px',
                                    width: 260,
                                    textTransform: 'none',
                                    ':disabled': {
                                        boxShadow:
                                            statisticShow?.NumberOfReviewerAssignedPapers &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        // color: AppStyles.colors['#1976D2'],
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfReviewerAssignedPapers === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of reviewer assigned papers"
                                    placement="bottom"
                                >
                                    <Info
                                        color={statisData?.numberOfReviewerAssignedPapers !== 0 ? 'primary' : 'inherit'}
                                        fontSize="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Papers Assigned Reviewers:{' '}
                                {statisData?.numberOfReviewerAssignedPapers
                                    ? statisData?.numberOfReviewerAssignedPapers
                                    : 0}
                            </Button>

                            <Button
                                onClick={() => {
                                    if (clickFilter.reviewNotAssigned === false) {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewNotAssigned: true,
                                            reviewAssigned: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewNotAssigned: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.reviewNotAssigned ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    border: clickFilter.reviewNotAssigned === true && '1px solid #e8f4fd',
                                    boxShadow:
                                        statisticShow?.NumberOfNotYetReviewerAssignedPapers &&
                                        '#1976D2 2.4px 2.4px 3.2px',
                                    textTransform: 'none',
                                    ':disabled': {
                                        boxShadow:
                                            statisticShow?.NumberOfNotYetReviewerAssignedPapers &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        // color: AppStyles.colors['#1976D2'],
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfNotYetReviewerAssignedPapers === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of not yet reviewer assigned papers"
                                    placement="bottom"
                                >
                                    <Info
                                        color={
                                            statisData?.numberOfNotYetReviewerAssignedPapers !== 0
                                                ? 'primary'
                                                : 'inherit'
                                        }
                                        fontSize="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Papers not Assigned Reviewers:{' '}
                                {statisData?.numberOfNotYetReviewerAssignedPapers
                                    ? statisData?.numberOfNotYetReviewerAssignedPapers
                                    : 0}
                            </Button>

                            <Button
                                onClick={() => {
                                    if (clickFilter.reviewComplete === false) {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewComplete: true,
                                            reviewIncomplete: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewComplete: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.reviewComplete ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    border: clickFilter.reviewComplete === true && '1px solid #e8f4fd',
                                    boxShadow:
                                        statisticShow?.NumberOfCompleteReviewPapers && '#1976D2 2.4px 2.4px 3.2px',
                                    width: 240,
                                    textTransform: 'none',
                                    ':disabled': {
                                        boxShadow:
                                            statisticShow?.NumberOfCompleteReviewPapers && '#1976D2 2.4px 2.4px 3.2px',
                                        // color: AppStyles.colors['#1976D2'],
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfCompleteReviewPapers === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of complete review papers"
                                    placement="bottom"
                                >
                                    <Info
                                        color={statisData?.numberOfCompleteReviewPapers !== 0 ? 'primary' : 'inherit'}
                                        fontSize="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Review Paper Complete:{' '}
                                {statisData?.numberOfCompleteReviewPapers
                                    ? statisData?.numberOfCompleteReviewPapers
                                    : 0}
                            </Button>
                            <Button
                                onClick={() => {
                                    if (clickFilter.reviewIncomplete === false) {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewIncomplete: true,
                                            reviewComplete: false,
                                        }))
                                    } else {
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reviewIncomplete: false,
                                        }))
                                    }
                                }}
                                variant={clickFilter.reviewIncomplete ? 'contained' : 'outlined'}
                                disableElevation
                                sx={{
                                    border: clickFilter.reviewIncomplete === true && '1px solid #e8f4fd',
                                    boxShadow:
                                        statisticShow?.NumberOfIncompleteReviewPapers && '#1976D2 2.4px 2.4px 3.2px',
                                    width: 240,
                                    textTransform: 'none',
                                    ':disabled': {
                                        boxShadow:
                                            statisticShow?.NumberOfIncompleteReviewPapers &&
                                            '#1976D2 2.4px 2.4px 3.2px',
                                        // color: AppStyles.colors['#1976D2'],
                                    },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfIncompleteReviewPapers === 0}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of incomplete review papers"
                                    placement="bottom"
                                >
                                    <Info
                                        color={statisData?.numberOfIncompleteReviewPapers !== 0 ? 'primary' : 'inherit'}
                                        fontSize="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                Review Paper Incomplete:{' '}
                                {statisData?.numberOfIncompleteReviewPapers
                                    ? statisData?.numberOfIncompleteReviewPapers
                                    : 0}
                            </Button>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            px: 2,
                            py: 2,
                            borderRadius: 2,
                            mb: 2,
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Notified Statuses</Typography>
                        <Box mb={1} display="flex" justifyContent={'space-between'} alignItems={'center'}>
                            <Box sx={{ width: 320 }}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{
                                        boxShadow:
                                            statisticShow?.NumberOfAcceptedNotifiedPapers &&
                                            '#008000 2.4px 2.4px 3.2px',
                                        textTransform: 'none',
                                        color: clickFilter.notifiedAccepted === false ? '#008000' : '#f3f9ed',
                                        borderColor: clickFilter.notifiedAccepted === false ? '#008000' : '#f3f9ed',
                                        backgroundColor: clickFilter.notifiedAccepted === false ? '#f3f9ed' : '#008000',
                                        ':hover': {
                                            color: clickFilter.notifiedAccepted === true && '#f3f9ed',
                                            backgroundColor: clickFilter.notifiedAccepted === true && '#008000',
                                        },
                                        position: 'relative',
                                    }}
                                    disabled={statisData?.numberOfAcceptedNotifiedPapers === 0}
                                    onClick={() => {
                                        if (clickFilter.notifiedAccepted === false) {
                                            handleChangeDecisionNotify(
                                                paperStatus.find((item) => item.value === 'Accept').id
                                            )
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                notifiedAccepted: true,
                                                notifiedDeskReject: false,
                                                notifiedRejected: false,
                                                notifiedRevision: false,
                                                firstAttemptAccepted: false,
                                                afterRevisionAccepted: false,
                                            }))
                                        } else {
                                            setStatusNotifyID('')
                                            setClickFilter((prev) => ({
                                                ...prev,
                                                notifiedAccepted: false,
                                            }))
                                        }
                                    }}
                                >
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Number of accepted notified papers"
                                        placement="bottom"
                                    >
                                        <Info
                                            fontSize="small"
                                            sx={{
                                                color:
                                                    statisData?.numberOfAcceptedNotifiedPapers !== 0
                                                        ? '#008000'
                                                        : 'inherit',
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                transform: `translate(50%, -50%)`,
                                            }}
                                        />
                                    </Tooltip>
                                    <Typography
                                        sx={{
                                            fontWeight: clickFilter.notifiedAccepted === true && 'bold',
                                        }}
                                    >
                                        Accepted Notified Papers:{' '}
                                        <strong>
                                            {statisData?.numberOfAcceptedNotifiedPapers
                                                ? statisData?.numberOfAcceptedNotifiedPapers
                                                : 0}
                                        </strong>
                                    </Typography>
                                </Button>
                                <Box mt={1} display="flex" alignItems={'center'} justifyContent={'space-between'}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            boxShadow:
                                                statisticShow?.NumberOfFirstAttemptAcceptedNotifiedPapers &&
                                                '#008000 2.4px 2.4px 3.2px',
                                            textTransform: 'none',
                                            color: clickFilter.firstAttemptAccepted === false ? '#008000' : '#f3f9ed',
                                            borderColor:
                                                clickFilter.firstAttemptAccepted === false ? '#008000' : '#f3f9ed',
                                            backgroundColor:
                                                clickFilter.firstAttemptAccepted === false ? '#f3f9ed' : '#008000',
                                            ':hover': {
                                                color: clickFilter.firstAttemptAccepted === true && '#f3f9ed',
                                                backgroundColor: clickFilter.firstAttemptAccepted === true && '#008000',
                                            },
                                            position: 'relative',
                                        }}
                                        disabled={statisData?.numberOfFirstAttemptAcceptedNotifiedPapers === 0}
                                        onClick={() => {
                                            if (clickFilter.firstAttemptAccepted === false) {
                                                handleChangeDecisionNotify(
                                                    paperStatus.find((item) => item.value === 'Accept').id
                                                )
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    notifiedAccepted: false,
                                                    notifiedDeskReject: false,
                                                    notifiedRejected: false,
                                                    notifiedRevision: false,
                                                    firstAttemptAccepted: true,
                                                    afterRevisionAccepted: false,
                                                }))
                                            } else {
                                                setStatusNotifyID('')
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    firstAttemptAccepted: false,
                                                }))
                                            }
                                        }}
                                    >
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            title="Number of first attempt accepted notified papers"
                                            placement="bottom"
                                        >
                                            <Info
                                                fontSize="small"
                                                sx={{
                                                    color:
                                                        statisData?.numberOfFirstAttemptAcceptedNotifiedPapers !== 0
                                                            ? '#008000'
                                                            : 'inherit',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    transform: `translate(50%, -50%)`,
                                                }}
                                            />
                                        </Tooltip>
                                        <Typography
                                            sx={{
                                                fontWeight: clickFilter.firstAttemptAccepted === true && 'bold',
                                            }}
                                        >
                                            First Attempt:{' '}
                                            <strong>
                                                {statisData?.numberOfFirstAttemptAcceptedNotifiedPapers
                                                    ? statisData?.numberOfFirstAttemptAcceptedNotifiedPapers
                                                    : 0}
                                            </strong>
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            boxShadow:
                                                statisticShow?.NumberOfAfterRevisionAcceptedNotifiedPapers &&
                                                '#008000 2.4px 2.4px 3.2px',
                                            textTransform: 'none',
                                            color: clickFilter.afterRevisionAccepted === false ? '#008000' : '#f3f9ed',
                                            borderColor:
                                                clickFilter.afterRevisionAccepted === false ? '#008000' : '#f3f9ed',
                                            backgroundColor:
                                                clickFilter.afterRevisionAccepted === false ? '#f3f9ed' : '#008000',
                                            ':hover': {
                                                color: clickFilter.afterRevisionAccepted === true && '#f3f9ed',
                                                backgroundColor:
                                                    clickFilter.afterRevisionAccepted === true && '#008000',
                                            },
                                            position: 'relative',
                                        }}
                                        disabled={statisData?.numberOfAfterRevisionAcceptedNotifiedPapers === 0}
                                        onClick={() => {
                                            if (clickFilter.afterRevisionAccepted === false) {
                                                handleChangeDecisionNotify(
                                                    paperStatus.find((item) => item.value === 'Accept').id
                                                )
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    notifiedAccepted: false,
                                                    notifiedDeskReject: false,
                                                    notifiedRejected: false,
                                                    notifiedRevision: false,
                                                    firstAttemptAccepted: false,
                                                    afterRevisionAccepted: true,
                                                }))
                                            } else {
                                                setStatusNotifyID('')
                                                setClickFilter((prev) => ({
                                                    ...prev,
                                                    afterRevisionAccepted: false,
                                                }))
                                            }
                                        }}
                                    >
                                        <Tooltip
                                            TransitionComponent={Zoom}
                                            title="Number of after revision accepted notified papers"
                                            placement="bottom"
                                        >
                                            <Info
                                                fontSize="small"
                                                sx={{
                                                    color:
                                                        statisData?.numberOfAfterRevisionAcceptedNotifiedPapers !== 0
                                                            ? '#008000'
                                                            : 'inherit',
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    transform: `translate(50%, -50%)`,
                                                }}
                                            />
                                        </Tooltip>
                                        <Typography
                                            sx={{
                                                fontWeight: clickFilter.afterRevisionAccepted === true && 'bold',
                                            }}
                                        >
                                            After Revision:{' '}
                                            <strong>
                                                {statisData?.numberOfAfterRevisionAcceptedNotifiedPapers
                                                    ? statisData?.numberOfAfterRevisionAcceptedNotifiedPapers
                                                    : 0}
                                            </strong>
                                        </Typography>
                                    </Button>
                                </Box>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow:
                                        statisticShow?.NumberOfRejectedNotifiedPapers && '#a13311 2.4px 2.4px 3.2px',
                                    width: 300,
                                    textTransform: 'none',
                                    color: clickFilter.notifiedRejected === false ? '#a13311' : '#fbedeb',
                                    borderColor: clickFilter.notifiedRejected === false ? '#a13311' : '#fbedeb',
                                    backgroundColor: clickFilter.notifiedRejected === false ? '#fbedeb' : '#a13311',
                                    ':hover': {
                                        color: clickFilter.notifiedRejected === true && '#fbedeb',
                                        backgroundColor: clickFilter.notifiedRejected === true && '#a13311',
                                    },
                                    // ':disabled': {
                                    //     color: '#a13311',
                                    //     // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, #a13311 0px 0px 0px 1px inset',
                                    //     backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfRejectedNotifiedPapers === 0}
                                onClick={() => {
                                    if (clickFilter.notifiedRejected === false) {
                                        handleChangeDecisionNotify(
                                            paperStatus.find((item) => item.value === 'Reject').id
                                        )
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            notifiedAccepted: false,
                                            notifiedDeskReject: false,
                                            notifiedRejected: true,
                                            notifiedRevision: false,
                                            firstAttemptAccepted: false,
                                            afterRevisionAccepted: false,
                                        }))
                                    } else {
                                        setStatusNotifyID('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            notifiedRejected: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of rejected notified papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color:
                                                statisData?.numberOfRejectedNotifiedPapers !== 0
                                                    ? '#a13311'
                                                    : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.notifiedRejected === true && 'bold',
                                    }}
                                >
                                    Rejected Notified Papers:{' '}
                                    <strong>
                                        {statisData?.numberOfRejectedNotifiedPapers
                                            ? statisData?.numberOfRejectedNotifiedPapers
                                            : 0}
                                    </strong>
                                </Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow:
                                        statisticShow?.NumberOfRevisionNotifiedPapers && '#af861f 2.4px 2.4px 3.2px',
                                    width: 300,
                                    textTransform: 'none',
                                    color: clickFilter.notifiedRevision === false ? '#af861f' : '#fffdeb',
                                    borderColor: clickFilter.notifiedRevision === false ? '#af861f' : '#fffdeb',
                                    backgroundColor: clickFilter.notifiedRevision === false ? '#fffdeb' : '#af861f',
                                    ':hover': {
                                        color: clickFilter.notifiedRevision === true && '#fffdeb',
                                        backgroundColor: clickFilter.notifiedRevision === true && '#af861f',
                                    },
                                    // ':disabled': {
                                    //     color: '#af861f',
                                    //     // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, #af861f 0px 0px 0px 1px inset',
                                    //     backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfRevisionNotifiedPapers === 0}
                                onClick={() => {
                                    if (clickFilter.notifiedRevision === false) {
                                        handleChangeDecisionNotify(
                                            paperStatus.find((item) => item.value === 'Revision').id
                                        )
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            notifiedAccepted: false,
                                            notifiedDeskReject: false,
                                            notifiedRejected: false,
                                            notifiedRevision: true,
                                            firstAttemptAccepted: false,
                                            afterRevisionAccepted: false,
                                        }))
                                    } else {
                                        setStatusNotifyID('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            notifiedRevision: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of revision notified papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color:
                                                statisData?.numberOfRevisionNotifiedPapers !== 0
                                                    ? '#af861f'
                                                    : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.notifiedRevision === true && 'bold',
                                    }}
                                >
                                    Revision Notified Papers:{' '}
                                    <strong>
                                        {statisData?.numberOfRevisionNotifiedPapers
                                            ? statisData?.numberOfRevisionNotifiedPapers
                                            : 0}
                                    </strong>
                                </Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow:
                                        statisticShow?.NumberOfDeskRejectedNotifiedPapers &&
                                        '#b71c1c 2.4px 2.4px 3.2px',
                                    width: 300,
                                    textTransform: 'none',
                                    color: clickFilter.notifiedDeskReject === false ? '#b71c1c' : '#ffebee',
                                    borderColor: clickFilter.notifiedDeskReject === false ? '#b71c1c' : '#ffebee',
                                    backgroundColor: clickFilter.notifiedDeskReject === false ? '#ffebee' : '#b71c1c',
                                    ':hover': {
                                        color: clickFilter.notifiedDeskReject === true && '#ffebee',
                                        backgroundColor: clickFilter.notifiedDeskReject === true && '#b71c1c',
                                    },
                                    // ':disabled': {
                                    //     color: '#b71c1c',
                                    //     // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, #b71c1c 0px 0px 0px 1px inset',
                                    //     backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfDeskRejectedNotifiedPapers === 0}
                                onClick={() => {
                                    if (clickFilter.notifiedDeskReject === false) {
                                        handleChangeDecisionNotify(
                                            paperStatus.find((item) => item.value === 'Desk Reject').id
                                        )
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            notifiedAccepted: false,
                                            notifiedDeskReject: true,
                                            notifiedRejected: false,
                                            notifiedRevision: false,
                                            firstAttemptAccepted: false,
                                            afterRevisionAccepted: false,
                                        }))
                                    } else {
                                        setStatusNotifyID('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            notifiedDeskReject: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of desk rejected notified papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color:
                                                statisData?.numberOfDeskRejectedNotifiedPapers !== 0
                                                    ? '#b71c1c'
                                                    : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.notifiedDeskReject === true && 'bold',
                                    }}
                                >
                                    Desk Rejected Notified Papers:{' '}
                                    <strong>
                                        {statisData?.numberOfDeskRejectedNotifiedPapers
                                            ? statisData?.numberOfDeskRejectedNotifiedPapers
                                            : 0}
                                    </strong>
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            px: 2,
                            py: 2,
                            borderRadius: 2,
                            mb: 2,
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',
                        }}
                    >
                        <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Paper Statuses</Typography>
                        <Box mb={1} display="flex" justifyContent={'space-between'}>
                            <Button
                                variant={'outlined'}
                                sx={{
                                    boxShadow:
                                        statisticShow?.NumberOfAwaitingDecisionPapers && '#1976d2 2.4px 2.4px 3.2px',
                                    width: 250,
                                    textTransform: 'none',
                                    color: clickFilter.awaiting === false ? '#1976d2' : '#e8f4fd',
                                    borderColor: clickFilter.awaiting === false ? '#1976d2' : '#e8f4fd',
                                    backgroundColor: clickFilter.awaiting === false ? '#e8f4fd' : '#1976d2',
                                    ':hover': {
                                        color: clickFilter.awaiting === true && '#e8f4fd',
                                        backgroundColor: clickFilter.awaiting === true && '#1976d2',
                                    },
                                    // ':disabled': {
                                    //     // color: '#1976d2',
                                    //     // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, #1976d2 0px 0px 0px 1px inset',
                                    //     // backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfAwaitingDecisionPapers === 0}
                                onClick={() => {
                                    if (clickFilter.awaiting === false) {
                                        handleChangeDecision(
                                            paperStatus.find((item) => item.value === 'Awaiting Decision').id
                                        )
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            awaiting: true,
                                            accept: false,
                                            deskReject: false,
                                            reject: false,
                                            revision: false,
                                        }))
                                    } else {
                                        setStatusId('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            awaiting: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of awaiting decision papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color:
                                                statisData?.numberOfAwaitingDecisionPapers !== 0
                                                    ? '#1976d2'
                                                    : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.awaiting === true && 'bold',
                                    }}
                                >
                                    Awaiting Decision:{' '}
                                    <strong>
                                        {statisData?.numberOfAwaitingDecisionPapers
                                            ? statisData?.numberOfAwaitingDecisionPapers
                                            : 0}
                                    </strong>
                                </Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow: statisticShow?.NumberOfAcceptedPapers && '#008000 2.4px 2.4px 3.2px',
                                    width: 250,
                                    textTransform: 'none',
                                    color: clickFilter.accept === false ? '#008000' : '#f3f9ed',
                                    borderColor: clickFilter.accept === false ? '#008000' : '#f3f9ed',
                                    backgroundColor: clickFilter.accept === false ? '#f3f9ed' : '#008000',
                                    ':hover': {
                                        color: clickFilter.accept === true && '#f3f9ed',
                                        backgroundColor: clickFilter.accept === true && '#008000',
                                    },
                                    // ':disabled': {
                                    //     // color: '#008000',
                                    //     // backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfAcceptedPapers === 0}
                                onClick={() => {
                                    if (clickFilter.accept === false) {
                                        handleChangeDecision(paperStatus.find((item) => item.value === 'Accept').id)
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            accept: true,
                                            awaiting: false,
                                            deskReject: false,
                                            reject: false,
                                            revision: false,
                                        }))
                                    } else {
                                        setStatusId('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            accept: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of accepted papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color: statisData?.numberOfAcceptedPapers !== 0 ? '#008000' : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.accept === true && 'bold',
                                    }}
                                >
                                    Accepted Submission:{' '}
                                    <strong>
                                        {statisData?.numberOfAcceptedPapers ? statisData?.numberOfAcceptedPapers : 0}
                                    </strong>
                                </Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow: statisticShow?.NumberOfRejectedPapers && '#a13311 2.4px 2.4px 3.2px',
                                    width: 250,
                                    textTransform: 'none',
                                    color: clickFilter.reject === false ? '#a13311' : '#fbedeb',
                                    borderColor: clickFilter.reject === false ? '#a13311' : '#fbedeb',
                                    backgroundColor: clickFilter.reject === false ? '#fbedeb' : '#a13311',
                                    ':hover': {
                                        color: clickFilter.reject === true && '#fbedeb',
                                        backgroundColor: clickFilter.reject === true && '#a13311',
                                    },
                                    // ':disabled': {
                                    //     // color: '#a13311',
                                    //     // backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfRejectedPapers === 0}
                                onClick={() => {
                                    if (clickFilter.reject === false) {
                                        handleChangeDecision(paperStatus.find((item) => item.value === 'Reject').id)
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reject: true,
                                            accept: false,
                                            deskReject: false,
                                            awaiting: false,
                                            revision: false,
                                        }))
                                    } else {
                                        setStatusId('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            reject: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of rejected papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color: statisData?.numberOfRejectedPapers !== 0 ? '#a13311' : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.reject === true && 'bold',
                                    }}
                                >
                                    Rejected Submission:{' '}
                                    <strong>
                                        {statisData?.numberOfRejectedPapers ? statisData?.numberOfRejectedPapers : 0}
                                    </strong>
                                </Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow: statisticShow?.NumberOfRevisionPapers && '#af861f 2.4px 2.4px 3.2px',
                                    width: 250,
                                    textTransform: 'none',
                                    color: clickFilter.revision === false ? '#af861f' : '#fffdeb',
                                    borderColor: clickFilter.revision === false ? '#af861f' : '#fffdeb',
                                    backgroundColor: clickFilter.revision === false ? '#fffdeb' : '#af861f',
                                    ':hover': {
                                        color: clickFilter.revision === true && '#fffdeb',
                                        backgroundColor: clickFilter.revision === true && '#af861f',
                                    },
                                    // ':disabled': {
                                    //     // color: '#af861f',
                                    //     // backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfRevisionPapers === 0}
                                onClick={() => {
                                    if (clickFilter.revision === false) {
                                        handleChangeDecision(paperStatus.find((item) => item.value === 'Revision').id)
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            revision: true,
                                            accept: false,
                                            deskReject: false,
                                            reject: false,
                                            awaiting: false,
                                        }))
                                    } else {
                                        setStatusId('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            revision: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of revision papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color: statisData?.numberOfRevisionPapers !== 0 ? '#af861f' : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.revision === true && 'bold',
                                    }}
                                >
                                    Revision Submission:{' '}
                                    <strong>
                                        {statisData?.numberOfRevisionPapers ? statisData?.numberOfRevisionPapers : 0}
                                    </strong>
                                </Typography>
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{
                                    boxShadow: statisticShow?.NumberOfDeskRejectedPapers && '#b71c1c 2.4px 2.4px 3.2px',
                                    width: 250,
                                    textTransform: 'none',
                                    color: clickFilter.deskReject === false ? '#b71c1c' : '#ffebee',
                                    borderColor: clickFilter.deskReject === false ? '#b71c1c' : '#ffebee',
                                    backgroundColor: clickFilter.deskReject === false ? '#ffebee' : '#b71c1c',
                                    ':hover': {
                                        color: clickFilter.deskReject === true && '#ffebee',
                                        backgroundColor: clickFilter.deskReject === true && '#b71c1c',
                                    },
                                    // ':disabled': {
                                    //     // color: '#ffebee',
                                    //     // backgroundColor: AppStyles.colors['#F5F5F5'],
                                    // },
                                    position: 'relative',
                                }}
                                disabled={statisData?.numberOfDeskRejectedPapers === 0}
                                onClick={() => {
                                    if (clickFilter.deskReject === false) {
                                        handleChangeDecision(
                                            paperStatus.find((item) => item.value === 'Desk Reject').id
                                        )
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            deskReject: true,
                                            accept: false,
                                            awaiting: false,
                                            reject: false,
                                            revision: false,
                                        }))
                                    } else {
                                        setStatusId('')
                                        setClickFilter((prev) => ({
                                            ...prev,
                                            deskReject: false,
                                        }))
                                    }
                                }}
                            >
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title="Number of desk rejected papers"
                                    placement="bottom"
                                >
                                    <Info
                                        fontSize="small"
                                        sx={{
                                            color: statisData?.numberOfDeskRejectedPapers !== 0 ? '#b71c1c' : 'inherit',
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            transform: `translate(50%, -50%)`,
                                        }}
                                    />
                                </Tooltip>
                                <Typography
                                    sx={{
                                        fontWeight: clickFilter.deskReject === true && 'bold',
                                    }}
                                >
                                    Desk Reject:{' '}
                                    <strong>
                                        {statisData?.numberOfDeskRejectedPapers
                                            ? statisData?.numberOfDeskRejectedPapers
                                            : 0}
                                    </strong>
                                </Typography>
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <SubmissionTable
                    track={track}
                    stepSelected={stepSelected}
                    conferenceId={conferenceId}
                    handleOpenModal={handleOpenModal}
                    handleChangeDecision={handleChangeDecision}
                    statusId={statusId}
                    paperStatus={paperStatus}
                    handleOpenDeskReject={handleOpenDeskReject}
                    handleChangeDecisionNotify={handleChangeDecisionNotify}
                    statusNotifyID={statusNotifyID}
                    handleChangeRevision={handleChangeRevision}
                    isRevisionSubmit={isRevisionSubmit}
                    handleRequestCameraReady={handleRequestCameraReady}
                    tableData={tableData}
                    loading={loading}
                    data={data}
                    handleOpenConfirmModal={handleOpenConfirmModal}
                    setPagination={setPagination}
                    setSorting={setSorting}
                    setGlobalFilter={setGlobalFilter}
                    setVisibility={setVisibility}
                    pagination={pagination}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    sorting={sorting}
                    columnVisibility={columnVisibility}
                    handleOpenConfirmDeskReject={handleOpenConfirmDeskReject}
                />
            </Container>
        </ConferenceDetail>
    )
}

export default TrackChairConsole
