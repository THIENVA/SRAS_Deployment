import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TimeTable = ({ deadlines, currentDate }) => {
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
                        <TableCell align="left">Plan Deadline</TableCell>
                        <TableCell align="left">Deadline</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {deadlines.map((item, index) => {
                        let prevCompleted = ''
                        const i = index > 0 ? index - 1 : 0
                        if (deadlines[i].status) {
                            prevCompleted = deadlines[i].status
                        }
                        const isFirstItem = index === 0
                        const isFirstItemEnabled = isFirstItem && item.status === 'Enabled'

                        return (
                            <TableRow
                                key={item.id}
                                sx={{
                                    backgroundColor: isFirstItemEnabled
                                        ? '#fff391'
                                        : item.status === 'Completed'
                                        ? '#b7deb8'
                                        : prevCompleted === 'Completed'
                                        ? '#fff391'
                                        : '',
                                    'td, th': {
                                        borderRight: '1px solid #cecdcd',
                                        py: 1,
                                        px: 2,
                                    },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        fontWeight: isFirstItemEnabled
                                            ? 'bold'
                                            : item.status === 'Completed'
                                            ? 'none'
                                            : prevCompleted === 'Completed' && 'bold',
                                        color: isFirstItemEnabled
                                            ? '#ab5810'
                                            : item.status === 'Completed'
                                            ? '#124116'
                                            : prevCompleted === 'Completed'
                                            ? '#ab5810'
                                            : '',
                                    }}
                                >
                                    {item.phase}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: isFirstItemEnabled
                                            ? 'bold'
                                            : item.status === 'Completed'
                                            ? 'none'
                                            : prevCompleted === 'Completed' && 'bold',
                                        color: isFirstItemEnabled
                                            ? '#ab5810'
                                            : item.status === 'Completed'
                                            ? '#124116'
                                            : prevCompleted === 'Completed'
                                            ? '#ab5810'
                                            : '',
                                    }}
                                >
                                    {item.name}
                                </TableCell>
                                <TableCell
                                    align="left"
                                    sx={{
                                        fontWeight: isFirstItemEnabled
                                            ? 'bold'
                                            : item.status === 'Completed'
                                            ? 'none'
                                            : prevCompleted === 'Completed' && 'bold',
                                        color: isFirstItemEnabled
                                            ? '#ab5810'
                                            : item.status === 'Completed'
                                            ? '#124116'
                                            : prevCompleted === 'Completed'
                                            ? '#ab5810'
                                            : '',
                                    }}
                                >
                                    {item.status}
                                </TableCell>
                                <TableCell
                                    align="left"
                                    sx={{
                                        fontWeight: isFirstItemEnabled
                                            ? 'bold'
                                            : item.status === 'Completed'
                                            ? 'none'
                                            : prevCompleted === 'Completed' && 'bold',
                                        color: isFirstItemEnabled
                                            ? '#ab5810'
                                            : item.status === 'Completed'
                                            ? '#124116'
                                            : prevCompleted === 'Completed'
                                            ? '#ab5810'
                                            : '',
                                    }}
                                >
                                    {item.planDeadline && new Date(item.planDeadline).toLocaleDateString('en-GB')}
                                </TableCell>
                                <TableCell
                                    align="left"
                                    sx={{
                                        fontWeight: isFirstItemEnabled
                                            ? 'bold'
                                            : item.status === 'Completed'
                                            ? 'none'
                                            : prevCompleted === 'Completed' && 'bold',
                                        color: isFirstItemEnabled
                                            ? '#ab5810'
                                            : item.status === 'Completed'
                                            ? '#124116'
                                            : prevCompleted === 'Completed'
                                            ? '#ab5810'
                                            : '',
                                    }}
                                >
                                    {item.deadline && new Date(item.deadline).toLocaleDateString('en-GB')}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TimeTable
