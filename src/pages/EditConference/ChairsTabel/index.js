import React from 'react'

import { Clear } from '@mui/icons-material'
import {
    FormHelperText,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'

import TitleSection from '../TitleSection'

import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const Chairs = ({ rows, removeUsersTable, messageError, error }) => {
    const { userId } = useAppSelector((state) => state.auth)
    return (
        <React.Fragment>
            <TitleSection>CHAIRS</TitleSection>
            <TableContainer component={Paper}>
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
                                    borderRight: '1px solid #ededed',
                                },
                            }}
                        >
                            <TableCell>Email</TableCell>
                            <TableCell align="left">First Name</TableCell>
                            <TableCell align="left">Last Name</TableCell>
                            <TableCell align="left">Organization</TableCell>
                            <TableCell align="left">Country/Region</TableCell>
                            <TableCell align="left">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{
                                    'td, th': {
                                        borderRight: '1px solid #ededed',
                                    },
                                    backgroundColor: AppStyles.colors['#F5F5F5'],
                                }}
                            >
                                <TableCell component="th" scope="row" sx={{ py: 0 }}>
                                    {row.email}
                                </TableCell>
                                <TableCell align="left" sx={{ py: 0 }}>
                                    {row.firstName}
                                </TableCell>
                                <TableCell align="left" sx={{ py: 0 }}>
                                    {row.lastName}
                                </TableCell>
                                <TableCell align="left" sx={{ py: 0 }}>
                                    {row.organization}
                                </TableCell>
                                <TableCell align="left" sx={{ py: 0 }}>
                                    {row.country}
                                </TableCell>
                                <TableCell align="left">
                                    {row.userId !== userId && (
                                        <IconButton size="small" onClick={() => removeUsersTable(row.id)}>
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {error.chairs && <FormHelperText error={error.chairs}>{messageError.chairs}</FormHelperText>}
        </React.Fragment>
    )
}

export default Chairs
