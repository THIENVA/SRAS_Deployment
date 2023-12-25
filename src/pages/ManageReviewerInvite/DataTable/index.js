import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const DataTable = ({ data }) => {
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
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Number of Invitation
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Accepted
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Rejected
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Not Response
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    <TableRow
                        sx={{
                            'td, th': {
                                borderRight: '1px solid #cecdcd',
                                py: 1,
                                px: 2,
                            },
                        }}
                    >
                        <TableCell align="right">{data?.numOfInvitation ? data?.numOfInvitation : 0}</TableCell>
                        <TableCell align="right">{data?.numOfAccepted ? data?.numOfAccepted : 0}</TableCell>
                        <TableCell align="right">{data?.numOfReject ? data?.numOfReject : 0}</TableCell>
                        <TableCell align="right">{data?.numOfNotResponsed ? data?.numOfNotResponsed : 0}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DataTable
