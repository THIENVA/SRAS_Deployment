import React, { Fragment, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { AccountCircle, Email, Logout } from '@mui/icons-material'
import { Box, CircularProgress, Divider, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import PrimaryEmailModal from '~/components/PrimaryEmailModal'

import useAuth from '~/api/common/auth'
import useProfile from '~/api/common/profile'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const UserSetting = ({ anchorEl, handleClose, open, conferenceName, roleName }) => {
    const { conferenceId } = useParams()
    const { logoutHandler } = useAuth()
    const { userId } = useAppSelector((state) => state.auth)
    const { checkHasProfile } = useProfile()
    const history = useHistory()
    const [openPrimaryEmail, setOpenPrimaryEmail] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClickLogout = () => {
        logoutHandler()
    }

    const handleCheckHasProfile = () => {
        setLoading(true)
        checkHasProfile(userId)
            .then((response) => {
                const hasProfile = response.data
                if (!hasProfile) {
                    setOpenPrimaryEmail(true)
                } else {
                    history.push('/scientist-profile')
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleClosePrimaryModal = () => setOpenPrimaryEmail(false)

    return (
        <React.Fragment>
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
                {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && (
                    <Fragment>
                        <Box py={0.5} sx={{ backgroundColor: AppStyles.colors['#EEF2FF'] }}>
                            <Typography textAlign={'center'}>{conferenceName}</Typography>
                        </Box>
                        <MenuItem
                            sx={{
                                display: 'flex',
                                pr: 5,
                            }}
                            onClick={() => history.push(`/conferences/${conferenceId}/email-history`)}
                        >
                            <ListItemIcon>
                                <Email fontSize="medium" />
                            </ListItemIcon>
                            <Typography>Email History</Typography>
                        </MenuItem>
                    </Fragment>
                )}
                <Box py={0.5} sx={{ backgroundColor: AppStyles.colors['#EEF2FF'] }}>
                    <Typography textAlign={'center'}>General</Typography>
                </Box>
                <MenuItem
                    sx={{
                        display: 'flex',
                        pr: 5,
                    }}
                    onClick={handleCheckHasProfile}
                >
                    <ListItemIcon>
                        {loading ? (
                            <CircularProgress sx={{ color: '#bfc2c4' }} size={20} />
                        ) : (
                            <AccountCircle fontSize="medium" />
                        )}
                    </ListItemIcon>
                    <Typography>Scientist profile</Typography>
                </MenuItem>

                <Divider />
                <MenuItem
                    sx={{
                        display: 'flex',
                        pr: 5,
                    }}
                    onClick={handleClickLogout}
                >
                    <ListItemIcon>
                        <Logout fontSize="medium" />
                    </ListItemIcon>
                    <Typography>Log out</Typography>
                </MenuItem>
            </Menu>
            {openPrimaryEmail && <PrimaryEmailModal open={openPrimaryEmail} handleClose={handleClosePrimaryModal} />}
        </React.Fragment>
    )
}

export default UserSetting
