import React from 'react'

import { Edit } from '@mui/icons-material'
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Zoom,
    styled,
    tableCellClasses,
} from '@mui/material'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))
const TableUser = ({ textField, setIsUpdateInvite, setNextStep }) => {
    const enableEditHandle = () => {
        setNextStep(false)
        setIsUpdateInvite(true)
    }
    return (
        <Box sx={{ maxWidth: 700 }}>
            <TableContainer sx={{ mt: 2 }} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">Organization</StyledTableCell>
                            <StyledTableCell align="right">Email</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <StyledTableRow key={1} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <StyledTableCell component="th" scope="row">
                                {textField.firstName} {textField.middleName} {textField.lastName}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }} align="right">
                                {textField.organization}
                            </StyledTableCell>
                            <StyledTableCell style={{ width: 160 }} align="right">
                                {textField.email}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Tooltip TransitionComponent={Zoom} title="Edit Info" placement="bottom-start">
                                    <IconButton onClick={enableEditHandle}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TableUser
