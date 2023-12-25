import React from 'react'

import { Box, Grid, Typography } from '@mui/material'

const PaperStatus = ({ data, text }) => {
    let totalCount = 0

    data?.forEach((item) => {
        totalCount += item?.count
    })

    return (
        <Grid container py={2} px={3} columnSpacing={8} rowSpacing={2}>
            <Typography pl={12} fontWeight={'bold'} sx={{ fontSize: 18 }}>
                {text} {text && '(' + totalCount + ')'}
            </Typography>
            {data?.map((row, index) => (
                <Grid key={index} container item xs={12} md={12} lg={12}>
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
                                The number of submission {row?.name} ({Math.round(row?.number)}%)
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 14,
                                    color: '#495057',
                                    opacity: 0.5,
                                }}
                            >
                                Total {row?.name} Submission
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
                            {row?.count ? row?.count : 0}
                        </Typography>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    )
}

export default PaperStatus
