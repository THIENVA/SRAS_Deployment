import { useState } from 'react'

import { cloneDeep } from 'lodash'

import { Add, Close, Delete } from '@mui/icons-material'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
import TransitionCompo from '~/components/TransitionCompo'

import TrackMenu from './TrackMenu'

import { AppStyles } from '~/constants/colors'

const ChairAddTrack = ({ onClose, open, title, tracks, handleChairModifyUserToRole, roleId, action }) => {
    const [anchorAddTrack, setAnchorAddTrack] = useState(null)
    const openAddRole = Boolean(anchorAddTrack)
    const [tracksAdded, setTrackAdded] = useState(tracks.tracksEngaged)
    const [tracksNotAdded, setTracksNotAdded] = useState(tracks.tracksAvailable)

    const handleOpenAddMenu = (event) => {
        setAnchorAddTrack(event.currentTarget)
    }

    const handleCloseAddMenu = () => {
        setAnchorAddTrack(null)
    }

    const handleTrackChairAddUserToRole = (id) => {
        const updatedTracksAdded = cloneDeep(tracksAdded)
        const track = tracksNotAdded.find((trackNotAdded) => trackNotAdded.trackId === id)
        updatedTracksAdded.push(track)
        const updatedTracksNotAdded = tracksNotAdded.filter((trackNotAdded) => trackNotAdded.trackId !== id)
        setTrackAdded(updatedTracksAdded)
        setTracksNotAdded(updatedTracksNotAdded)
        handleCloseAddMenu()
    }

    const handleTrackChairRemoveUserToRole = (id) => {
        const updatedTracksNotAdded = cloneDeep(tracksNotAdded)
        const track = tracksAdded.find((trackNotAdded) => trackNotAdded.trackId === id)
        updatedTracksNotAdded.push(track)
        const updatedTracksAdded = tracksAdded.filter((trackNotAdded) => trackNotAdded.trackId !== id)
        setTrackAdded(updatedTracksAdded)
        setTracksNotAdded(updatedTracksNotAdded)
        handleCloseAddMenu()
    }

    return (
        <Dialog
            TransitionComponent={TransitionCompo}
            fullWidth
            maxWidth="xs"
            onClose={onClose}
            open={open}
            keepMounted={false}
            sx={{ backdropFilter: 'blur(4px)' }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle>
                    {`${action.charAt(0).toUpperCase()}${action.slice(1)}`} Role: {title}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {action === 'add' ? (
                        <Typography sx={{ color: AppStyles.colors['#ffa500'] }} fontWeight={500}>
                            The role must has at least one track
                        </Typography>
                    ) : (
                        <Typography sx={{ color: AppStyles.colors['#ffa500'] }}>
                            If there is no track at here, the role will be remove
                        </Typography>
                    )}
                    {tracksNotAdded.length > 0 && (
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            size="small"
                            onClick={handleOpenAddMenu}
                            sx={{ mt: 1 }}
                        >
                            add more track
                        </Button>
                    )}
                    {openAddRole && (
                        <TrackMenu
                            open={openAddRole}
                            anchorEl={anchorAddTrack}
                            handleClose={handleCloseAddMenu}
                            tracksNotAdded={tracksNotAdded}
                            handleTrackChairAddUserToRole={handleTrackChairAddUserToRole}
                        />
                    )}
                    {tracksAdded.length !== 0 ? (
                        <TableContainer component={Paper}>
                            <Table
                                sx={{
                                    width: '100%',
                                    border: `1px solid ${AppStyles.colors['#ddd']}`,
                                    borderRadius: 2,
                                    mt: 2,
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
                                            Track
                                        </TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 'bold' }}>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                                    {tracksAdded.map((track) => (
                                        <TableRow
                                            key={track.trackId}
                                            sx={{
                                                'td, th': {
                                                    borderRight: '1px solid #cecdcd',
                                                    py: 1,
                                                    px: 2,
                                                },
                                            }}
                                        >
                                            <TableCell>{track.trackName}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    aria-label="close"
                                                    size="small"
                                                    onClick={() => handleTrackChairRemoveUserToRole(track.trackId)}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography mt={2} align="center">
                            No track is available here
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ py: 1.5 }}>
                    <Button onClick={onClose} variant="contained" color="error" sx={{ mr: 1.5 }}>
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            handleChairModifyUserToRole(roleId, tracksAdded, tracksNotAdded)
                            onClose()
                        }}
                        variant="contained"
                        sx={{ mr: 1.5 }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default ChairAddTrack
