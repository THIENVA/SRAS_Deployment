import { ArrowDownward, ArrowUpward, Delete, Edit } from '@mui/icons-material'
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material'

import { TYPES } from '~/constants/SubmissionQuestionsConstant'
import { AppStyles } from '~/constants/colors'

const Questions = ({ questions, handleOpenEdit, openAlertPopup, handleMoveQuestion }) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table
                sx={{
                    width: '100%',
                    border: `1px solid ${AppStyles.colors['#ddd']}`,
                    borderRadius: 2,
                }}
            >
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {questions.map((question, index) => (
                        <TableRow
                            hover
                            key={question.id}
                            sx={{
                                'td, th': {
                                    borderRight: `1px solid ${AppStyles.colors['#ddd']}`,
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            <TableCell width="80%">
                                <Box display="flex">
                                    <Typography variant="h6" component="span" fontWeight={700}>
                                        {index + 1}.
                                    </Typography>
                                    <Box component={'span'} sx={{ color: 'red', ml: 1, mr: 0.25 }}>
                                        *
                                    </Box>
                                    <Typography variant="h6" component="span">
                                        {question.title}
                                    </Typography>
                                </Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    {question.text}
                                </Typography>
                                <Box display="flex">
                                    <Typography variant="subtitle1" component="span" fontWeight={700}>
                                        Type:
                                    </Typography>
                                    <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
                                        {question.typeName}
                                    </Typography>
                                </Box>
                                {question.typeName !== TYPES.AGREEMENT && question.typeName !== TYPES.COMMENT && (
                                    <List sx={{ pt: 0 }}>
                                        {question.showAs.result.value.map((text, index) => (
                                            <ListItem key={index} sx={{ my: 0, py: 0, mt: 0 }}>
                                                <ListItemText primary={text.value} />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </TableCell>
                            <TableCell align="center" sx={{ position: 'relative' }}>
                                <IconButton
                                    sx={{
                                        mr: 1.5,
                                        position: 'absolute',
                                        left: '50%',
                                        top: 5,
                                        transform: 'translate(-200%, 0)',
                                    }}
                                    onClick={() => handleOpenEdit(question.id)}
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    sx={{ position: 'absolute', left: '50%', top: 5, transform: 'translate(-100%, 0)' }}
                                    onClick={() => openAlertPopup(question.id)}
                                >
                                    <Delete />
                                </IconButton>
                                <IconButton
                                    disabled={index === questions.length - 1 || questions.length === 1}
                                    sx={{ position: 'absolute', left: '50%', top: 5, transform: 'translate(0, 0)' }}
                                    onClick={() => handleMoveQuestion(index, 'down')}
                                >
                                    <ArrowDownward />
                                </IconButton>
                                <IconButton
                                    disabled={index === 0 || questions.length === 1}
                                    sx={{ position: 'absolute', left: '50%', top: 5, transform: 'translate(100%, 0)' }}
                                    onClick={() => handleMoveQuestion(index, 'up')}
                                >
                                    <ArrowUpward />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Questions
