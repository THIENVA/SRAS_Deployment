import React, { useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Box, Button, Container, Grid, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import TitleSection from './TitleSection'

import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const AuthorViewReview = () => {
    const history = useHistory()
    const [generalInfo, setGeneralInfo] = useState(null)
    const { getAuthorReviewers } = usePaperSubmission()
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
        const signal = controller.signal

        setLoading(true)
        if (submissionId) {
            getAuthorReviewers(submissionId, signal)
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
                                        <Typography sx={{ fontWeight: 'bold' }}>Reviewer #{index + 1}</Typography>
                                    </Box>
                                </TitleSection>
                                <Box ml={1}>
                                    <Typography mb={1} sx={{ fontSize: 18, fontWeight: 'bold' }}>
                                        Reviewer Reviews
                                    </Typography>
                                    {reviewer.totalScore ? (
                                        <React.Fragment>
                                            <Box mb={1} display="flex" alignItems={'center'}>
                                                <Typography sx={{ fontSize: 14 }}>
                                                    Average Evaluation score (Average Score of Above Criteria):
                                                </Typography>
                                                {reviewer.totalScore && (
                                                    <Typography sx={{ fontSize: 16, ml: 1 }}>
                                                        {reviewer.totalScore}/100
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Box mb={1} alignItems={'center'}>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}>
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

export default AuthorViewReview
