import { ArrowDownward, ArrowUpward, Delete, Edit } from '@mui/icons-material'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CriteriaList = ({ criteria, handleOpenUpdateCriterion, deleteCriterion, handleMove }) => {
    return (
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
                        <TableCell sx={{ fontWeight: 'bold' }}>Criteria Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Evaluation Criteria</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Grade Level
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            Weight (%)
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: 150 }}>
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {criteria.map((criterion, index) => (
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
                            <TableCell>{criterion.title}</TableCell>
                            <TableCell>{criterion.evaluationCriterion}</TableCell>
                            <TableCell align="right">{criterion.gradeLevel}</TableCell>
                            <TableCell align="right">{(criterion.factor * 100).toFixed(0)}</TableCell>
                            <TableCell align="center">
                                <IconButton
                                    onClick={() => handleOpenUpdateCriterion(criterion.id)}
                                    sx={{ mr: 1 }}
                                    size="small"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton onClick={() => deleteCriterion(criterion.id)} sx={{ mr: 1 }} size="small">
                                    <Delete fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleMove(index, 'down')}
                                    disabled={index === criteria.length - 1 || criteria.length === 1}
                                    size="small"
                                >
                                    <ArrowDownward fontSize="small" />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleMove(index, 'up')}
                                    disabled={index === 0 || criteria.length === 1}
                                    sx={{ mr: 1 }}
                                    size="small"
                                >
                                    <ArrowUpward fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default CriteriaList
