import React, { memo } from 'react'

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ReviewChecklistCriteria = ({ criteria }) => {
    return (
        <React.Fragment>
            <TableContainer sx={{ my: 2 }} component={Paper}>
                <Table
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
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
                            <TableCell sx={{ fontWeight: 'bold' }}>Order</TableCell>
                            <TableCell
                                style={{
                                    width: 220,
                                    maxWidth: 220,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    borderStyle: 'border-box',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Criteria Title
                            </TableCell>
                            <TableCell
                                style={{
                                    width: 300,
                                    maxWidth: 300,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    borderStyle: 'border-box',
                                }}
                                sx={{ fontWeight: 'bold' }}
                            >
                                Evaluation Criterion
                            </TableCell>
                            <TableCell
                                style={{
                                    width: 120,
                                    maxWidth: 120,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    borderStyle: 'border-box',
                                }}
                                align="right"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Grade
                            </TableCell>
                            <TableCell
                                style={{
                                    width: 120,
                                    maxWidth: 120,
                                }}
                                align="right"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Grade Level
                            </TableCell>
                            <TableCell
                                style={{
                                    width: 120,
                                    maxWidth: 120,
                                }}
                                align="right"
                                sx={{ fontWeight: 'bold' }}
                            >
                                Factor
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                        {criteria.map((criterion) => (
                            <TableRow
                                key={criterion.id}
                                hover
                                sx={{
                                    'td, th': {
                                        borderRight: '1px solid #cecdcd',
                                        py: 1,
                                        px: 2,
                                    },
                                }}
                            >
                                <TableCell>{criterion.position}</TableCell>
                                <TableCell>{criterion.title}</TableCell>
                                <TableCell>{criterion.evaluationCriteria}</TableCell>
                                <TableCell>
                                    <TextField
                                        disabled
                                        size="small"
                                        value={criterion.grade}
                                        inputProps={{
                                            max: criterion.gradeLevel,
                                            type: 'number',
                                            style: { textAlign: 'right' },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">{criterion.gradeLevel}</TableCell>
                                <TableCell align="right">{criterion.factor}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default memo(ReviewChecklistCriteria)
