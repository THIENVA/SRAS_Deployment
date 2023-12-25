import { Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const PaperStatuses = ({ statuses }) => {
    return (
        <TableContainer sx={{ mt: 3 }} component={Paper}>
            <Table
                sx={{
                    width: '100%',
                    border: `1px solid ${AppStyles.colors['#ddd']}`,
                    borderRadius: 2,
                }}
            >
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {statuses.map((status) => (
                        <TableRow
                            key={status.statusId}
                            sx={{
                                'td, th': {
                                    borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            <TableCell>
                                <Typography variant="h6">{status.statusName}</Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PaperStatuses
