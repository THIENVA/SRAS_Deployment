import React, { memo } from 'react'

import { cloneDeep } from 'lodash'

import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'

import TableRowsLoader from '../TableSkeleton'

import { AppStyles } from '~/constants/colors'
import { blockInvalidChar } from '~/utils/commonFunction'

const ReviewChecklistCriteria = ({ loading, criteria, setChecklistCriteria }) => {
    const handleGradeChange = (event, index, gradeLevel) => {
        const { value } = event.target
        if (+value <= gradeLevel && +value >= 0) {
            const updatedCriteria = cloneDeep(criteria)
            updatedCriteria[index].grade = +value
            setChecklistCriteria(updatedCriteria)
        }
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: AppStyles.colors['#F7F7F7'],
                        textTransform: 'uppercase',
                    }}
                >
                    Research Paper Review Criteria
                </Typography>
            </Box>
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
                                Weight (%)
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                        {loading ? (
                            <TableRowsLoader rowsNum={3} />
                        ) : (
                            criteria.map((criterion, index) => (
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
                                    <TableCell>
                                        <TextField
                                            onKeyDown={blockInvalidChar}
                                            size="small"
                                            value={criterion.grade}
                                            onChange={(event) => handleGradeChange(event, index, criterion.gradeLevel)}
                                            inputProps={{
                                                max: criterion.gradeLevel,
                                                type: 'number',
                                                style: { textAlign: 'right' },
                                            }}
                                            sx={{
                                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                                    {
                                                        display: 'none',
                                                    },
                                                '& input[type=number]': {
                                                    MozAppearance: 'textfield',
                                                },
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{criterion.gradeLevel}</TableCell>
                                    <TableCell align="right">{criterion.factor * 100}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}

export default memo(ReviewChecklistCriteria)
