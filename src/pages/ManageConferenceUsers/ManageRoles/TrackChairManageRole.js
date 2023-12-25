import { Delete } from '@mui/icons-material'
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const TrackChairManageRole = ({ user, handleRemoveUserToRole, trackName }) => {
    const { userId } = useAppSelector((state) => state.auth)
    return (
        <TableContainer sx={{ mt: 2 }} component={Paper}>
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
                            Role
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Track
                        </TableCell>
                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {user?.roles.map((role) => (
                        <TableRow
                            key={role.roleId}
                            sx={{
                                'td, th': {
                                    borderRight: '1px solid #cecdcd',
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            <TableCell>{role.roleName}</TableCell>
                            <TableCell>
                                {role.roleName === ROLES_NAME.CHAIR || role.roleName === ROLES_NAME.AUTHOR
                                    ? ''
                                    : trackName}
                            </TableCell>
                            <TableCell>
                                {role.roleName === ROLES_NAME.CHAIR ||
                                role.roleName === ROLES_NAME.AUTHOR ||
                                userId === user?.id ? null : (
                                    <IconButton
                                        aria-label="close"
                                        size="small"
                                        onClick={() => handleRemoveUserToRole(role.roleId)}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TrackChairManageRole
