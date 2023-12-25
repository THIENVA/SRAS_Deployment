import React, { useEffect, useMemo, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { useHistory, useParams } from 'react-router-dom'

import { AssignmentOutlined, CheckCircle, DeleteOutline, DownloadOutlined, EditOutlined } from '@mui/icons-material'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Container, Grid, Skeleton, Tab, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import TableData from './TableData'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useGetPapersQuery } from '~/api/common/RTKQuery/ReviewerConsole'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const ReviewerConsole = () => {
    const history = useHistory()
    const {
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const showSnackbar = useSnackbar()
    const [tableData, setTableData] = useState([])
    const { conferenceId } = useParams()
    const { userId } = useAppSelector((state) => state.auth)
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState([])
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [index, setIndex] = useState('0')

    const { pageIndex, pageSize } = pagination
    const [submissionLoading, setSubmissionLoading] = useState(false)
    const [supplementLoading, setSupplementLoading] = useState(false)
    const [revisionLoading, setRevisionLoading] = useState(false)

    const {
        data = { items: [], totalCount: 0, reviewer: null, reviewedCount: 0, allCount: 0 },
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
        isChairViewing: false,
        IsReviewed: index === '1' ? true : '',
    })

    const changeIndexHandler = (_, value) => {
        setIndex(value)
        setGlobalFilter('')
    }

    const handleDownloadSubmission = (submissionId, submissionTitle) => {
        setSubmissionLoading(true)
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
                setSubmissionLoading(false)
            })
    }

    const handleRevision = (submissionId, submissionTitle) => {
        setRevisionLoading(true)
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
                setRevisionLoading(false)
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
    useEffect(() => {
        if (!isFetching) {
            setTableData(data?.items ? data?.items : [])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, isFetching, globalFilter, sorting, index])

    const columns = useMemo(
        () => [
            // {
            //     id: 'paper',
            //     header: '',
            //     columns: [
            {
                accessorKey: 'paperId',
                header: 'Paper ID',
                Cell: ({ row }) => (
                    <React.Fragment>
                        {/* <Typography
                            sx={{
                                fontWeight: 500,
                                color: AppStyles.colors['#027A9D'],
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                                cursor: 'pointer',
                            }}
                            onClick={() =>
                                history.push(`/conferences/${conferenceId}/submission-summary/${row.original.paperId}`)
                            }
                        >
                            {row.original.paperId}
                        </Typography> */}
                        <IDField
                            id={row?.original?.paperId}
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
                                history.push(`/conferences/${conferenceId}/submission-summary/${row.original.paperId}`)
                            }
                        />
                    </React.Fragment>
                ),
                enableEditing: false,
                size: 160,
            },
            {
                accessorKey: 'title',
                header: 'Title',
                enableEditing: false,
                size: 200,
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },

            {
                accessorKey: 'trackName',
                header: 'Track',
                enableEditing: false,
                size: 120,
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
                size: 240,
                enableColumnFilter: false,
            },
            //     ],
            // },
            // {
            //     id: 'subjectAreas',
            //     header: 'Subject Areas',
            //     columns: [
            {
                id: 'primarySubjectArea',
                header: 'Primary Subject Area',
                Cell: ({ row }) => (
                    <Box display="flex" flexDirection={'column'}>
                        {row.original.subjectAreas
                            .filter((area) => area.isPrimary)
                            .map((area, index) => (
                                <Typography color="primary" key={index}>
                                    {area.subjectAreaName}
                                </Typography>
                            ))}
                    </Box>
                ),
                enableEditing: false,
                size: 200,
            },
            {
                id: 'secondarySubjectArea',
                header: 'Secondary Subject Area',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" justifyContent={'flex-start'} flexDirection={'column'}>
                            {row.original.subjectAreas
                                .filter((area) => !area.isPrimary)
                                .map((area, index) => (
                                    <Typography color="secondary" sx={{ fontSize: 14 }} key={index}>
                                        • {area.subjectAreaName}
                                    </Typography>
                                ))}
                        </Box>
                    )
                },
                enableEditing: false,
                size: 220,
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },
            //     ],
            //     size: 400,
            // },
            {
                header: 'Files',
                size: 280,
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
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={submissionLoading}
                                        loadingPosition="start"
                                        onClick={() =>
                                            handleDownloadSubmission(row.original.paperId, row.original.title)
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
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={supplementLoading}
                                        loadingPosition="start"
                                        onClick={() => handleSupplementary(row.original.paperId, row.original.title)}
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
                                    <LoadingButton
                                        variant="text"
                                        sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                        startIcon={<DownloadOutlined />}
                                        loading={revisionLoading}
                                        loadingPosition="start"
                                        onClick={() => handleRevision(row.original.paperId, row.original.title)}
                                    >
                                        Download Revision
                                    </LoadingButton>
                                </Box>
                            )}
                        </React.Fragment>
                    )
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
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
            // {
            //     id: 'fileAndConflict',
            //     header: '',
            //     columns: [
            {
                header: 'Actions',
                Cell: ({ row }) => (
                    <React.Fragment>
                        {row.original.actions ? (
                            <React.Fragment>
                                <Box display="flex" flexDirection="column">
                                    {row.original.actions.includes('EditReview') && (
                                        <Button
                                            variant="text"
                                            sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                            startIcon={<EditOutlined />}
                                            onClick={() =>
                                                history.push(
                                                    `/conferences/${conferenceId}/track/${row.original.trackId}/paper/${row.original.paperId}/edit-reviewer-reviews/${row.original.reviewAssignmentId}`
                                                )
                                            }
                                        >
                                            Edit Review
                                        </Button>
                                    )}
                                    {row.original.actions.includes('ViewReview') && (
                                        <Button
                                            variant="text"
                                            sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                            startIcon={<AssignmentOutlined />}
                                            onClick={() =>
                                                history.push(
                                                    `/conferences/${conferenceId}/submission/${row.original.paperId}/review/${row.original.reviewAssignmentId}`
                                                )
                                            }
                                        >
                                            View Review
                                        </Button>
                                    )}
                                </Box>

                                {row.original.actions.includes('EnterReview') && (
                                    <Box display="flex" flexDirection="column">
                                        <Button
                                            variant="text"
                                            sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                            startIcon={<EditOutlined />}
                                            onClick={() =>
                                                history.push(
                                                    `/conferences/${conferenceId}/track/${row.original.trackId}/paper/${row.original.paperId}/reviewer-reviews/${row.original.reviewAssignmentId}`
                                                )
                                            }
                                        >
                                            Enter Review
                                        </Button>
                                    </Box>
                                )}
                                {row.original.actions.includes('DeleteReview') && (
                                    <Box display="flex" flexDirection="column">
                                        <Button
                                            variant="text"
                                            sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                            startIcon={<DeleteOutline />}
                                        >
                                            Delete Review
                                        </Button>
                                    </Box>
                                )}
                                {row.original.actions.includes('EnterReview') ||
                                    (row.original.actions.includes('EditReview') && (
                                        <Box display="flex" flexDirection="column">
                                            <Button
                                                variant="text"
                                                sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                                                startIcon={<EditOutlined />}
                                                onClick={() =>
                                                    history.push(
                                                        `/conferences/${conferenceId}/reviewer-conflict/${row.original.paperId}`
                                                    )
                                                }
                                            >
                                                Define Conflicts
                                            </Button>
                                        </Box>
                                    ))}
                            </React.Fragment>
                        ) : (
                            <Box display="flex" justifyContent="center" alignContent={'center'}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontSize: 14,
                                        opacity: 0.5,

                                        textAlign: 'center',
                                    }}
                                >
                                    There are currently no actions
                                </Typography>
                            </Box>
                        )}
                    </React.Fragment>
                ),
                size: 200,
                muiTableBodyCellProps: {
                    align: 'center',
                },
                enableEditing: false,
            },
            //     ],
            //     size: 600,
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    return (
        <ConferenceDetail>
            <Container maxWidth="xl">
                <Box mb={2}>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography sx={{ fontSize: 28, fontWeight: 600 }}>Reviewer Console</Typography>
                            {isLoading ? (
                                <Box ml={1} maxWidth={500}>
                                    <Skeleton variant="text" sx={{ my: 1 }} />
                                    <Skeleton variant="text" sx={{ my: 1 }} />
                                    <Skeleton variant="text" sx={{ my: 1 }} />
                                    <Skeleton variant="text" sx={{ my: 1 }} />
                                    <Skeleton variant="text" sx={{ my: 1 }} />
                                </Box>
                            ) : (
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
                                    <ListItemForID
                                        itemName="Reviewer"
                                        itemWidth={1.5}
                                        valueWidth={10.5}
                                        outerStyle={{ boxShadow: 'none', my: 1 }}
                                    >
                                        <strong>
                                            {data?.reviewer?.reviewerNamePrefix
                                                ? data?.reviewer?.reviewerNamePrefix
                                                : ''}{' '}
                                            {data?.reviewer?.reviewerFullName}
                                        </strong>{' '}
                                        {data?.reviewer && '(' + data?.reviewer?.reviewerEmail + ')'}
                                    </ListItemForID>
                                    <ListItemForID
                                        itemName="Assigned review"
                                        itemWidth={1.5}
                                        valueWidth={10.5}
                                        outerStyle={{ boxShadow: 'none', my: 1 }}
                                    >
                                        {data?.allCount === 0 ? (
                                            <Typography sx={{ fontStyle: 'italic' }}>Has not assign review</Typography>
                                        ) : (
                                            <>
                                                {data?.reviewedCount}/{data?.allCount}
                                            </>
                                        )}
                                    </ListItemForID>

                                    <ListItemPopupInfo
                                        itemName="Quota"
                                        value={
                                            data?.reviewer?.reviewerDomainConflicts
                                                ? data?.reviewer?.reviewerDomainConflicts
                                                : ''
                                        }
                                        itemWidth={1.5}
                                        valueWidth={10.5}
                                        outerStyle={{ boxShadow: 'none', my: 1 }}
                                    />
                                </Box>
                            )}

                            <SyncComponent setSync={() => refetch()} buttonStyle={{ ml: 0, mt: 1 }} />
                        </Grid>
                        {/* <Grid item xs={4} md={4} lg={4}> */}
                        {/* <Typography color="primary" sx={{ fontSize: 18, fontWeight: 600 }}>
                                Conference Phases
                            </Typography>
                            <PhaseTable phase={phase} /> */}
                        {/* </Grid> */}
                    </Grid>
                </Box>
                {/* <TableData
                    columns={columns}
                    tableData={tableData}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    totalCount={data?.totalCount}
                    setPagination={setPagination}
                    pagination={pagination}
                    setGlobalFilter={setGlobalFilter}
                    setSorting={setSorting}
                    sorting={sorting}
                /> */}
                <TabContext value={index}>
                    <TabList onChange={changeIndexHandler} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab
                            label={`All Submissions (${data?.allCount})`}
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
                            label={`Reviewed Submissions (${data?.reviewedCount})`}
                            value={'1'}
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
                        <TableData
                            columns={columns}
                            tableData={tableData}
                            isFetching={isFetching}
                            isLoading={isLoading}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            reviewedCount={data?.reviewedCount}
                            pagination={pagination}
                            setGlobalFilter={setGlobalFilter}
                            setSorting={setSorting}
                            sorting={sorting}
                        />
                    </TabPanel>
                    <TabPanel value={'1'} sx={{ p: 0, pt: 2 }}>
                        <TableData
                            columns={columns}
                            tableData={tableData}
                            isFetching={isFetching}
                            isLoading={isLoading}
                            totalCount={data?.totalCount}
                            setPagination={setPagination}
                            reviewedCount={data?.reviewedCount}
                            pagination={pagination}
                            setGlobalFilter={setGlobalFilter}
                            setSorting={setSorting}
                            sorting={sorting}
                        />
                    </TabPanel>
                </TabContext>
            </Container>
        </ConferenceDetail>
    )
}

export default ReviewerConsole
