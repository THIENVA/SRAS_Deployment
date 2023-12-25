import { Fragment, useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import DashboardBox from '~/components/DashboardBox'
import EmptyData from '~/components/EmptyData'

import PaperStatus from './PaperStatus'
import StatisticCards from './StatisticCards'

import { useConference } from '~/api/common/conference'
import { AppStyles } from '~/constants/colors'
import Loading from '~/pages/Loading'

const Participation = () => {
    const { conferenceId } = useParams()
    const { getDashboardParticipation } = useConference()
    // const showSnackbar = useSnackbar()
    const [isLoading, setLoading] = useState(false)
    const [participation, setParticipation] = useState({})

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            setLoading(true)
            getDashboardParticipation(conferenceId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setParticipation(data)
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
        }

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Grid container sx={{ mt: 3 }}>
            {isLoading ? (
                <Grid item xs={12} md={12} lg={12}>
                    <Loading />
                </Grid>
            ) : (
                <Fragment>
                    {participation ? (
                        <Grid item xs={12} md={12} lg={12}>
                            <DashboardBox boxStyle={{ mb: 2 }} header={'OVERVIEW FIGURES'}>
                                <Box pt={1}>
                                    <StatisticCards participation={participation} />
                                </Box>
                            </DashboardBox>
                            {participation.listTrackParticipation?.map((track, index) => (
                                <Accordion
                                    sx={{
                                        backgroundColor: AppStyles.colors['#F8F9FA'],
                                        boxShadow: 'inset 0 -1px 0 #edeeef',
                                    }}
                                    key={index}
                                >
                                    <AccordionSummary
                                        sx={{ borderBottom: '0.5px solid #dbdbdb' }}
                                        expandIcon={<ExpandMore />}
                                    >
                                        <Typography>{track.trackName}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {track.submissionSubjectAreaPieChartData === null &&
                                        track.reviewerSubjectAreaPieChartData === null &&
                                        track.submissionPaperStatusPieChartData === null &&
                                        track.numberOfSubmissions === null &&
                                        track.numberOfAuthors === null &&
                                        track.numberOfReviewers === null &&
                                        track.averageNumberOfReviewerAssignmentsPerSubmission === null &&
                                        track.averageNumberOfReviewsPerSubmission === null ? (
                                            <Box m="auto" mt={4}>
                                                <EmptyData
                                                    textAbove={'No record for this track'}
                                                    textBelow={'Please setup data for this track.'}
                                                />
                                            </Box>
                                        ) : (
                                            <Fragment>
                                                <Box
                                                    mt={3}
                                                    sx={{
                                                        boxShadow:
                                                            'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                                                    }}
                                                    borderRadius={2}
                                                    py={1}
                                                >
                                                    <Grid container py={2} px={3} columnSpacing={8}>
                                                        <Grid container item xs={12} md={12} lg={4}>
                                                            <Grid item xs={10} md={10} lg={10}>
                                                                <Box>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 14,
                                                                            color: '#495057',
                                                                            fontWeight: 'bold',
                                                                            opacity: 0.8,
                                                                        }}
                                                                    >
                                                                        Authors
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 14,
                                                                            color: '#495057',
                                                                            opacity: 0.5,
                                                                        }}
                                                                    >
                                                                        Number of Authors in Track
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={2} md={2} lg={2}>
                                                                <Typography
                                                                    sx={{
                                                                        color: 'rgb(26, 115, 232)',
                                                                        fontSize: 30,
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {track.numberOfAuthors ? track.numberOfAuthors : 0}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container item xs={12} md={12} lg={4}>
                                                            <Grid item xs={10} md={10} lg={10}>
                                                                <Box>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 14,
                                                                            color: '#495057',
                                                                            fontWeight: 'bold',
                                                                            opacity: 0.8,
                                                                        }}
                                                                    >
                                                                        Submissions
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 14,
                                                                            color: '#495057',
                                                                            opacity: 0.5,
                                                                        }}
                                                                    >
                                                                        Number of Submissions in Track
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={2} md={2} lg={2}>
                                                                <Typography
                                                                    sx={{
                                                                        color: 'rgb(67, 160, 71)',
                                                                        fontSize: 30,
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {track.numberOfSubmissions
                                                                        ? track.numberOfSubmissions
                                                                        : 0}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid container item xs={12} md={12} lg={4}>
                                                            <Grid item xs={10} md={10} lg={10}>
                                                                <Box>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 14,
                                                                            color: '#495057',
                                                                            fontWeight: 'bold',
                                                                            opacity: 0.8,
                                                                        }}
                                                                    >
                                                                        Reviewers
                                                                    </Typography>
                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: 14,
                                                                            color: '#495057',
                                                                            opacity: 0.5,
                                                                        }}
                                                                    >
                                                                        Number of Reviewers in Track
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={2} md={2} lg={2}>
                                                                <Typography
                                                                    sx={{
                                                                        color: '#d92550',
                                                                        fontSize: 30,
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    {track.numberOfReviewers
                                                                        ? track.numberOfReviewers
                                                                        : 0}
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                                <DashboardBox header={'Subject Areas'} boxStyle={{ mt: 3 }}>
                                                    <Grid container sx={{ minHeight: 450 }}>
                                                        <Grid item xs={6} md={6} lg={6}>
                                                            {track.submissionSubjectAreaPieChartData ? (
                                                                <PaperStatus
                                                                    data={
                                                                        track.submissionSubjectAreaPieChartData
                                                                            ? track.submissionSubjectAreaPieChartData
                                                                            : []
                                                                    }
                                                                    text="Submission Primary Subject Areas"
                                                                />
                                                            ) : (
                                                                <Box m="auto" mt={4}>
                                                                    <EmptyData
                                                                        textAbove={'No submission'}
                                                                        textBelow={'Submission Primary Subject Areas'}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Grid>
                                                        <Grid item xs={6} md={6} lg={6}>
                                                            {track.reviewerSubjectAreaPieChartData ? (
                                                                <PaperStatus
                                                                    data={
                                                                        track.reviewerSubjectAreaPieChartData
                                                                            ? track?.reviewerSubjectAreaPieChartData
                                                                            : []
                                                                    }
                                                                    text="Reviewer Primary Subject Areas"
                                                                />
                                                            ) : (
                                                                <Box m="auto" mt={4}>
                                                                    <EmptyData
                                                                        textAbove={'No reviewer'}
                                                                        textBelow={'Reviewer Primary Subject Areas'}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </DashboardBox>
                                                <Grid container columnSpacing={4} mt={3}>
                                                    <Grid item xs={6} md={6} lg={6}>
                                                        <DashboardBox
                                                            header={'Paper Statuses'}
                                                            // boxStyle={{ minHeight: 553 }}
                                                        >
                                                            {track.submissionPaperStatusPieChartData ? (
                                                                <PaperStatus
                                                                    data={
                                                                        track?.submissionPaperStatusPieChartData
                                                                            ? track?.submissionPaperStatusPieChartData
                                                                            : []
                                                                    }
                                                                />
                                                            ) : (
                                                                <Box m="auto" mt={4}>
                                                                    <EmptyData
                                                                        textAbove={'No submission'}
                                                                        textBelow={'Submission Paper Status'}
                                                                    />
                                                                </Box>
                                                            )}
                                                        </DashboardBox>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6}>
                                                        <DashboardBox
                                                            header={'Reviews'}
                                                            outerContentStyle={{ pb: 0 }}
                                                            contentStyle={{ px: 0, py: 0 }}
                                                        >
                                                            <Grid
                                                                container
                                                                py={2}
                                                                px={3}
                                                                columnSpacing={8}
                                                                rowSpacing={2}
                                                            >
                                                                <Grid container item xs={12} md={12} lg={12}>
                                                                    <Grid item xs={10} md={10} lg={10}>
                                                                        <Box>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                    color: '#495057',
                                                                                    fontWeight: 'bold',
                                                                                    opacity: 0.8,
                                                                                }}
                                                                            >
                                                                                Average Reviewer Assignment
                                                                            </Typography>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                    color: '#495057',
                                                                                    opacity: 0.5,
                                                                                }}
                                                                            >
                                                                                Average Reviewer Assignment for each
                                                                                Submission
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={2} md={2} lg={2}>
                                                                        <Typography
                                                                            sx={{
                                                                                color: '#d92550',
                                                                                fontSize: 30,
                                                                                fontWeight: 'bold',
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            {track.averageNumberOfReviewerAssignmentsPerSubmission
                                                                                ? track.averageNumberOfReviewerAssignmentsPerSubmission
                                                                                : 0}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container item xs={12} md={12} lg={12}>
                                                                    <Grid item xs={10} md={10} lg={10}>
                                                                        <Box>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                    color: '#495057',
                                                                                    fontWeight: 'bold',
                                                                                    opacity: 0.8,
                                                                                }}
                                                                            >
                                                                                Average Number of Reviews
                                                                            </Typography>
                                                                            <Typography
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                    color: '#495057',
                                                                                    opacity: 0.5,
                                                                                }}
                                                                            >
                                                                                Average Number of Reviews for each
                                                                                Submission
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={2} md={2} lg={2}>
                                                                        <Typography
                                                                            sx={{
                                                                                color: '#f7b924',
                                                                                fontSize: 30,
                                                                                fontWeight: 'bold',
                                                                                textAlign: 'center',
                                                                            }}
                                                                        >
                                                                            {track.averageNumberOfReviewsPerSubmission
                                                                                ? track.averageNumberOfReviewsPerSubmission
                                                                                : 0}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </DashboardBox>
                                                    </Grid>
                                                </Grid>
                                            </Fragment>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Grid>
                    ) : (
                        <Box m="auto" mt={4}>
                            <EmptyData textAbove={'No data to display'} />
                        </Box>
                    )}
                </Fragment>
            )}
        </Grid>
    )
}

export default Participation
