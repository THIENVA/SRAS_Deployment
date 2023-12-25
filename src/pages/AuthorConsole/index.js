import React, { useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { useHistory, useParams } from 'react-router-dom'

import { DownloadOutlined } from '@mui/icons-material'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Container, Grid, MenuItem as MenuItemMUI, Select, Tab, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import ConfirmPopup from './ConfirmPopup'
import TableAuthor from './TableAuthor'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useGetPapersQuery } from '~/api/common/RTKQuery/AuthorConsole'
import { usePaperSubmission } from '~/api/common/paper-submission'
import useRegistration from '~/api/common/registration'
import useRevision from '~/api/common/revision'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const AuthorConsole = () => {
    const {
        conference: { conferenceName, conferenceFullName },
        websiteLink,
    } = useAppSelector((state) => state.conference)
    const { userId } = useAppSelector((state) => state.auth)
    const { submittableTracks } = useAppSelector((state) => state.trackForChair)
    const { deleteCameraReady, getPaperStatuses, deleteSubmission } = usePaperSubmission()
    const { removeRevision } = useRevision()
    const { uploadSupplementary } = usePaperSubmission()
    const { getRegistrationPapers } = useRegistration()
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const { conferenceId } = useParams()
    const [tableData, setTableData] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [paperInfo, setPaperInfo] = useState(null)
    const [actionType, setAction] = useState(null)
    const [statusId, setStatusId] = useState('')
    const [paperStatus, setPaperStatus] = useState([])
    const [supplementLoading, setSupplementLoading] = useState(false)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [isRegistration, setIsRegistration] = useState(false)
    const { pageIndex, pageSize } = pagination
    const [index, setIndex] = useState('0')
    const changeIndexHandler = (_, value) => {
        setIndex(value)
        setGlobalFilter('')
    }
    const {
        data = { items: [], totalCount: 0 },
        isFetching,
        isLoading,
        refetch,
    } = useGetPapersQuery({
        conferenceId,
        userId,
        page: pageIndex,
        pageSize,
        globalFilter: globalFilter === undefined ? '' : globalFilter,
        Sorting: sorting[0]?.id,
        SortedAsc: !sorting[0]?.desc,
        StatusId: statusId,
        IsRequestedForCameraReady: index === '1' ? true : '',
        IsRequestedForPresentation: index === '2' ? true : '',
    })
    const handleSaveRow = ({ row, values, exitEditingMode }) => {
        tableData[row.index] = values
        setTableData([...tableData])
        exitEditingMode()
    }

    const handleDownloadSubmission = (submissionId, submissionTitle) => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/submission-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${submissionTitle}.zip`)
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

    const handleCameraReady = (submissionId, submissionTitle) => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/download-camera-ready-file`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${submissionTitle}_CameraReady.zip`)
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

    const handleDownloadPresentation = (submissionId, submissionTitle) => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/download-presentation-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${submissionTitle}_Presentation.zip`)
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

    const handleDownloadCopyRight = (submissionId, submissionTitle) => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/download-copy-right-file`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${submissionTitle}_CopyRight.zip`)
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

    const handleRevision = (submissionId, submissionTitle) => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/download-revision-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${submissionTitle}_Revision.zip`)
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

    const handleSupplementary = (submissionId, submissionTitle) => {
        setSupplementLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${submissionId}/download-supplementary-material-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${submissionTitle}_Supplementary.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setSupplementLoading(false)
            })
    }

    const handleChangeDecision = (event) => {
        setStatusId(event)
    }

    useEffect(() => {
        const controller = new AbortController()

        if (conferenceId) {
            getPaperStatuses(null, controller.signal)
                .then((response) => {
                    const statusData = response.data?.map(({ statusId, statusName }) => ({
                        value: statusName,
                        text: statusName,
                        id: statusId,
                    }))

                    setPaperStatus(statusData)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            const registrablePapers = getRegistrationPapers(conferenceId, userId, controller.signal)
            Promise.all([registrablePapers]).then((response) => {
                const registrablePapers = response[0].data.registrablePapers
                if (registrablePapers) {
                    setIsRegistration(true)
                }
            })
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

    useEffect(() => {
        if (!isFetching) {
            setTableData(data?.items ? data?.items : [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, isFetching, globalFilter, sorting, statusId, index])

    const handleOpenConfirmModal = (row, action) => {
        setPaperInfo(row)
        setAction(action)
        setOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setPaperInfo(null)
        setAction(null)
        setOpenConfirmModal(false)
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'submissionId',
                header: 'Paper ID',
                size: 160,
                Cell: ({ row }) => (
                    <IDField
                        id={row?.original?.submissionId}
                        showButton={true}
                        style={{
                            color: AppStyles.colors['#027A9D'],
                            ':hover': {
                                textDecoration: 'underline',
                            },
                            cursor: 'pointer',
                            fontSize: 14,
                        }}
                        boxStyle={{ justifyContent: 'center' }}
                        onClick={() =>
                            history.push(`/conferences/${conferenceId}/submission-summary/${row.original.submissionId}`)
                        }
                    />
                ),
            },
            {
                accessorKey: 'title',
                header: 'Title',
                size: 200,
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },
            {
                accessorKey: 'trackName',
                header: 'Track',
                size: 120,
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                header: 'Files',
                size: 280,
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ row }) => {
                    return (
                        <React.Fragment>
                            {row.original.files.submissionFiles && (
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Submission Files:
                                    </Typography>
                                    <Box display="flex" flexDirection={'column'}>
                                        {row.original.files.submissionFiles?.map((value, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    fontSize: 14,
                                                }}
                                            >
                                                • {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={buttonLoading}
                                        loadingPosition="start"
                                        onClick={() =>
                                            handleDownloadSubmission(row.original.submissionId, row.original.title)
                                        }
                                    >
                                        Download Submission
                                    </LoadingButton>
                                </Box>
                            )}
                            {row.original.files.supplementaryMaterialFiles && (
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Supplementary Files:
                                    </Typography>
                                    <Box display="flex" flexDirection={'column'}>
                                        {row.original.files.supplementaryMaterialFiles?.map((value, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    fontSize: 14,
                                                }}
                                            >
                                                • {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={supplementLoading}
                                        loadingPosition="start"
                                        onClick={() =>
                                            handleSupplementary(row.original.submissionId, row.original.title)
                                        }
                                    >
                                        Download Supplementary
                                    </LoadingButton>
                                </Box>
                            )}
                            {row.original.files.revisionFiles && (
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Revision Files No.{row.original.files.revisionNo}
                                    </Typography>
                                    <Box display="flex" flexDirection={'column'}>
                                        {row.original.files.revisionFiles?.map((value, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    fontSize: 14,
                                                }}
                                            >
                                                • {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={buttonLoading}
                                        loadingPosition="start"
                                        onClick={() => handleRevision(row.original.submissionId, row.original.title)}
                                    >
                                        Download Revision
                                    </LoadingButton>
                                </Box>
                            )}
                            {row.original.files.cameraReadyFiles && (
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Camera Ready Files:
                                    </Typography>
                                    <Box display="flex" flexDirection={'column'}>
                                        {row.original.files.cameraReadyFiles?.map((value, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    fontSize: 14,
                                                }}
                                            >
                                                • {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={buttonLoading}
                                        loadingPosition="start"
                                        onClick={() => handleCameraReady(row.original.submissionId, row.original.title)}
                                    >
                                        Download Camera Ready
                                    </LoadingButton>
                                </Box>
                            )}
                            {row.original.files.copyRightFiles && (
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Copy Right Files:
                                    </Typography>
                                    <Box display="flex" flexDirection={'column'}>
                                        {row.original.files.copyRightFiles?.map((value, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    fontSize: 14,
                                                }}
                                            >
                                                • {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={buttonLoading}
                                        loadingPosition="start"
                                        onClick={() =>
                                            handleDownloadCopyRight(row.original.submissionId, row.original.title)
                                        }
                                    >
                                        Download Copy Right Files
                                    </LoadingButton>
                                </Box>
                            )}
                            {row.original.files.presentationFiles && (
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: 14,
                                        }}
                                    >
                                        Presentation Files:
                                    </Typography>
                                    <Box display="flex" flexDirection={'column'}>
                                        {row.original.files.presentationFiles?.map((value, index) => (
                                            <Typography
                                                key={index}
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    fontSize: 14,
                                                }}
                                            >
                                                • {value}
                                            </Typography>
                                        ))}
                                    </Box>
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={buttonLoading}
                                        loadingPosition="start"
                                        onClick={() =>
                                            handleDownloadPresentation(row.original.submissionId, row.original.title)
                                        }
                                    >
                                        Download Presentation Files
                                    </LoadingButton>
                                </Box>
                            )}
                        </React.Fragment>
                    )
                },
            },
            {
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
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
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
                            {row.original.status === 'Desk Reject' || row.original.status === 'Awaiting Decision' ? (
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                    }}
                                ></Typography>
                            ) : (
                                <Typography
                                    sx={{
                                        fontSize: 14,
                                        color: AppStyles.colors['#027A9D'],
                                        ':hover': {
                                            textDecoration: 'underline',
                                        },
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        history.push(
                                            `/conferences/${conferenceId}/submission/${row.original.submissionId}/paper-review`
                                        )
                                    }
                                >
                                    Reviews
                                </Typography>
                            )}
                        </Box>
                    )
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 180,
            },
            {
                accessorKey: 'deadline',
                header: 'Deadline Time',
                Cell: ({ row }) => {
                    return (
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    opacity: !row.original.deadline && 0.5,
                                    fontSize: !row.original.deadline && 14,
                                }}
                            >
                                {row.original.deadline
                                    ? new Date(row.original.deadline).toLocaleDateString('en-GB')
                                    : 'Currently no deadline'}
                            </Typography>
                        </Box>
                    )
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                size: 200,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [tableData, statusId, paperStatus]
    )

    return (
        <ConferenceDetail>
            {openConfirmModal && (
                <ConfirmPopup
                    open={openConfirmModal}
                    handleClose={handleCloseConfirmModal}
                    deleteCameraReady={deleteCameraReady}
                    row={paperInfo}
                    actionType={actionType}
                    removeRevision={removeRevision}
                    supplementary={uploadSupplementary}
                    deleteSubmission={deleteSubmission}
                    refresh={refetch}
                />
            )}
            <Container maxWidth="xl">
                <Box mb={1}>
                    <Grid container>
                        <Grid item xs={6} md={6} lg={6}>
                            <Typography sx={{ fontSize: 28, fontWeight: 600 }}>Authors Console</Typography>
                            <Box ml={1}>
                                <ListItemPopupInfo
                                    itemName="Conference name"
                                    value={conferenceFullName}
                                    itemWidth={3}
                                    valueWidth={9}
                                    outerStyle={{ boxShadow: 'none', my: 1 }}
                                />
                                <ListItemPopupInfo
                                    itemName="Short name"
                                    value={conferenceName}
                                    itemWidth={3}
                                    valueWidth={9}
                                    outerStyle={{ boxShadow: 'none', my: 1 }}
                                />
                                {websiteLink && (
                                    <Grid my={1} container item>
                                        <Grid item xs={3}>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: AppStyles.colors['#444B52'],
                                                }}
                                            >
                                                Conference Website
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography
                                                sx={{
                                                    color: AppStyles.colors['#027A9D'],
                                                    cursor: 'pointer',
                                                    width: 'fit-content',
                                                    fontSize: 18,
                                                }}
                                                onClick={() => window.open(websiteLink, '_blank')}
                                            >
                                                Go to page
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )}
                                <Box sx={{ ml: 0 }}>
                                    <SyncComponent setSync={() => refetch()} buttonStyle={{ ml: 0, mr: 1 }} />
                                    {isRegistration && (
                                        <Button
                                            variant="outlined"
                                            sx={{ ml: submittableTracks.length ? 2 : 0 }}
                                            onClick={() =>
                                                history.push(
                                                    `/conferences/${conferenceId}/submission/author/registration`
                                                )
                                            }
                                        >
                                            Register Paper
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                            {submittableTracks.length > 0 && (
                                <Box
                                    sx={{
                                        borderRadius: 2,
                                        p: 2,
                                        my: 1,
                                        mb: 3,
                                        backgroundColor: AppStyles.colors['#F5F5F5'],
                                        border: '0.5px solid #cecdcd',
                                    }}
                                >
                                    <Typography gutterBottom sx={{ fontSize: 16 }}>
                                        Welcome to the {conferenceFullName} ({conferenceName}) conference!
                                    </Typography>
                                    <Typography gutterBottom sx={{ fontSize: 16 }}>
                                        Currently, you can submit papers to {submittableTracks.length} tracks
                                    </Typography>
                                    {submittableTracks.map((trackItem, index) => (
                                        <Box mb={2} key={index}>
                                            <Typography fontWeight={700}>
                                                {index + 1}. {trackItem.name}
                                            </Typography>
                                            <Box display="flex" alignItems="center">
                                                <Typography>
                                                    Submission&apos;s Deadline:{' '}
                                                    {new Date(trackItem.deadline).toLocaleDateString('en-GB')} -
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: AppStyles.colors['#027A9D'],
                                                        ':hover': {
                                                            textDecoration: 'underline',
                                                        },
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        width: 'fit-content',
                                                    }}
                                                    ml={0.5}
                                                    onClick={() =>
                                                        history.push(
                                                            `/conferences/${conferenceId}/submission/${trackItem.id}/create-new-paper`
                                                        )
                                                    }
                                                >
                                                    Submit paper here.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Box>
                <TabContext value={index}>
                    <TabList onChange={changeIndexHandler} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab
                            label={`All Submissions`}
                            value={'0'}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label={`Requested for Camera Ready Submissions`}
                            value={'1'}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                        <Tab
                            label={`Requested for Presentation Submissions`}
                            value={'2'}
                            sx={{
                                minWidth: 100,
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 500,
                                color: AppStyles.colors['#333333'],
                            }}
                        />
                    </TabList>
                    <TabPanel value={'0'} sx={{ p: 0, pt: 2 }}>
                        <TableAuthor
                            columns={columns}
                            conferenceId={conferenceId}
                            data={data}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                            handleSaveRow={handleSaveRow}
                            isFetching={isFetching}
                            isLoading={isLoading}
                            pagination={pagination}
                            setGlobalFilter={setGlobalFilter}
                            setPagination={setPagination}
                            setSorting={setSorting}
                            sorting={sorting}
                            tableData={tableData}
                        />
                    </TabPanel>
                    <TabPanel value={'1'} sx={{ p: 0, pt: 2 }}>
                        <TableAuthor
                            columns={columns}
                            conferenceId={conferenceId}
                            data={data}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                            handleSaveRow={handleSaveRow}
                            isFetching={isFetching}
                            isLoading={isLoading}
                            pagination={pagination}
                            setGlobalFilter={setGlobalFilter}
                            setPagination={setPagination}
                            setSorting={setSorting}
                            sorting={sorting}
                            tableData={tableData}
                        />
                    </TabPanel>
                    <TabPanel value={'2'} sx={{ p: 0, pt: 2 }}>
                        <TableAuthor
                            columns={columns}
                            conferenceId={conferenceId}
                            data={data}
                            handleOpenConfirmModal={handleOpenConfirmModal}
                            handleSaveRow={handleSaveRow}
                            isFetching={isFetching}
                            isLoading={isLoading}
                            pagination={pagination}
                            setGlobalFilter={setGlobalFilter}
                            setPagination={setPagination}
                            setSorting={setSorting}
                            sorting={sorting}
                            tableData={tableData}
                        />
                    </TabPanel>
                </TabContext>
            </Container>
        </ConferenceDetail>
    )
}

export default AuthorConsole
