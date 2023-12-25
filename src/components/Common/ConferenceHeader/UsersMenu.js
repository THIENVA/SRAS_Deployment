import { useHistory, useParams } from 'react-router-dom'

import { Menu, MenuItem, Typography } from '@mui/material'

const UsersMenu = ({ anchorEl, handleClose, open }) => {
    const { conferenceId } = useParams()
    const history = useHistory()

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
            <MenuItem
                sx={{
                    display: 'flex',
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
                onClick={() => history.push(`/conferences/${conferenceId}/manage-conference-users`)}
            >
                <Typography px={1} ml={1}>
                    Conference User
                </Typography>
            </MenuItem>
            <MenuItem
                sx={{
                    display: 'flex',
                }}
                onClick={() => history.push(`/conferences/${conferenceId}/invite-reviewer`)}
            >
                <Typography px={1} ml={1}>
                    Invite Reviewer
                </Typography>
            </MenuItem>
            <MenuItem
                sx={{
                    display: 'flex',
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
                onClick={() => history.push(`/conferences/${conferenceId}/manage-reviewer-invite`)}
            >
                <Typography px={1} ml={1}>
                    Manage Reviewer Invite
                </Typography>
            </MenuItem>

            <MenuItem
                sx={{
                    display: 'flex',
                }}
                onClick={() => history.push(`/conferences/${conferenceId}/manage-reviewers`)}
            >
                <Typography px={1} ml={1}>
                    Manage Reviewer
                </Typography>
            </MenuItem>
        </Menu>
    )
}

export default UsersMenu
