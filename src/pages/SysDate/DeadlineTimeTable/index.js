import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const DeadlineTimeTable = ({ deadlines }) => {
    return (
        <TableContainer sx={{ mt: 2 }} component={Paper}>
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
                        <TableCell align="left">Phase</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">Deadline</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {deadlines.map((deadline) => (
                        <TableRow
                            key={deadline.id}
                            sx={{
                                'td, th': {
                                    borderRight: '1px solid #cecdcd',
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            <TableCell>{deadline.phase}</TableCell>
                            <TableCell>{deadline.name}</TableCell>
                            <TableCell align="left">{deadline.status}</TableCell>
                            <TableCell align="left">
                                {deadline.deadline && new Date(deadline.deadline).toLocaleDateString('en-GB')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DeadlineTimeTable
