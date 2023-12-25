import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const DataTable = ({ data }) => {
    const totalNumOfSubjectArea = data?.reduce((total, row) => total + row?.numOfSubjectArea, 0)

    return (
        <TableContainer component={Paper}>
            <Table
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
                            Track
                        </TableCell>

                        <TableCell sx={{ fontWeight: 'bold' }} align="right">
                            Subject Area
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {data.map((row, index) => (
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
                            <TableCell align="center">{row.trackName}</TableCell>

                            <TableCell align="right">{row.numOfSubjectArea}</TableCell>
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
                        <TableCell align="right">{totalNumOfSubjectArea}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DataTable
