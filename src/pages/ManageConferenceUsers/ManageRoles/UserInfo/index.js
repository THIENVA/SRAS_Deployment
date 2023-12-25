import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const UserInfo = ({ fullName, organization, email }) => {
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
                            Full Name
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Organization
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Email
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    <TableRow
                        sx={{
                            'td, th': {
                                borderRight: '1px solid #cecdcd',
                                py: 1,
                                px: 2,
                            },
                        }}
                    >
                        <TableCell>{fullName}</TableCell>
                        <TableCell>{organization}</TableCell>
                        <TableCell>{email}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default UserInfo
