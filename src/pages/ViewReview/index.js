import React, { useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { EditOutlined } from '@mui/icons-material'
import { Box, Button, Container, Divider, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import ReviewChecklistCriteria from './ReviewChecklistCriteria'
import SectionLayout from './SectionLayout'
import TitleSection from './TitleSection'

import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ViewReview = () => {
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const { getReview } = usePaperSubmission()
    const [reviewers, setReviewers] = useState([])
    const [loading, setLoading] = useState(true)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId, submissionId } = useParams()
    const handleGoBack = () => {
        if (roleName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else if (roleName === ROLES_NAME.REVIEWER) {
            history.push(`/conferences/${conferenceId}/submission/reviewer`)
        } else {
            history.push(`/conferences/${conferenceId}/submission/submission-console`)
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        setLoading(true)

        if (submissionId) {
            getReview(submissionId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setGeneralInfo(data)
                    setReviewers(data.reviews ? data.reviews : [])
                })
                .catch(() => {})
                .finally(() => {
                    setLoading(false)
                })

            return () => {
                controller.abort()
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submissionId])
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
                                            Reviewer #{index + 1}{' '}
                                            {roleName !== ROLES_NAME.AUTHOR &&
                                                '(' +
                                                    (reviewer.namePrefix ? reviewer.namePrefix + ' ' : '') +
                                                    reviewer.firstName +
                                                    ' ' +
                                                    (reviewer.middleName ? reviewer.middleName : '') +
                                                    ' ' +
                                                    reviewer.lastName +
                                                    ')'}
                                        </Typography>
                                        {reviewer.totalScore && (
                                            <React.Fragment>
                                                {(roleName === ROLES_NAME.CHAIR ||
                                                    roleName === ROLES_NAME.TRACK_CHAIR) && (
                                                    <React.Fragment>
                                                        <Box display="flex" justifyContent="center" ml={2}>
                                                            <Divider
                                                                orientation="vertical"
                                                                sx={{
                                                                    height: 30,
                                                                    backgroundColor: AppStyles.colors['#F7F7F7'],
                                                                    opacity: 0.5,
                                                                    mr: 1,
                                                                }}
                                                            />
                                                        </Box>
                                                        <Button
                                                            variant="text"
                                                            sx={{
                                                                color: AppStyles.colors['#F7F7F7'],
                                                                textTransform: 'none',
                                                            }}
                                                            startIcon={<EditOutlined />}
                                                            onClick={() =>
                                                                history.push(
                                                                    `/conferences/${conferenceId}/track/${generalInfo.trackId}/paper/${generalInfo.paperId}/edit-reviewer-reviews/${reviewer.review}`
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
                                    {reviewer.totalScore ? (
                                        <React.Fragment>
                                            <SectionLayout
                                                title={'Research Paper Review Criteria'}
                                                titleStyle={{ textTransform: 'uppercase', fontWeight: 600 }}
                                            >
                                                <Box>
                                                    {reviewer.reviewCriteriaResult !== null && (
                                                        <ReviewChecklistCriteria
                                                            criteria={
                                                                reviewer.reviewCriteriaResult
                                                                    ? JSON.parse(reviewer.reviewCriteriaResult)
                                                                    : []
                                                            }
                                                        />
                                                    )}
                                                </Box>
                                                <Box
                                                    mb={1}
                                                    display="flex"
                                                    alignItems={'center'}
                                                    justifyContent="flex-end"
                                                    mr={2}
                                                >
                                                    <Typography
                                                        align="right"
                                                        sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}
                                                    >
                                                        Average Evaluation score (Average Score of Above Criteria):
                                                    </Typography>
                                                    {reviewer.totalScore && (
                                                        <Typography ml={1} sx={{ fontSize: 16 }}>
                                                            {reviewer.totalScore}/100
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </SectionLayout>
                                            <SectionLayout
                                                title={'Details Research Paper Review Criteria'}
                                                titleStyle={{ textTransform: 'uppercase', fontWeight: 600 }}
                                            >
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
                                                                border: '1px solid #002b5d',
                                                                p: 1,
                                                                borderRadius: 1,
                                                                // maxWidth: 600,
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
                                                                border: '1px solid #002b5d',
                                                                p: 1,
                                                                borderRadius: 1,
                                                                // maxWidth: 600,
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
                                    sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
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

export default ViewReview
