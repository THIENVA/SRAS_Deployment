import React, { Fragment, useEffect, useMemo, useState } from 'react'

import { cloneDeep } from 'lodash'
import MaterialReactTable from 'material-react-table'
import { useHistory } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import ConferenceDetail from '../ConferenceDetail'
import ConfirmPopup from './ConfirmPopup'

import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const EditConflictInterest = () => {
    // const showSnackbar = useSnackbar()
    const { id, conferenceId } = useParams()
    const { getSubmissionConflict, getConflictCase } = usePaperSubmission()
    const history = useHistory()
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const [isDisable, setDisable] = useState(false)
    const [tableData, setTableData] = useState([])
    const [conflicts, setConflicts] = useState([])
    const [reviewersConflicts, setReviewersConflicts] = useState([])
    const [generalInfo, setGeneralInfo] = useState({
        submissionId: '',
        submissionTitle: '',
        trackName: '',
        totalCount: 0,
    })
    const [tableLoading, setTableLoading] = useState(true)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })
    const [globalFilter, setGlobalFilter] = useState('')
    const { pageIndex, pageSize } = pagination
    const [openConfirmModal, setOpenConfirmModal] = useState(false)

    const handleOpenConfirmModal = () => {
        setDisable(true)
        setOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setDisable(false)
        setOpenConfirmModal(false)
    }

    const handleCheckChange = (row, conflictCaseId) => {
        const reviewerId = row.original.reviewerId
        const getConflictFromAll = conflicts?.find((conflict) => conflict.conflictCaseId === conflictCaseId)
        const formatConflict = {
            conflictId: getConflictFromAll.conflictCaseId,
            conflictName: getConflictFromAll.conflictCaseName,
        }

        const isReviewerIdExisted = reviewersConflicts.findIndex((item) => item.reviewerId === reviewerId)
        const updatedReviewersConflicts = cloneDeep(reviewersConflicts)
        if (isReviewerIdExisted !== -1) {
            const isConflictIdExisted = updatedReviewersConflicts[isReviewerIdExisted].conflicts.find(
                (item) => item.conflictCaseId === conflictCaseId
            )
            if (isConflictIdExisted) {
                updatedReviewersConflicts[isReviewerIdExisted].conflicts = updatedReviewersConflicts[
                    isReviewerIdExisted
                ].conflicts.filter((conflict) => conflict.conflictCaseId !== conflictCaseId)
                if (updatedReviewersConflicts[isReviewerIdExisted].conflicts.length === 0) {
                    updatedReviewersConflicts.splice(isReviewerIdExisted, 1)
                }
            } else {
                updatedReviewersConflicts[isReviewerIdExisted].conflicts.push({
                    conflictCaseId,
                    conflictName: formatConflict.conflictName,
                })
            }
        } else {
            updatedReviewersConflicts.push({
                reviewerId: reviewerId,
                conflicts: [...new Array(), { conflictCaseId, conflictName: formatConflict.conflictName }],
            })
        }
        setReviewersConflicts(updatedReviewersConflicts)
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const getAllConflicts = getConflictCase(controller.signal)
        const getSubmissionConflicts = getSubmissionConflict(
            id,
            {
                InclusionText: globalFilter === undefined ? '' : globalFilter,
                SkipCount: pageIndex * pageSize,
                MaxResultCount: pageSize,
            },
            secondController.secondSignal
        )

        Promise.all([getAllConflicts, getSubmissionConflicts])
            .then((response) => {
                const allConflicts = response[0].data
                const submissionConflicts = response[1].data
                const { submissionId, submissionTitle, trackName } = submissionConflicts
                setConflicts(allConflicts)
                setGeneralInfo({
                    submissionId,
                    submissionTitle,
                    trackName,
                    totalCount: submissionConflicts.reviewers ? submissionConflicts.reviewers.totalCount : 0,
                })
                const modifiedData = submissionConflicts.reviewers?.items
                    ? submissionConflicts.reviewers.items?.map((obj) => ({
                          reviewerId: obj.reviewerId,
                          fullName: obj.fullName,
                          firstName: obj.firstName,
                          middleName: obj.middleName,
                          lastName: obj.lastName,
                          email: obj.email,
                          organization: obj.organization,
                          conflicts: obj.conflicts ? obj.conflicts : [],
                      }))
                    : []

                if (submissionConflicts.reviewers?.items) {
                    const formatConflicts = submissionConflicts.reviewers.items.map((reviewer) => {
                        if (reviewer.conflicts) {
                            const getReviewerConflicts = reviewer.conflicts.map((item) => ({
                                conflictCaseId: item.conflictId,
                                conflictName: item.conflictName,
                            }))
                            return {
                                reviewerId: reviewer.reviewerId,
                                conflicts: getReviewerConflicts,
                            }
                        }
                    })
                    const filterUndefine = formatConflicts.filter((item) => item !== undefined)
                    setReviewersConflicts(cloneDeep(filterUndefine))
                }

                if (modifiedData.length === 0) {
                    history.push(`/conferences/${conferenceId}/submission-summary/${submissionId}`)
                }
                setTableData(modifiedData)
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setTableLoading(false)
            })

        return () => {
            controller.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, globalFilter])

    // console.log(reviewersConflicts)

    const columns = useMemo(
        () => [
            {
                id: 'fullName',
                header: 'Full Name',
                size: 180,
                Cell: ({ row }) => (
                    <Typography sx={{ fontSize: 14 }}>
                        {row.original.firstName} {row.original.middleName ? row.original.middleName : ''}{' '}
                        {row.original.lastName}
                    </Typography>
                ),
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 220,
            },
            {
                accessorKey: 'organization',
                header: 'Organization',
                size: 200,
            },
            {
                header: 'Selected Conflicts',
                Cell: ({ row }) => {
                    return (
                        <Fragment>
                            {reviewersConflicts.length === 0 ? (
                                <Typography>No</Typography>
                            ) : reviewersConflicts.find((item) => item.reviewerId === row.original.reviewerId) ? (
                                <Typography>Yes</Typography>
                            ) : (
                                <Typography>No</Typography>
                            )}
                        </Fragment>
                    )
                },
                size: 200,
            },
            {
                accessorKey: 'conflicts',
                header: 'Conflicts',
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ row }) => {
                    return (
                        <Fragment>
                            {reviewersConflicts.flatMap((reviewer) => {
                                if (reviewer.reviewerId === row.original.reviewerId)
                                    return reviewer.conflicts.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                                        >
                                            <Typography>• {item.conflictName}</Typography>
                                        </Box>
                                    ))
                            })}
                        </Fragment>
                    )
                },
                size: 280,
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reviewersConflicts]
    )

    return (
        <ConferenceDetail>
            {openConfirmModal && (
                <ConfirmPopup
                    open={openConfirmModal}
                    handleClose={handleCloseConfirmModal}
                    generalInfo={generalInfo}
                    reviewersConflicts={reviewersConflicts}
                />
            )}
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={1}>
                    <Grid container>
                        <Grid item xs={6} md={6} lg={6}>
                            <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                                Submission Conflicts of Interest
                            </Typography>
                            {tableLoading ? (
                                <Box maxWidth={500}>
                                    <Skeleton />
                                    <Skeleton />
                                    <Skeleton />
                                </Box>
                            ) : (
                                <Fragment>
                                    <ListItemForID
                                        itemName="Paper ID"
                                        itemWidth={2}
                                        valueWidth={10}
                                        outerStyle={{ boxShadow: 'none' }}
                                    >
                                        <IDField id={generalInfo?.submissionId} showButton={true} />
                                    </ListItemForID>
                                    <ListItemPopupInfo
                                        itemName="Paper title"
                                        value={generalInfo.submissionTitle}
                                        itemWidth={2}
                                        valueWidth={10}
                                        outerStyle={{ boxShadow: 'none' }}
                                    />
                                    <ListItemPopupInfo
                                        itemName="Track name"
                                        value={generalInfo.trackName}
                                        itemWidth={2}
                                        valueWidth={10}
                                        outerStyle={{ boxShadow: 'none' }}
                                    />
                                </Fragment>
                            )}
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
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
                                    The SRASS system mandates authors to disclose conflicts of interest between their
                                    submissions and conference reviewers. Thoroughly listing all conflicts is crucial
                                    for research paper integrity. While potential conflicts are flagged, authors must
                                    review, modify if necessary, and confirm the list to safeguard research integrity.
                                    Your confirmation is ESSENTIAL.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <MaterialReactTable
                    columns={columns}
                    data={tableData}
                    enableColumnFilterModes
                    enablePinning
                    enableColumnResizing
                    enableStickyHeader
                    positionToolbarAlertBanner="bottom"
                    enableRowActions
                    positionActionsColumn="last"
                    rowCount={generalInfo.totalCount}
                    renderTopToolbarCustomActions={() => {
                        return (
                            <React.Fragment>
                                <Typography sx={{ m: 2, fontSize: 16, fontWeight: 'bold' }}>
                                    {generalInfo?.totalCount && <>{generalInfo?.totalCount} reviews in total</>}
                                </Typography>
                            </React.Fragment>
                        )
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
                    muiTableBodyProps={{
                        sx: () => ({
                            '& tr:nth-of-type(odd)': {
                                backgroundColor: AppStyles.colors['#F7FCFF'],
                            },
                        }),
                    }}
                    manualPagination
                    onPaginationChange={setPagination}
                    state={{ pagination, isLoading: tableLoading }}
                    onGlobalFilterChange={setGlobalFilter}
                    renderRowActionMenuItems={({ closeMenu, row }) => [
                        <Box key={1}>
                            {conflicts.map((value, index) => (
                                <Box
                                    key={index}
                                    sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                                >
                                    <Checkbox
                                        size="medium"
                                        name="isCorrect"
                                        onChange={() => handleCheckChange(row, value.conflictCaseId, closeMenu)}
                                        checked={reviewersConflicts.some((item) => {
                                            if (item.reviewerId !== row.original.reviewerId) return false
                                            else {
                                                const isConflictId = item.conflicts.find(
                                                    (conflict) => conflict.conflictCaseId === value.conflictCaseId
                                                )
                                                if (isConflictId) return true
                                                else return false
                                            }
                                        })}
                                    />
                                    <Typography>{value.conflictCaseName}</Typography>
                                </Box>
                            ))}
                        </Box>,
                    ]}
                />
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
                            variant="contained"
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            onClick={() =>
                                roleName === ROLES_NAME.AUTHOR
                                    ? history.push(`/conferences/${conferenceId}/submission/author`)
                                    : history.push(`/conferences/${conferenceId}/submission/submission-console`)
                            }
                        >
                            Go Back
                        </Button>
                    </Box>
                    <Box ml={4}>
                        <LoadingButton
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            variant="contained"
                            // onClick={handleSubmitConflict}
                            onClick={() => handleOpenConfirmModal()}
                            disabled={isDisable}
                            loading={isDisable}
                            loadingPosition="start"
                            startIcon={<Save />}
                        >
                            Save Changes
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </ConferenceDetail>
    )
}

export default EditConflictInterest
