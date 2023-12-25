import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const DataTable = ({ data }) => {
    const totalNumOfReviewer = data?.reduce((total, row) => total + row?.numOfReviewer, 0)
    const totalNumOfReviewerWasAssigned = data?.reduce((total, row) => total + row?.numOfReviewerWasAssigned, 0)
    const totalNumOfReviewerNotAssigned = data?.reduce((total, row) => total + row?.numOfReviewerNotAssigned, 0)
    const totalnumOfReviewerNotReviewAny = data?.reduce((total, row) => total + row?.numOfReviewerNotReviewAny, 0)
    const totalnumOfReviewerReviewedPartly = data?.reduce((total, row) => total + row?.numOfReviewerReviewedPartly, 0)
    const totalnumOfReviewerReviewedAll = data?.reduce((total, row) => total + row?.numOfReviewerReviewedAll, 0)

    return (
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
                            Number of Reviewer
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Reviewer Assigned
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Reviewer Not Assigned
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">
                            Reviewer Reviewed All
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">
                            Reviewer Not Review Any
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">
                            Reviewer Reviewed Partly
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {data?.map((row, index) => (
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
                            <TableCell align="right">{row?.numOfReviewer}</TableCell>
                            <TableCell align="right">{row?.numOfReviewerWasAssigned}</TableCell>
                            <TableCell align="right">{row?.numOfReviewerNotAssigned}</TableCell>
                            <TableCell align="right">{row?.numOfReviewerReviewedAll}</TableCell>
                            <TableCell align="right">{row?.numOfReviewerNotReviewAny}</TableCell>
                            <TableCell align="right">{row?.numOfReviewerReviewedPartly}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow
                        sx={{
                            'td, th': {
                                borderRight: '1px solid #cecdcd',
                                py: 1,
                                px: 2,
                            },
                        }}
                    >
                        <TableCell align="center">All Track</TableCell>
                        <TableCell align="right">{totalNumOfReviewer}</TableCell>
                        <TableCell align="right">{totalNumOfReviewerWasAssigned}</TableCell>
                        <TableCell align="right">{totalNumOfReviewerNotAssigned}</TableCell>
                        <TableCell align="right">{totalnumOfReviewerReviewedAll}</TableCell>
                        <TableCell align="right">{totalnumOfReviewerNotReviewAny}</TableCell>
                        <TableCell align="right">{totalnumOfReviewerReviewedPartly}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DataTable
