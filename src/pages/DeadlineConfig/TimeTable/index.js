import { MoreTime } from '@mui/icons-material'
import {
    Box,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TimeTable = ({ deadlines, handleDeadlineStatus, handleDeadlineTime }) => {
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
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Phase
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Deadline Name
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Status
                        </TableCell>
                        <TableCell
                            sx={{ fontWeight: 'bold' }}
                            align="left"
                            style={{
                                width: 130,
                                maxWidth: 130,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderStyle: 'border-box',
                            }}
                        >
                            Deadline
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {deadlines.map((deadline, index) => (
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
                            <TableCell align="left">
                                <FormControl sx={{ width: 200 }} size="small">
                                    <Select
                                        onChange={() => handleDeadlineStatus(index)}
                                        size="small"
                                        value={deadline.status}
                                        disabled={deadline.status === 'Completed'}
                                    >
                                        <MenuItem value="Enabled">Enabled</MenuItem>
                                        <MenuItem value="Completed">Completed</MenuItem>
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <TableCell align="left">
                                <Box display="flex" alignItems="center">
                                    <Typography sx={{ fontSize: 16 }}>
                                        {deadline.completionTime === null
                                            ? new Date(deadline.deadline).toLocaleDateString('en-GB')
                                            : new Date(deadline.completionTime).toLocaleDateString('en-GB')}
                                    </Typography>
                                    <Tooltip title="Extend Deadline" TransitionComponent={Zoom} placement="right">
                                        <Box component="span">
                                            <IconButton
                                                color="warning"
                                                onClick={() => handleDeadlineTime(index)}
                                                disabled={deadline.status === 'Completed'}
                                            >
                                                <MoreTime />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TimeTable
