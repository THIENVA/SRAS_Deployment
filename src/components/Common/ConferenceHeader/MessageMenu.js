import React from 'react'

import { v4 as uuid } from 'uuid'

import { Cancel } from '@mui/icons-material'
import { Avatar, Box, IconButton, Popover, Tooltip, Typography, Zoom } from '@mui/material'
import SyncComponent from '~/components/SyncComponent'

import MegaPhoneIcon from '~/assets/images/mega-phone-icon.png'
import { syncMessage } from '~/features/message'
import { useAppDispatch } from '~/hooks/redux-hooks'

const MessageMenu = ({ anchorEl, handleClose, open, popoverId, messages }) => {
    const dispatch = useAppDispatch()
    return (
        <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            PaperProps={{
                sx: {
                    maxWidth: 600,
                    maxHeight: 350,
                    overflow: 'auto',
                },
            }}
        >
            <Box sx={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.08)' }}>
                <Box display="flex" justifyContent="space-between" mt={1} alignItems="center" mx={2}>
                    <Box display="flex" alignItems="center">
                        <Typography sx={{ fontSize: 16, color: '#39739d' }}>Reminding Messages</Typography>
                        <SyncComponent
                            setSync={() => {
                                dispatch(syncMessage(uuid()))
                            }}
                        />
                    </Box>
                    <Tooltip placement="top-start" title="Close" TransitionComponent={Zoom}>
                        <IconButton size="small" sx={{ opacity: 0.7 }} disableRipple onClick={() => handleClose()}>
                            <Cancel fontSize="large" />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Box>
                {messages.length > 0 ? (
                    messages.map((item, index) => (
                        <React.Fragment key={index}>
                            <Box
                                display="flex"
                                alignItems="flex-start"
                                sx={{ borderBottom: '1px solid #ada8a852' }}
                                mt={2}
                                px={2}
                            >
                                <Avatar
                                    alt="mega-phone-icon"
                                    src={MegaPhoneIcon}
                                    variant="circular"
                                    sx={{ width: 60, height: 60 }}
                                />
                                <Typography sx={{ ml: 2 }} gutterBottom>
                                    {item}
                                </Typography>
                            </Box>
                        </React.Fragment>
                    ))
                ) : (
                    <Typography my={2} align="center" variant="h6">
                        There is no message now.
                    </Typography>
                )}
            </Box>
        </Popover>
    )
}

export default MessageMenu
