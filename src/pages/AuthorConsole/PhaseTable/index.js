import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const PhaseTable = ({ phase }) => {
    const mergedPhases = []
    phase?.forEach((item) => {
        if (item.currentPhases) {
            item.currentPhases.forEach((phase) => {
                mergedPhases.push({
                    trackName: item.trackName,
                    phaseType: 'Current Phases',
                    deadlineName: phase.deadlineName,
                    deadline: phase.deadline,
                    phase: phase.phase,
                    factor: phase.factor,
                })
            })
        }

        if (item.nextPhases) {
            item.nextPhases.forEach((phase) => {
                mergedPhases.push({
                    trackName: item.trackName,
                    phaseType: 'Next Phases',
                    deadlineName: phase.deadlineName,
                    deadline: phase.deadline,
                    phase: phase.phase,
                    factor: phase.factor,
                })
            })
        }
    })

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
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Track Name
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Phase Type
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Phase Name
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Phase Deadline Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="left">
                            Deadline
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {mergedPhases.map((deadline, index) => (
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
                            <TableCell align="left">{deadline.trackName}</TableCell>
                            <TableCell>{deadline.phaseType}</TableCell>
                            <TableCell>{deadline.phase}</TableCell>
                            <TableCell>{deadline.deadlineName}</TableCell>
                            <TableCell>{new Date(deadline.deadline).toLocaleDateString('en-GB')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PhaseTable
