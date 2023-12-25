import React, { useState } from 'react'

import { Link, useHistory } from 'react-router-dom'

import { AccountCircle, ArrowDropDown, Logout } from '@mui/icons-material'
import {
    AppBar,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material'

import PrimaryEmailModal from '../PrimaryEmailModal'

import useAuth from '~/api/common/auth'
import useProfile from '~/api/common/profile'
import logo from '~/assets/images/Logo.png'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const Header = () => {
    const history = useHistory()
    const { logoutHandler } = useAuth()
    const { email, firstName, lastName, userId } = useAppSelector((state) => state.auth)
    const { checkHasProfile } = useProfile()
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const [openPrimaryEmail, setOpenPrimaryEmail] = useState(false)
    const [loading, setLoading] = useState(false)

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleClickLogout = () => {
        logoutHandler()
    }

    return (
        <React.Fragment>
            <AppBar position="fixed">
                <Toolbar disableGutters variant="dense">
                    <Container
                        sx={{
                            display: 'flex',
                            // justifyContent: `${email ? 'space-between' : 'flex-end'}`,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        maxWidth="xl"
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                py: 0.5,
                            }}
                        >
                            <Link to="/">
                                <Box>
                                    <Avatar sx={{ height: 50, width: 114 }} src={logo} alt="logo" variant="square" />
                                </Box>
                            </Link>
                        </Box>

                        {!email ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    '& > .active > span': {
                                        color: AppStyles.colors['#004DFF'],
                                    },
                                }}
                            >
                                <Box
                                    component={Link}
                                    to="/login"
                                    sx={{
                                        textDecoration: 'none',
                                        position: 'relative',
                                        fontFamily: 'Roboto',
                                        color: AppStyles.colors['#F7F7F7'],
                                        ':hover': {
                                            color: AppStyles.colors['#F7F7F7'],
                                            opacity: 0.75,
                                        },
                                    }}
                                >
                                    <Typography component="span" variant="h6">
                                        Log in
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <React.Fragment>
                                <Button
                                    sx={{
                                        color: (theme) =>
                                            `${open ? theme.palette.primary.main : AppStyles.colors['#F7F7F7']}`,
                                        backgroundColor: (theme) =>
                                            `${open ? AppStyles.colors['#F7F7F7'] : theme.palette.primary.main}`,
                                        textTransform: 'none',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                    }}
                                    onClick={handleClick}
                                    endIcon={<ArrowDropDown />}
                                >
                                    {firstName} {lastName}
                                </Button>

                                {open && (
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
                                        <MenuItem sx={{ display: 'flex', pr: 5 }} onClick={handleClickLogout}>
                                            <ListItemIcon>
                                                <Logout fontSize="medium" />
                                            </ListItemIcon>
                                            <Typography>Log out</Typography>
                                        </MenuItem>
                                    </Menu>
                                )}
                            </React.Fragment>
                        )}
                    </Container>
                </Toolbar>
            </AppBar>
            {openPrimaryEmail && <PrimaryEmailModal open={openPrimaryEmail} handleClose={handleClosePrimaryModal} />}
        </React.Fragment>
    )
}

export default Header
