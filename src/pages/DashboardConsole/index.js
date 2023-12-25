import React, { useEffect, useMemo, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { AssignmentTurnedIn } from '@mui/icons-material'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, FormControlLabel, Skeleton, Switch, Tab, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'

import ConferenceDetail from '../ConferenceDetail'
import ConfirmPopup from './ConfirmPopup'
import TableReview from './TableReview'
import ListItem from './UserInfoModal/ListItem'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useEditReviewerAssignmentMutation } from '~/api/common/RTKQuery/TrackChairConsole'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const DashboardConsole = () => {
    const tableFontSize = 12
    const history = useHistory()
    const { id, conferenceId } = useParams()

    const [isChecked, setCheck] = useState(false)

    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { getReviewerAssignment, getTotalNumberOfReviewer } = usePaperSubmission()
    const [editReviewerAssignment] = useEditReviewerAssignmentMutation()
    const [reviewers, setReviewers] = useState([])
    const [loading, setLoading] = useState(true)
    const [isDisabled, setDisable] = useState(false)
    const [reviewersData, setReviewersData] = useState([])
    const [dashboardData, setDashBoardData] = useState({})
    const [specialRelevance, setSpecialRelevance] = useState([])
    const [firstTime, setFirstTime] = useState(true)
    const [checkInfo, setCheckInfo] = useState({ event: null, row: {} })
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 15,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const { pageIndex, pageSize } = pagination
    const [totalCount, setTotalCount] = useState(0)
    const [index, setIndex] = useState('0')
    const changeIndexHandler = (_, value) => {
        setIndex(value)
        setGlobalFilter('')
    }
    const showSnackbar = useSnackbar()
    const [unique, setUnique] = useState(uuid())
    const [countReviewer, setCountReviewer] = useState({ all: 0, assigned: 0 })
    const [openConfirm, setOpenConfirm] = useState(false)

    const handleOpenConfirm = (event, row) => {
        setOpenConfirm(true)
        setCheckInfo((prev) => ({ ...prev, event: event, row: row }))
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
        setCheckInfo((prev) => ({ ...prev, event: null, row: {} }))
    }

    const handleCheckChange = (event, row) => {
        const index = row.index
        const updatedTableData = cloneDeep(reviewersData)
        updatedTableData[index].isAssigned = event
        const reviewerId = updatedTableData[index].reviewerId
        if (reviewers.length === 0) {
            setReviewers((prev) => [...prev, { reviewerId, isAssigned: event }])
        } else {
            const position = reviewers.findIndex((reviewer) => reviewer.reviewerId === reviewerId)
            if (position === -1) {
                setReviewers((prev) => [...prev, { reviewerId, isAssigned: event }])
            } else {
                const updatedReviewers = cloneDeep(reviewers)
                updatedReviewers[position].isAssigned = !updatedReviewers[position].isAssigned
                setReviewers(updatedReviewers)
            }
        }
        setReviewersData(updatedTableData)
    }

    const assignReviewers = () => {
        if (reviewers.length !== 0) {
            setDisable(true)
            editReviewerAssignment({ paperId: id, data: reviewers })
                .then(() => {
                    setIndex('1')
                    setGlobalFilter('')
                    setUnique(uuid())
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
                .finally(() => {
                    setDisable(false)
                })
        } else {
            setIndex('1')
        }
    }
    const handleCheck = (event) => {
        setCheck(event.target.checked)
    }

    useEffect(() => {
        const controller = new AbortController()
        if (id) {
            setLoading(true)
            const params = {
                InclusionText: globalFilter === undefined ? '' : globalFilter,
                SkipCount: pageIndex * pageSize,
                MaxResultCount: pageSize,
                IsAssigned: index === '1' ? true : '',
                isDomainConflictsIncluded: isChecked,
            }
            getReviewerAssignment(id, params, controller.signal)
                .then((response) => {
                    const data = response.data
                    if (firstTime) {
                        if (data.reviewers) {
                            const hasAssignedYet = data.reviewers.items.some((reviewer) => reviewer.isAssigned === true)
                            if (!hasAssignedYet) {
                                const getReviewers = data.reviewers.items.slice(0, 3)
                                const formatReviewers = getReviewers.map((reviewer) => {
                                    if (reviewer.isAssigned === false) {
                                        return { reviewerId: reviewer.reviewerId, isAssigned: true }
                                    } else {
                                        return { reviewerId: reviewer.reviewerId, isAssigned: reviewer.isAssigned }
                                    }
                                })
                                setReviewers(cloneDeep(formatReviewers))
                            }
                        }
                    }
                    const uniqueRelevance = new Set()
                    if (data.reviewers?.items) {
                        data.reviewers?.items.forEach((item) => {
                            if (item.relevance !== 0) {
                                if (uniqueRelevance.size < 2) {
                                    uniqueRelevance.add(item.relevance)
                                }
                            }
                        })
                    }
                    const setToArray = Array.from(uniqueRelevance)
                    setSpecialRelevance(setToArray)
                    setReviewersData(data.reviewers ? data.reviewers?.items : [])
                    setTotalCount(data.reviewers ? data.reviewers?.totalCount : 0)
                    setDashBoardData(data)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later.',
                    })
                })
                .finally(() => {
                    setLoading(false)
                    setFirstTime(false)
                })
        }

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, globalFilter, index, isChecked])

    useEffect(() => {
        const controller = new AbortController()
        getTotalNumberOfReviewer(id, controller.signal)
            .then((response) => {
                setCountReviewer({
                    all: response.data.numberOfReviewers,
                    assigned: response.data.numberOfAssignedReviewers,
                })
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later.',
                })
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unique])

    const columns = useMemo(
        () => [
            {
                id: 'reviewer',
                header: 'Reviewer',
                size: 260,
                Cell: ({ row }) => (
                    <Box>
                        <Box display={'flex'} alignItems={'center'}>
                            <Typography textAlign="left" sx={{ fontSize: 14 }}>
                                <strong>{row.original.fullName}</strong>
                            </Typography>
                        </Box>
                        <Typography textAlign="left" sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}>
                            <b>Email:</b> {row.original.email}
                        </Typography>
                        <Typography textAlign="left" sx={{ fontSize: 12, color: AppStyles.colors['#0D1B3EB3'] }}>
                            <b>Organization:</b> {row.original.organization}
                        </Typography>
                    </Box>
                ),
            },

            {
                accessorKey: 'reviewerConflicts',
                header: 'Reviewer Conflicts',
                Cell: ({ row }) => {
                    return (
                        <React.Fragment>
                            {row.original.reviewerConflicts?.map((value, index) => (
                                <Box
                                    key={index}
                                    sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                                >
                                    <Typography sx={{ fontSize: tableFontSize }}>• {value} </Typography>
                                </Box>
                            ))}
                        </React.Fragment>
                    )
                },
                size: 215,
                muiTableHeadCellProps: {
                    align: 'center',
                },
            },
            {
                accessorKey: 'submissionConflicts',
                header: 'Submission Conflicts',
                Cell: ({ row }) => {
                    return (
                        <React.Fragment>
                            {row.original.submissionConflicts?.map((value, index) => (
                                <Box
                                    key={index}
                                    sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                                >
                                    <Typography sx={{ fontSize: tableFontSize }}>• {value} </Typography>
                                </Box>
                            ))}
                        </React.Fragment>
                    )
                },
                muiTableHeadCellProps: {
                    align: 'center',
                },
                size: 200,
            },

            {
                id: 'primarySubjectArea',
                header: 'Primary Subject Area',
                accessorKey: 'subjectAreas',
                Cell: ({ row }) => (
                    <Box display="flex" flexDirection={'column'}>
                        {row.original.reviewerSubjectAreas
                            ?.filter((area) => area.isPrimary)
                            .map((area, index) => (
                                <Typography sx={{ fontSize: tableFontSize }} color="primary" key={index}>
                                    {area.subjectAreaName}
                                </Typography>
                            ))}
                    </Box>
                ),
                enableEditing: false,
                size: 200,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'secondarySubjectArea',
                header: 'Secondary Subject Area',
                accessorKey: 'subjectAreas',
                Cell: ({ row }) => {
                    return (
                        <Box display="flex" flexDirection={'column'}>
                            {row.original.reviewerSubjectAreas
                                ?.filter((area) => !area.isPrimary)
                                .map((area, index) => (
                                    <Typography sx={{ fontSize: tableFontSize }} color="secondary" key={index}>
                                        • {area.subjectAreaName}
                                    </Typography>
                                ))}
                        </Box>
                    )
                },
                enableEditing: false,
                size: 220,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
            },

            {
                accessorKey: 'quota',
                header: 'Quota',
                size: 130,
            },
            {
                accessorKey: 'isReviewComplete',
                header: 'Review Completed?',
                Cell: ({ row }) => {
                    return (
                        <Typography sx={{ fontSize: 14 }}>
                            {row.original.isReviewComplete === true ? 'Yes' : 'No'}
                        </Typography>
                    )
                },
                size: 225,
            },
            {
                accessorKey: 'numberOfAssignments',
                header: 'Number Of Assignments',
                size: 180,
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: AppStyles.colors['#027A9D'],
                            ':hover': {
                                textDecoration: 'underline',
                            },
                            cursor: 'pointer',
                            fontSize: 14,
                        }}
                        onClick={() => history.push(`/conferences/${conferenceId}/manage-reviewers`)}
                    >
                        {row.original.numberOfAssignments ? row.original.numberOfAssignments : 0}
                    </Typography>
                ),
            },
            {
                accessorKey: 'relevance',
                header: 'Relevance',
                size: 160,
                Cell: ({ row }) => (
                    <Typography
                        sx={{
                            fontSize: 14,
                            color:
                                specialRelevance.includes(row.original.relevance) &&
                                specialRelevance[0] === row.original.relevance
                                    ? AppStyles.colors['#004DFF']
                                    : specialRelevance.length === 2 &&
                                      specialRelevance.includes(row.original.relevance) &&
                                      specialRelevance[1] === row.original.relevance
                                    ? '#9c27b0'
                                    : '#333',
                        }}
                        key={index}
                    >
                        {row.original.relevance !== null ? row.original.relevance : ''}
                    </Typography>
                ),
            },
            //     ],
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [specialRelevance]
    )

    return (
        <ConferenceDetail>
            {openConfirm && (
                <ConfirmPopup
                    open={openConfirm}
                    checkInfo={checkInfo}
                    handleClose={handleCloseConfirm}
                    handleCheckChange={handleCheckChange}
                />
            )}
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Reviewer Assignment Console
                    </Typography>
                    {loading ? (
                        <Box maxWidth={500}>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            {dashboardData?.submissionSubjectAreas?.filter((area) => area.isPrimary) && <Skeleton />}
                            {dashboardData?.submissionSubjectAreas?.filter((area) => !area.isPrimary) && <Skeleton />}
                        </Box>
                    ) : (
                        <React.Fragment>
                            <ListItem
                                itemName="Track name"
                                value={dashboardData.trackName}
                                itemWidth={2}
                                valueWidth={10}
                                outerStyle={{ boxShadow: 'none' }}
                            />
                            <ListItemForID
                                itemName="Paper ID"
                                itemWidth={2}
                                valueWidth={10}
                                outerStyle={{ boxShadow: 'none' }}
                            >
                                <IDField id={dashboardData?.paperId} showButton={true} />
                            </ListItemForID>
                            <ListItem
                                itemName="Paper title"
                                value={dashboardData.title}
                                itemWidth={2}
                                valueWidth={10}
                                outerStyle={{ boxShadow: 'none' }}
                            />

                            {dashboardData?.submissionSubjectAreas?.filter((area) => area.isPrimary) && (
                                <ListItem
                                    itemName="Primary subject area"
                                    value={dashboardData.submissionSubjectAreas
                                        ?.filter((area) => area.isPrimary)
                                        .map((area) => `${area.subjectAreaName} `)}
                                    itemWidth={2}
                                    valueWidth={10}
                                    outerStyle={{ boxShadow: 'none' }}
                                />
                            )}
                            {dashboardData?.submissionSubjectAreas?.filter((area) => !area.isPrimary) && (
                                <ListItem
                                    itemName="Secondary subject area"
                                    value={dashboardData.submissionSubjectAreas
                                        ?.filter((area) => !area.isPrimary)
                                        .map((area, index, array) => {
                                            if (index === array.length - 1) {
                                                return area.subjectAreaName
                                            } else {
                                                return `${area.subjectAreaName}, `
                                            }
                                        })}
                                    itemWidth={2}
                                    valueWidth={10}
                                    outerStyle={{ boxShadow: 'none' }}
                                />
                            )}
                        </React.Fragment>
                    )}
                </Box>
                <FormControlLabel
                    control={<Switch checked={isChecked} onChange={handleCheck} />}
                    label="Domain Conflict Included"
                />
                <TabContext value={index}>
                    <TabList onChange={changeIndexHandler} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tab
                            label={`All Reviewer (${countReviewer.all})`}
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
                            label={`Assigned Reviewers (${countReviewer.assigned})`}
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
                        <TableReview
                            handleOpenConfirm={handleOpenConfirm}
                            columns={columns}
                            handleCheckChange={handleCheckChange}
                            isDisabled={isDisabled}
                            loading={loading}
                            pagination={pagination}
                            reviewersData={reviewersData}
                            setGlobalFilter={setGlobalFilter}
                            setPagination={setPagination}
                            totalCount={totalCount}
                            reviewers={reviewers}
                        />
                    </TabPanel>
                    <TabPanel value={'1'} sx={{ p: 0, pt: 2 }}>
                        <TableReview
                            handleOpenConfirm={handleOpenConfirm}
                            columns={columns}
                            handleCheckChange={handleCheckChange}
                            isDisabled={isDisabled}
                            loading={loading}
                            pagination={pagination}
                            reviewersData={reviewersData}
                            setGlobalFilter={setGlobalFilter}
                            setPagination={setPagination}
                            totalCount={totalCount}
                            reviewers={reviewers}
                        />
                    </TabPanel>
                </TabContext>

                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 2,
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        display: 'flex',
                    }}
                >
                    <Box ml={6}>
                        <Button
                            color="error"
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            variant="contained"
                            onClick={() => history.goBack()}
                        >
                            Back to {roleName} Console
                        </Button>
                        <LoadingButton
                            startIcon={<AssignmentTurnedIn />}
                            loadingPosition="start"
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold', ml: 2 }}
                            variant="contained"
                            onClick={assignReviewers}
                            loading={isDisabled}
                            disabled={isDisabled}
                        >
                            Assign
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </ConferenceDetail>
    )
}

export default DashboardConsole
