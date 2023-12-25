import { useHistory } from 'react-router-dom'

import { Divider, Menu, MenuItem, Typography } from '@mui/material'

const ConferenceMenu = ({ anchorEl, handleClose, open, conferences, handleSwitchConference, conferenceName }) => {
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
                    maxHeight: 350,
                    overflowY: 'auto',
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem
                sx={{
                    display: 'flex',
                }}
                onClick={() => history.push('/conferences')}
            >
                <Typography px={1}>Conferences</Typography>
            </MenuItem>
            <Divider />
            {conferences.map((conference, index) => (
                <MenuItem
                    sx={{
                        display: 'flex',
                    }}
                    onClick={() => handleSwitchConference(conference.id, conference.shortName, conference.name)}
                    key={index}
                >
                    <Typography px={1} sx={{ fontWeight: conferenceName === conference.shortName && 'bold' }}>
                        {conference.shortName}
                    </Typography>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default ConferenceMenu
