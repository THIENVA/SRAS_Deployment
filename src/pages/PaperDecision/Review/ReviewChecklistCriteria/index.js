import React, { memo } from 'react'

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ReviewChecklistCriteria = ({ criteria }) => {
    return (
        <React.Fragment>
            <TableContainer sx={{ mb: 2 }} component={Paper}>
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
                            <TableCell sx={{ fontWeight: 'bold' }}>No</TableCell>
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
                                Name
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
                                Evaluation Criteria
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
                                <TableCell>{criterion.evaluationCriterion}</TableCell>
                                <TableCell align="right">{criterion.factor * 100}%</TableCell>
                                <TableCell align="right">{`${criterion.grade}/${criterion.gradeLevel}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default memo(ReviewChecklistCriteria)
