import { useState } from 'react'

import { EditOutlined } from '@mui/icons-material'
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material'
import Label from '~/components/Label'

import { AppStyles } from '~/constants/colors'

const rows = [
    {
        status: true,
        line: 3,
        reviewerEmail: 'anhndtse150640@fpt.edu.vn',
        quota: 2,
        notes: 'Email is not valid.',
    },
    {
        status: false,
        line: 4,
        reviewerEmail: 'example0@fpt.edu.vn',
        quota: 2,
        notes: '',
    },
]
const TableData = ({ removeFile }) => {
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }
    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Paper elevation={4} sx={{ width: '100%', mb: 2 }}>
                <Toolbar>
                    <Typography
                        sx={{ flex: '1 1 100%', fontWeight: 'bold' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Reviewers
                    </Typography>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => removeFile()}>
                            <EditOutlined />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <TableContainer>
                    <Table stickyHeader sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ minWidth: 100 }}></TableCell>
                                <TableCell style={{ minWidth: 100, fontWeight: 'bold' }}>Line #</TableCell>
                                <TableCell style={{ minWidth: 170, fontWeight: 'bold' }} align="left">
                                    Reviewer Email
                                </TableCell>
                                <TableCell style={{ minWidth: 100, fontWeight: 'bold' }} align="left">
                                    Quota
                                </TableCell>
                                <TableCell style={{ minWidth: 170, fontWeight: 'bold' }} align="left">
                                    Notes
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => {
                                return (
                                    <TableRow
                                        hover
                                        tabIndex={-1}
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor: AppStyles.colors['#F7FCFF'],
                                            },
                                            // hide last border
                                            '&:last-child td, &:last-child th': {
                                                border: 0,
                                            },
                                        }}
                                    >
                                        <TableCell>
                                            <Label variant="ghost" color={row.status === true ? 'success' : 'error'}>
                                                {row.status === true ? 'Success' : 'Fail'}
                                            </Label>
                                        </TableCell>
                                        <TableCell>{row.line}</TableCell>
                                        <TableCell align="left">{row.reviewerEmail}</TableCell>
                                        <TableCell align="left">{row.quota}</TableCell>
                                        <TableCell align="left">{row.notes}</TableCell>
                                    </TableRow>
                                )
                            })}
                            {/* {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (dense ? 33 : 53) * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )} */}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    )
}

export default TableData
