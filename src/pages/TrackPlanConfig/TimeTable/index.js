import { enGB } from 'date-fns/locale'

import {
    Box,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { AppStyles } from '~/constants/colors'

const TimeTable = ({ deadlines, handleDeadlineStatus, handleDeadlineTime, isFirstTime }) => {
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
                                width: 250,
                                maxWidth: 250,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderStyle: 'border-box',
                            }}
                        >
                            Plan Deadline
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
                                    {deadline.canSkip === true && isFirstTime === true ? (
                                        <Select
                                            onChange={(event) => handleDeadlineStatus(event.target.value, index)}
                                            size="small"
                                            value={deadline.status}
                                        >
                                            <MenuItem value="Enabled">Enabled</MenuItem>
                                            <MenuItem value="Disabled">Disabled</MenuItem>
                                        </Select>
                                    ) : (
                                        <Select
                                            onChange={(event) => handleDeadlineStatus(event, index)}
                                            size="small"
                                            value={deadline.status}
                                            disabled={true}
                                        >
                                            <MenuItem value="Completed">Completed</MenuItem>
                                            <MenuItem value="Enabled">Enabled</MenuItem>
                                        </Select>
                                    )}
                                </FormControl>
                            </TableCell>
                            <TableCell align="left">
                                <Box pt={deadline?.helperText !== '' && 3}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                                        <FormControl fullWidth size="small">
                                            <DatePicker
                                                views={['day', 'month', 'year']}
                                                renderInput={(params) => (
                                                    <TextField
                                                        size="small"
                                                        {...params}
                                                        helperText={deadline?.helperText !== '' && deadline?.helperText}
                                                        error={deadline?.error}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                '& > fieldset': {
                                                                    borderColor:
                                                                        deadlines[0].id !== deadline.id &&
                                                                        deadlines[deadlines.length - 1].id !==
                                                                            deadline.id &&
                                                                        AppStyles.colors['#027A9D'],
                                                                },
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color:
                                                                    deadlines[0].id !== deadline.id &&
                                                                    deadlines[deadlines.length - 1].id !==
                                                                        deadline.id &&
                                                                    deadline.status !== 'Disabled' &&
                                                                    AppStyles.colors['#027A9D'],
                                                            },
                                                        }}
                                                    />
                                                )}
                                                value={deadline.planDeadline}
                                                onChange={(value) => handleDeadlineTime(value, index)}
                                                disabled={
                                                    deadline.status === 'Disabled' ||
                                                    isFirstTime === false ||
                                                    deadlines[0].id === deadline.id ||
                                                    deadlines[deadlines.length - 1].id === deadline.id
                                                }
                                            />
                                        </FormControl>
                                    </LocalizationProvider>
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
