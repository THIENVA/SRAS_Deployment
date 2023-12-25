import React from 'react'

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const DataTable = ({ data }) => {
    return (
        <React.Fragment>
            <Paper sx={{ border: `1px solid ${AppStyles.colors['#ddd']}` }}>
                <Box p={2} py={1} display="flex" justifyContent={'flex-end'}>
                    <Typography fontSize={14}>
                        <strong>Number of Chairs:</strong> {data?.numOfChair}
                    </Typography>
                </Box>
            </Paper>
            <TableContainer component={Paper} sx={{ maxHeight: 180 }}>
                <Table
                    stickyHeader
                    sx={{
                        width: '100%',
                        border: `1px solid ${AppStyles.colors['#ddd']}`,
                        borderRadius: 2,
                    }}
                >
                    <TableHead>
                        <TableRow
                            sx={{
                                'td, th': {
                                    borderRight: '1px solid #cecdcd',
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Track Name
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                Track Chair
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                Reviewer
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                Author
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                        {data?.numOfUserEachTrack?.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    'td, th': {
                                        borderRight: '1px solid #cecdcd',
                                        py: 1,
                                        px: 2,
                                    },
                                }}
                            >
                                <TableCell align="center">{row?.trackName}</TableCell>
                                <TableCell align="right">{row?.numOfTrackChair}</TableCell>
                                <TableCell align="right">{row?.numOfReviewer}</TableCell>
                                <TableCell align="right">{row?.numOfAuthor}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default DataTable
