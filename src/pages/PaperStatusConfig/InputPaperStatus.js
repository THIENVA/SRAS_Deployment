import { useEffect, useState } from 'react'

import {
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from '@mui/material'

const InputPaperStatus = ({ cancelEditingHandler, modifySubjectAreaHandler, status }) => {
    const { text, visibleToAuthor } = status
    const [statusSubmitted, setStatusSubmitted] = useState({ text, visibleToAuthor })

    const handleStatusTextChange = (event) => {
        setStatusSubmitted((prev) => ({ ...prev, text: event.target.value }))
    }

    const handleStatusCheckChange = (event) => {
        setStatusSubmitted((prev) => ({ ...prev, visibleToAuthor: event.target.checked }))
    }

    useEffect(() => {
        setStatusSubmitted({ text, visibleToAuthor })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, visibleToAuthor])

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table
                sx={{
                    width: '100%',
                    overflow: 'hidden',
                }}
            >
                <TableBody sx={{ backgroundColor: '#f9f7f7' }}>
                    <TableRow
                        sx={{
                            'td, th': {
                                borderRight: '1px solid #cecdcd',
                            },
                        }}
                    >
                        <TableCell align="center">
                            <TextField
                                placeholder="name"
                                size="small"
                                variant="outlined"
                                sx={{ maxWidth: 300 }}
                                onChange={handleStatusTextChange}
                                value={statusSubmitted.text}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={statusSubmitted.visibleToAuthor}
                                        onChange={handleStatusCheckChange}
                                    />
                                }
                                label="Review Visible To Author
"
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Button
                                variant="contained"
                                sx={{ mr: 2 }}
                                onClick={() => modifySubjectAreaHandler(statusSubmitted)}
                            >
                                Save
                            </Button>
                            <Button variant="contained" color="error" onClick={cancelEditingHandler}>
                                Cancel
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default InputPaperStatus
