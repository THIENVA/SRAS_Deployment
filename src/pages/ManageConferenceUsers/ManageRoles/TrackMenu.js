import { cloneDeep } from 'lodash'

import { Menu, MenuItem, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const TrackMenu = ({ anchorEl, handleClose, open, tracksNotAdded, handleTrackChairAddUserToRole }) => {
    const cloneTracksNotAdded = cloneDeep(tracksNotAdded)

    if (Array.isArray(cloneTracksNotAdded)) cloneTracksNotAdded.sort((a, b) => a.trackName.localeCompare(b.trackName))
    return (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1,
                    px: 3,
                    pb: 1,
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {tracksNotAdded.map((track) => (
                <MenuItem
                    sx={{
                        display: 'flex',
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                    key={track.trackId}
                    onClick={() => handleTrackChairAddUserToRole(track.trackId)}
                >
                    <Typography ml={1}>{track.trackName}</Typography>
                </MenuItem>
            ))}
            {tracksNotAdded.length === 0 && (
                <MenuItem
                    sx={{
                        display: 'flex',
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                >
                    <Typography ml={1}>None</Typography>
                </MenuItem>
            )}
        </Menu>
    )
}

export default TrackMenu
