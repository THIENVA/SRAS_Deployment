import { Box, Grid, Link, Typography } from '@mui/material'
import ListView from '~/components/ListView'

import { AppStyles } from '~/constants/colors'

const Summary = ({ dashboardDetails }) => {
    return (
        <Grid container sx={{ mt: 3 }} columnGap={5}>
            <Grid item xs={7} md={7} lg={7}>
                <ListView
                    header={'SUBJECT AREAS'}
                    list={dashboardDetails.subjectAreas ? dashboardDetails.subjectAreas : []}
                    emptyText="Subject Areas Empty"
                />
            </Grid>
            <Grid item xs={4} md={4} lg={4}>
                <Box
                    sx={{
                        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                    }}
                    borderRadius={2}
                >
                    <Box sx={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.08)' }}>
                        <Box py={2} px={3}>
                            <Typography sx={{ fontSize: 16, color: AppStyles.colors['#002b5d'], fontWeight: 600 }}>
                                WEBSITE
                            </Typography>
                        </Box>
                    </Box>
                    <Box pt={2} pb={3} px={2}>
                        <Box py={2} px={2} sx={{ backgroundColor: AppStyles.colors['#F2F2F2'], borderRadius: 2 }}>
                            {dashboardDetails.websiteLink ? (
                                <Link
                                    sx={{
                                        overflow: 'hidden',
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: '2',
                                        textOverflow: 'ellipsis',
                                        color: AppStyles.colors['#027A9D'],
                                        cursor: 'pointer',
                                        fontSize: 18,
                                    }}
                                    onClick={() => window.open(dashboardDetails.websiteLink)}
                                >
                                    {dashboardDetails?.websiteLink?.replace(/^https?:\/\//i, '')}
                                </Link>
                            ) : (
                                <Typography>There is no link.</Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box mt={3}>
                    <ListView
                        header={'TRACKS (IF HAVE)'}
                        list={dashboardDetails.tracks ? dashboardDetails.tracks : []}
                        emptyText="Tracks Empty"
                        minHeight={220}
                    />
                </Box>
            </Grid>
        </Grid>
    )
}

export default Summary
