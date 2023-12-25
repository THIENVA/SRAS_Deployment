import React, { useEffect, useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { useHistory, useParams } from 'react-router-dom'

import { DownloadOutlined, EditOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Divider, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import ReviewChecklistCriteria from './ReviewChecklistCriteria'
import SectionLayout from './SectionLayout'
import TitleSection from './TitleSection'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ReviewerViewReview = () => {
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const { getReviewReviewers } = usePaperSubmission()
    const [reviewers, setReviewers] = useState([])
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId, submissionId, reviewAssignmentId } = useParams()
    const handleGoBack = () => {
        if (roleName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else if (roleName === ROLES_NAME.REVIEWER) {
            history.push(`/conferences/${conferenceId}/submission/reviewer`)
        } else {
            history.push(`/conferences/${conferenceId}/submission/submission-console`)
        }
    }
    const handleDownloadReview = (reviewAssignmentId, index) => {
        setButtonLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${reviewAssignmentId}/download-review-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `Review #${index + 1}.zip`)
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
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        setLoading(true)

        getReviewReviewers(submissionId, reviewAssignmentId, signal)
            .then((response) => {
                const data = response.data
                setGeneralInfo(data)
                setReviewers(data.reviews ? data.reviews : [])
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography fontWeight={600} mt={3} variant="h5" mb={2}>
                    View Reviews
                </Typography>
                {loading ? (
                    <Box maxWidth={500}>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </Box>
                ) : (
                    <Grid container columnSpacing={2}>
                        <Grid item lg={3}>
                            <Typography fontWeight={700}>Paper ID</Typography>
                            <Typography fontWeight={700}>Paper title</Typography>
                            <Typography fontWeight={700}>Track name</Typography>
                        </Grid>
                        <Grid item lg={9}>
                            <IDField id={generalInfo?.paperId} showButton={true} />
                            <Typography>{generalInfo?.paperTitle}</Typography>
                            <Typography>{generalInfo?.trackName}</Typography>
                        </Grid>
                    </Grid>
                )}
                {loading ? (
                    <Loading height="80vh" />
                ) : (
                    <React.Fragment>
                        {reviewers.map((reviewer, index) => (
                            <Box key={index}>
                                <TitleSection>
                                    <Box display="flex" alignItems={'center'}>
                                        <Typography sx={{ fontWeight: 'bold' }}>
                                            My Review{' '}
                                            {/* {roleName !== ROLES_NAME.AUTHOR &&
                                                '(' +
                                                    (reviewer.namePrefix ? reviewer.namePrefix + ' ' : '') +
                                                    reviewer.firstName +
                                                    ' ' +
                                                    (reviewer.middleName ? reviewer.middleName : '') +
                                                    ' ' +
                                                    reviewer.lastName +
                                                    ')'} */}
                                        </Typography>
                                        {reviewer.totalScore && (
                                            <React.Fragment>
                                                {roleName === ROLES_NAME.REVIEWER && (
                                                    <React.Fragment>
                                                        <Box display="flex" justifyContent="center" ml={2}>
                                                            <Divider
                                                                orientation="vertical"
                                                                sx={{
                                                                    height: 30,
                                                                    backgroundColor: AppStyles.colors['#555'],
                                                                    opacity: 0.5,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                        </Box>
                                                        <Button
                                                            variant="text"
                                                            sx={{
                                                                color: AppStyles.colors['#027A9D'],
                                                                textTransform: 'none',
                                                            }}
                                                            startIcon={<EditOutlined />}
                                                            onClick={() =>
                                                                history.push(
                                                                    `/conferences/${conferenceId}/paper/${generalInfo.paperId}/edit-reviewer-reviews/${reviewer.review}`
                                                                )
                                                            }
                                                        >
                                                            Edit Review
                                                        </Button>
                                                    </React.Fragment>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </Box>
                                </TitleSection>
                                <Box ml={1}>
                                    {/* <Typography mb={1} sx={{ fontSize: 18, fontWeight: 'bold' }}>
                                        Reviewer Reviews
                                    </Typography> */}
                                    {reviewer.totalScore ? (
                                        <React.Fragment>
                                            <SectionLayout title={'Research Paper Review Criteria'}>
                                                <Box ml={2}>
                                                    {reviewer.reviewCriteriaResult !== null && (
                                                        <ReviewChecklistCriteria
                                                            criteria={JSON.parse(reviewer.reviewCriteriaResult)}
                                                        />
                                                    )}
                                                </Box>
                                                <Box mb={1} ml={2} display="flex" alignItems={'center'}>
                                                    <Typography
                                                        sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}
                                                    >
                                                        Total Score:
                                                    </Typography>
                                                    {reviewer.totalScore && (
                                                        <Typography sx={{ fontSize: 16 }}>
                                                            <strong>{reviewer.totalScore}</strong>/100
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </SectionLayout>

                                            <SectionLayout title={'Details Research Paper Review Criteria'}>
                                                <Box ml={2} display="flex" alignItems={'center'} mb={1}>
                                                    <Typography
                                                        sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 100 }}
                                                    >
                                                        Review File:
                                                    </Typography>
                                                    {reviewer.totalScore && (
                                                        <LoadingButton
                                                            size="small"
                                                            variant="text"
                                                            sx={{
                                                                color: AppStyles.colors['#027A9D'],
                                                                textTransform: 'none',
                                                            }}
                                                            startIcon={<DownloadOutlined />}
                                                            loading={buttonLoading}
                                                            loadingPosition="start"
                                                            onClick={() => handleDownloadReview(reviewer.review, index)}
                                                        >
                                                            Download Review File
                                                        </LoadingButton>
                                                    )}
                                                </Box>
                                                <Box ml={2} mb={1} alignItems={'center'}>
                                                    <Typography
                                                        sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}
                                                    >
                                                        Suggestions for Chair:
                                                    </Typography>
                                                    {reviewer.suggestionsForChair && (
                                                        <Box
                                                            sx={{
                                                                mt: 1,
                                                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                                                border: '1px solid rgba(0, 0, 0, 0.15)',
                                                                p: 1,
                                                                borderRadius: 1,
                                                                maxWidth: 600,
                                                            }}
                                                        >
                                                            <Typography
                                                                component={'pre'}
                                                                sx={{
                                                                    fontSize: 14,
                                                                    color: AppStyles.colors['#586380'],
                                                                    whiteSpace: 'pre-wrap',
                                                                    fontFamily: 'monospace',
                                                                }}
                                                            >
                                                                {reviewer.suggestionsForChair}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                                <Box ml={2} mb={1} alignItems={'center'}>
                                                    <Typography
                                                        sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}
                                                    >
                                                        Comments for Authors:
                                                    </Typography>
                                                    {reviewer.commentsForAuthors && (
                                                        <Box
                                                            sx={{
                                                                mt: 1,
                                                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                                                border: '1px solid rgba(0, 0, 0, 0.15)',
                                                                p: 1,
                                                                borderRadius: 1,
                                                                maxWidth: 600,
                                                            }}
                                                        >
                                                            <Typography
                                                                component={'pre'}
                                                                sx={{
                                                                    fontSize: 14,
                                                                    color: AppStyles.colors['#586380'],
                                                                    whiteSpace: 'pre-wrap',
                                                                    fontFamily: 'monospace',
                                                                }}
                                                            >
                                                                {reviewer.commentsForAuthors}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </SectionLayout>
                                        </React.Fragment>
                                    ) : (
                                        <Typography sx={{ fontStyle: 'italic' }}>Reviewer has not review.</Typography>
                                    )}
                                </Box>
                            </Box>
                        ))}
                        <Box
                            sx={{
                                mt: 4,
                                px: 2,
                                py: 2,
                                boxShadow: 'inset 0 -1px 0 #edeeef',
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                display: 'flex',
                            }}
                        >
                            <Box ml={6}>
                                <Button
                                    color="error"
                                    variant="contained"
                                    sx={{ textTransform: 'none', height: 36 }}
                                    onClick={() => handleGoBack()}
                                >
                                    Go Back
                                </Button>
                            </Box>
                        </Box>
                    </React.Fragment>
                )}
            </Container>
        </ConferenceDetail>
    )
}

export default ReviewerViewReview
