import React, { useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { HowToVote } from '@mui/icons-material'
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Container, Grid, MenuItem as MenuItemMUI, Select, Skeleton, Tab, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import CheckList from './CheckList'
import ConfirmPopup from './ConfirmPopup'
import Review from './Review'
import SectionLayout from './SectionLayout'

import { useEditStatusMutation } from '~/api/common/RTKQuery/TrackChairConsole'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const PaperDecision = () => {
    const history = useHistory()
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId, submissionId } = useParams()
    const [generalInfo, setGeneralInfo] = useState({})
    const [reviewInfo, setReviewInfo] = useState({})
    const [paperStatus, setPaperStatus] = useState([])
    const { getSubmissionInfo, getPaperStatuses, getReview, getCurrentStatus } = usePaperSubmission()
    const { getDecisionChecklist } = useTrack()
    const [decideData, setDecideData] = useState({})
    const [loading, setLoading] = useState(true)
    const [loadingReview, setLoadingReview] = useState(true)
    const [isDisable, setDisable] = useState(false)
    const [isLoading, setButtonLoading] = useState(false)
    const [editStatus] = useEditStatusMutation()
    const [listChecked, setListChecked] = useState([])
    const [statusId, setStatusId] = useState('')
    const [reviewers, setReviewers] = useState([])
    const [index, setIndex] = useState('0')
    const [openConfirm, setOpenConfirm] = useState(false)
    const [currentStatus, setCurrentStatus] = useState({})

    const handleOpenConfirm = () => {
        setOpenConfirm(true)
    }

    const handleCloseConfirm = () => {
        setOpenConfirm(false)
    }
    const changeIndexHandler = (_, value) => {
        setIndex(value)
    }
    const handleChangeDecision = (event) => {
        setStatusId(event)
    }

    const handleGoBack = () => {
        if (roleName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else if (roleName === ROLES_NAME.REVIEWER) {
            history.push(`/conferences/${conferenceId}/submission/reviewer`)
        } else {
            history.push(`/conferences/${conferenceId}/submission/submission-console`)
        }
    }

    const handleSubmit = () => {
        setButtonLoading(true)
        editStatus({ paperId: submissionId, paperStatusId: statusId, checklist: listChecked })
            .then(() => {
                handleGoBack()
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later',
                // })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const secondController = new AbortController()

        setLoading(true)

        getSubmissionInfo(submissionId, signal)
            .then((response) => {
                const data = response.data
                setGeneralInfo(data)
                const decisionChecklist = getDecisionChecklist(data.trackId, secondController.signal)
                Promise.all([decisionChecklist])
                    .then((response) => {
                        const checklist = response[0].data
                        setDecideData(checklist)
                        setListChecked(checklist.decisionChecklist ? checklist.decisionChecklist : [])
                    })
                    .catch(() => {
                        // showSnackbar({
                        //     severity: 'error',
                        //     children: 'Something went wrong, cannot upload files.',
                        // })
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {})

        return () => {
            controller.abort()
            secondController.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const signal = controller.signal

        if (conferenceId) {
            getPaperStatuses(null, signal)
                .then((response) => {
                    const statusData = response.data?.map(({ statusId, statusName }) => ({
                        value: statusName,
                        text: statusName,
                        id: statusId,
                    }))
                    const filterStatus = statusData.filter(
                        (item) => item.value !== 'Awaiting Decision' && item.value !== 'Desk Reject'
                    )
                    setPaperStatus(filterStatus)
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
            secondController.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

    useEffect(() => {
        const controller = new AbortController()

        setLoadingReview(true)

        if (submissionId) {
            getReview(submissionId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setReviewInfo(data)
                    setReviewers(data.reviews ? data.reviews : [])
                    setIndex(data.reviews ? '0' : '1')
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {
                    setLoadingReview(false)
                })

            return () => {
                controller.abort()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionId])

    useEffect(() => {
        const isNotCheckAll = listChecked.some((item) => item.isChecked === false)
        const exist = paperStatus.findIndex((item) => item.id === statusId)
        if (isNotCheckAll || exist === -1) {
            setDisable(true)
        } else {
            setDisable(false)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listChecked, statusId])

    useEffect(() => {
        const controller = new AbortController()
        if (submissionId) {
            getCurrentStatus(submissionId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setStatusId(
                        data?.status !== 'Awaiting Decision' || data?.status !== 'Desk Reject' ? data?.statusId : ''
                    )

                    setCurrentStatus(data ? data : {})
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {})
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            {openConfirm && (
                <ConfirmPopup
                    open={openConfirm}
                    handleClose={handleCloseConfirm}
                    handleSubmitDecision={handleSubmit}
                    statusId={statusId}
                    currentStatus={currentStatus}
                    paperStatus={paperStatus}
                />
            )}
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5" mb={2}>
                    Paper Decision Making
                </Typography>
                {loading ? (
                    <Box maxWidth={500}>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Box>
                ) : (
                    <Grid container columnSpacing={2}>
                        <Grid item lg={2}>
                            <Typography fontWeight={700}>Paper ID</Typography>
                            <Typography fontWeight={700}>Paper title</Typography>
                            <Typography fontWeight={700}>Track name</Typography>
                        </Grid>
                        <Grid item lg={10}>
                            <IDField id={generalInfo?.submissionId} showButton={true} style={{ color: 'none' }} />
                            <Typography>{generalInfo?.title}</Typography>
                            <Typography>{generalInfo?.trackName}</Typography>
                        </Grid>
                    </Grid>
                )}
                {loading ? (
                    <Loading height="80vh" />
                ) : (
                    <React.Fragment>
                        <TabContext value={index}>
                            <TabList onChange={changeIndexHandler} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tab
                                    label={`Reviews (${reviewers.length})`}
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
                                    label={`Decision`}
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
                            <TabPanel value={'0'} sx={{ p: 0, pt: 1 }}>
                                <Review
                                    conferenceId={conferenceId}
                                    generalInfo={reviewInfo}
                                    loading={loadingReview}
                                    reviewers={reviewers}
                                    handleGoBack={handleGoBack}
                                    setIndex={setIndex}
                                />
                            </TabPanel>
                            <TabPanel value={'1'} sx={{ p: 0, pt: 1 }}>
                                <React.Fragment>
                                    <SectionLayout title="FACTORS">
                                        <Box mb={1} ml={2}>
                                            <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                                {decideData.factorsAffectingSelection
                                                    ? 'Factors Affecting Selection:'
                                                    : 'No Factors Affecting Selection'}
                                            </Typography>

                                            {decideData.factorsAffectingSelection && (
                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        backgroundColor: AppStyles.colors['#F5F5F5'],
                                                        border: '1px solid #002b5d',
                                                        p: 1,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        component={'pre'}
                                                        sx={{
                                                            fontSize: 14,
                                                            color: AppStyles.colors['#000F33'],
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {decideData.factorsAffectingSelection}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                        <Box mb={1} ml={2}>
                                            <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                                {decideData.factorsAffectingSelection
                                                    ? 'Factors Disqualifying a Research Paper Abstract:'
                                                    : 'No Factors Disqualifying a Research Paper Abstract'}
                                            </Typography>

                                            {decideData.factorsDisqualifyingPaper && (
                                                <Box
                                                    sx={{
                                                        mt: 1,
                                                        backgroundColor: AppStyles.colors['#F5F5F5'],
                                                        border: '1px solid #002b5d',
                                                        p: 1,
                                                        borderRadius: 1,
                                                    }}
                                                >
                                                    <Typography
                                                        component={'pre'}
                                                        sx={{
                                                            fontSize: 14,
                                                            color: AppStyles.colors['#000F33'],
                                                            whiteSpace: 'pre-wrap',
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {decideData.factorsDisqualifyingPaper}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </SectionLayout>
                                    <SectionLayout title="DECISION CHECKLIST">
                                        <CheckList listChecked={listChecked} setListChecked={setListChecked} />
                                    </SectionLayout>
                                    <SectionLayout title="FINAL DECISION">
                                        <Box my={1} ml={2} display="flex" alignItems={'center'}>
                                            <Typography sx={{ fontSize: 16, fontWeight: 'bold', mr: 1 }}>
                                                Decision:
                                            </Typography>

                                            <Typography sx={{ fontSize: 16, mr: 3 }}>Change paper status to</Typography>
                                            <Select
                                                variant="standard"
                                                size="small"
                                                onChange={(event) => handleChangeDecision(event.target.value)}
                                                value={statusId}
                                                sx={{ width: 180 }}
                                                style={{ textAlign: 'center' }}
                                            >
                                                {paperStatus?.map((status) => {
                                                    return (
                                                        <MenuItemMUI key={status.id} value={status.id}>
                                                            {status.text}
                                                        </MenuItemMUI>
                                                    )
                                                })}
                                            </Select>
                                        </Box>
                                    </SectionLayout>
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
                                                onClick={() => handleGoBack()}
                                            >
                                                Go Back
                                            </Button>
                                        </Box>
                                        <Box ml={4}>
                                            <LoadingButton
                                                sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                                                variant="contained"
                                                onClick={() => {
                                                    if (currentStatus.status === 'Awaiting Decision') {
                                                        handleSubmit()
                                                    } else {
                                                        handleOpenConfirm()
                                                    }
                                                }}
                                                disabled={isDisable}
                                                loading={isLoading}
                                                loadingPosition="start"
                                                startIcon={<HowToVote />}
                                            >
                                                Submit Decision
                                            </LoadingButton>
                                        </Box>
                                    </Box>
                                </React.Fragment>
                            </TabPanel>
                        </TabContext>
                    </React.Fragment>
                )}
            </Container>
        </ConferenceDetail>
    )
}

export default PaperDecision
