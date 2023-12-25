import { Delete, Edit } from '@mui/icons-material'
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'

import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const ChairManageRole = ({ user, handleOpenChairManager, handleChairRemoveUserToRole }) => {
    const { userId } = useAppSelector((state) => state.auth)
    return user?.roles.length !== 0 ? (
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
                                {role.tracks.tracksEngaged.map((track) => (
                                    <Typography gutterBottom key={track.trackId}>
                                        {track.trackName}
                                    </Typography>
                                ))}
                            </TableCell>
                            <TableCell align="center" sx={{ position: 'relative' }}>
                                {role.factor !== 1 && role.factor !== 4 && (
                                    <IconButton
                                        aria-label="close"
                                        size="small"
                                        sx={{
                                            mr: 1.5,
                                            position: 'absolute',
                                            left: '50%',
                                            top: 5,
                                            transform: 'translate(-100%, 0)',
                                        }}
                                        onClick={() => handleOpenChairManager(role.roleId, role.roleName, 'chair-edit')}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                )}
                                {role.factor !== 4 && userId !== user?.id && (
                                    <IconButton
                                        onClick={() => handleChairRemoveUserToRole(role.roleId)}
                                        aria-label="close"
                                        size="small"
                                        sx={{
                                            mr: 1.5,
                                            position: 'absolute',
                                            left: '50%',
                                            top: 5,
                                            transform: 'translate(0, 0)',
                                        }}
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
    ) : (
        <Typography sx={{ mt: 2, color: AppStyles.colors['#ffa500'] }} align="center">
            No role is available here
        </Typography>
    )
}

export default ChairManageRole
