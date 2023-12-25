import { Fragment, useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Description, Group, HelpOutline, RateReview, School } from '@mui/icons-material'
import { Box, Grid, Skeleton, Tooltip, Typography, Zoom } from '@mui/material'
import { grey } from '@mui/material/colors'

import { useSnackbar } from '~/HOCs/SnackbarContext'

const StatisticCards = ({ participation }) => {
    const [statis, setStatis] = useState({})
    const showSnackBar = useSnackbar()
    const [isLoading, setIsLoading] = useState(true)
    const history = useHistory()
    const { conferenceId } = useParams()
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        // getStatistic(signal)
        //     .then((response) => {
        //         const data = response.data.data
        //         setStatis(data)
        //     })
        //     .catch(() => {
        //         showSnackBar({
        //             severity: 'error',
        //             children: 'Something went wrong, please try again later.',
        //         })
        //     })
        //     .finally(() => {
        setIsLoading(false)
        //     })
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Fragment>
            {isLoading ? (
                <Box display="flex" justifyContent="space-around">
                    <Skeleton sx={{ height: 96, width: 344, borderRadius: 4 }} animation="wave" variant="rounded" />
                    <Skeleton sx={{ height: 96, width: 344, borderRadius: 4 }} animation="wave" variant="rounded" />
                    <Skeleton sx={{ height: 96, width: 344, borderRadius: 4 }} animation="wave" variant="rounded" />
                    <Skeleton sx={{ height: 96, width: 344, borderRadius: 4 }} animation="wave" variant="rounded" />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    sx={{
                                        background: 'linear-gradient(191deg, #f7b924, #e0a008)',
                                        borderRadius: 2,
                                    }}
                                    width="3.6rem"
                                    height="3.6rem"
                                    justifyContent="center"
                                    alignItems="center"
                                    shadow="md"
                                >
                                    <Group sx={{ fontSize: 28, color: '#ffffff' }} />
                                </Box>
                            </Grid>
                            <Grid item xs={9}>
                                <Box ml={2}>
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                color: grey[600],
                                                ':hover': {
                                                    textDecoration: 'underline',
                                                },
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                history.push(`/conferences/${conferenceId}/manage-conference-users`)
                                            }
                                            fontSize="0.9rem"
                                        >
                                            Conference Users
                                        </Typography>
                                        <Tooltip
                                            title="Number of Conference Users"
                                            TransitionComponent={Zoom}
                                            placement="top"
                                        >
                                            <HelpOutline fontSize="inherit" sx={{ ml: 1, color: grey[600] }} />
                                        </Tooltip>
                                    </Box>
                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            color: '#f7b924',
                                            lineHeight: 1.1,
                                        }}
                                        fontSize="2.2rem"
                                    >
                                        {participation.conferenceNumberOfConferenceUsers
                                            ? participation.conferenceNumberOfConferenceUsers
                                            : 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    sx={{
                                        background: 'linear-gradient(191deg, rgb(73, 163, 241), rgb(26, 115, 232))',
                                        borderRadius: 2,
                                    }}
                                    width="3.6rem"
                                    height="3.6rem"
                                    justifyContent="center"
                                    alignItems="center"
                                    shadow="md"
                                >
                                    <School sx={{ fontSize: 28, color: '#ffffff' }} />
                                </Box>
                            </Grid>
                            <Grid item xs={9}>
                                <Box ml={2}>
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                color: grey[600],
                                                ':hover': {
                                                    textDecoration: 'underline',
                                                },
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                history.push(`/conferences/${conferenceId}/manage-conference-users`)
                                            }
                                            fontSize="0.9rem"
                                        >
                                            Authors
                                        </Typography>
                                        <Tooltip title="Number of Authors" TransitionComponent={Zoom} placement="top">
                                            <HelpOutline fontSize="inherit" sx={{ ml: 1, color: grey[600] }} />
                                        </Tooltip>
                                    </Box>
                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            color: 'rgb(73, 163, 241)',
                                            lineHeight: 1.1,
                                        }}
                                        fontSize="2.2rem"
                                    >
                                        {participation.conferenceNumberOfAuthors
                                            ? participation.conferenceNumberOfAuthors
                                            : 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    sx={{
                                        background: 'linear-gradient(191deg, rgb(102, 187, 106), rgb(67, 160, 71))',
                                        borderRadius: 2,
                                    }}
                                    width="3.6rem"
                                    height="3.6rem"
                                    justifyContent="center"
                                    alignItems="center"
                                    shadow="md"
                                >
                                    <Description sx={{ fontSize: 28, color: '#ffffff' }} />
                                </Box>
                            </Grid>
                            <Grid item xs={9}>
                                <Box ml={2}>
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                color: grey[600],
                                                ':hover': {
                                                    textDecoration: 'underline',
                                                },
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                history.push(
                                                    `/conferences/${conferenceId}/submission/submission-console`
                                                )
                                            }
                                            fontSize="0.9rem"
                                        >
                                            Submissions
                                        </Typography>
                                        <Tooltip
                                            title="Number of Submissions"
                                            TransitionComponent={Zoom}
                                            placement="top"
                                        >
                                            <HelpOutline fontSize="inherit" sx={{ ml: 1, color: grey[600] }} />
                                        </Tooltip>
                                    </Box>
                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            color: 'rgb(102, 187, 106)',
                                            lineHeight: 1.1,
                                        }}
                                        fontSize="2.2rem"
                                    >
                                        {participation.conferenceNumberOfSubmissions
                                            ? participation.conferenceNumberOfSubmissions
                                            : 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <Grid item xs={3}>
                                <Box
                                    display="flex"
                                    sx={{
                                        background: 'linear-gradient(191deg, rgb(236, 64, 122), rgb(216, 27, 96))',
                                        borderRadius: 2,
                                    }}
                                    width="3.6rem"
                                    height="3.6rem"
                                    justifyContent="center"
                                    alignItems="center"
                                    shadow="md"
                                >
                                    <RateReview sx={{ fontSize: 28, color: '#ffffff' }} />
                                </Box>
                            </Grid>
                            <Grid item xs={9}>
                                <Box ml={2}>
                                    <Box display="flex" alignItems="center">
                                        <Typography
                                            fontWeight={500}
                                            sx={{
                                                color: grey[600],
                                                ':hover': {
                                                    textDecoration: 'underline',
                                                },
                                                cursor: 'pointer',
                                            }}
                                            onClick={() =>
                                                history.push(`/conferences/${conferenceId}/manage-reviewers`)
                                            }
                                            fontSize="0.9rem"
                                        >
                                            Reviewers
                                        </Typography>
                                        <Tooltip title="Number of Reviewers" TransitionComponent={Zoom} placement="top">
                                            <HelpOutline fontSize="inherit" sx={{ ml: 1, color: grey[600] }} />
                                        </Tooltip>
                                    </Box>
                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            color: 'rgb(236, 64, 122)',
                                            lineHeight: 1.1,
                                        }}
                                        fontSize="2.2rem"
                                    >
                                        {participation.conferenceNumberOfReviewers
                                            ? participation.conferenceNumberOfReviewers
                                            : 0}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Fragment>
    )
}

export default StatisticCards
