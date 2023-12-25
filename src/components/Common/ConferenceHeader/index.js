import React, { useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'

import { ArrowDropDown, ContactSupport, InboxOutlined } from '@mui/icons-material'
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Toolbar,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'

import CustomNavbar from '../../CustomNavbar'
import ConferenceMenu from './ConferenceMenu'
import MessageMenu from './MessageMenu'
import PCMemberContact from './PCMemberContact'
// import MessageMenu from './MessageMenu'
import RoleMenu from './RoleMenu'
import Time from './Time'
import UserSetting from './UserSetting'
import UsersMenu from './UsersMenu'

import { useClick } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import logo from '~/assets/images/Logo.png'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { chooseConference, resetConferenceRole, switchRole, switchTrack } from '~/features/conference'
import { resetTrackSteps } from '~/features/guidelines'
import { resetMessages } from '~/features/message'
import { resetFirstLoading } from '~/features/track-for-chair'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'
import LocalStorageUtils from '~/utils/LocalStorageUtils'

const ConferenceHeader = () => {
    const { conferenceId } = useParams()
    const { firstName, lastName } = useAppSelector((state) => state.auth)
    const { messages } = useAppSelector((state) => state.messages)
    const {
        rolesTrack,
        roleConference: { roleName },
        trackConference: { trackId },
        tracksConference,
        isSingleTrack,
        conferences,
        conference: { conferenceName, conferenceFullName },
        conferenceStatus,
    } = useAppSelector((state) => state.conference)

    const dispatch = useAppDispatch()
    const history = useHistory()
    const [anchorElUserMenu, setAnchorElUserMenu] = useState(null)
    const [anchorElConferenceMenu, setAnchorElConferenceMenu] = useState(null)
    const [anchorElSettingMenu, setAnchorElSettingMenu] = useState(null)
    const [anchorElMessageMenu, setAnchorElMessageMenu] = useState(null)
    const [openRoleMenu, setOpenRoleMenu] = useState(null)
    const buttonRoleMenuRef = useRef(null)
    const anchorProps = useClick(openRoleMenu, setOpenRoleMenu)
    const open = Boolean(anchorElUserMenu)
    const openConferenceMenu = Boolean(anchorElConferenceMenu)
    const openSettingMenu = Boolean(anchorElSettingMenu)
    const [openMessageMenu, setOpenMenuMessage] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const handleClick = (event) => {
        setAnchorElUserMenu(event.currentTarget)
    }

    const openMessage = (event) => {
        setAnchorElMessageMenu(event.currentTarget)
        setOpenMenuMessage(true)
    }

    const closeMessage = () => {
        setAnchorElMessageMenu(null)
        setOpenMenuMessage(false)
    }

    const handleClose = () => {
        setAnchorElUserMenu(null)
    }

    const openConference = (event) => {
        setAnchorElConferenceMenu(event.currentTarget)
    }

    const closeConference = () => {
        setAnchorElConferenceMenu(null)
    }

    const openUserSetting = (event) => {
        setAnchorElSettingMenu(event.currentTarget)
    }

    const closeUserSetting = () => {
        setAnchorElSettingMenu(null)
    }

    const handleSwitchRole = (roleId, roleConferenceName) => {
        const updatedRoleConference = cloneDeep(LocalStorageUtils.getRoleConference())
        updatedRoleConference.roleConference = { roleId, roleName: roleConferenceName }
        LocalStorageUtils.setRoleConference(updatedRoleConference)
        dispatch(switchRole({ roleConference: { roleId, roleName: roleConferenceName } }))
        if (roleConferenceName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else if (roleConferenceName === ROLES_NAME.REVIEWER) {
            history.push(`/conferences/${conferenceId}/submission/reviewer`)
        } else if (roleConferenceName === ROLES_NAME.TRACK_CHAIR || roleName !== ROLES_NAME.CHAIR) {
            history.push(`/conferences/${conferenceId}/submission/submission-console`)
        }
        if (roleConferenceName === ROLES_NAME.CHAIR || roleConferenceName === ROLES_NAME.TRACK_CHAIR) {
            dispatch(resetTrackSteps())
            dispatch(resetMessages())
        }
    }

    const handleSwitchTrack = (_, { props }) => {
        const updatedRoleConference = cloneDeep(LocalStorageUtils.getRoleConference())
        updatedRoleConference.trackConference = { trackId: props.value, trackName: props.children }
        LocalStorageUtils.setRoleConference(updatedRoleConference)
        dispatch(switchTrack({ trackConference: { trackId: props.value, trackName: props.children } }))
    }

    const handleSwitchConference = (conferenceId, conferenceName, conferenceFullName) => {
        LocalStorageUtils.deleteRole()
        dispatch(chooseConference({ conference: { conferenceId, conferenceName, conferenceFullName } }))
        dispatch(resetFirstLoading())
        dispatch(resetConferenceRole())
        history.push(`/conferences/redirect/${conferenceId}`)
    }

    const popoverId = openMessageMenu ? 'simple-popover' : undefined

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }
    return (
        <AppBar position="fixed">
            {openModal && <PCMemberContact open={openModal} handleClose={handleCloseModal} />}
            <Toolbar disableGutters variant="dense">
                <Container maxWidth="xl">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                            <Box
                                onClick={() => history.push('/conferences')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: 0.5,
                                    cursor: 'pointer',
                                    mr: 1,
                                }}
                            >
                                <Box>
                                    <Avatar sx={{ height: 50, width: 114 }} src={logo} alt="logo" variant="square" />
                                </Box>
                            </Box>
                            {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && (
                                <CustomNavbar
                                    to={`/conferences/${conferenceId}/dashboard`}
                                    style={{ fontSize: 16, fontFamily: 'sans-serif' }}
                                >
                                    Dashboard
                                </CustomNavbar>
                            )}
                            {(roleName === ROLES_NAME.TRACK_CHAIR ||
                                roleName === ROLES_NAME.CHAIR ||
                                roleName === ROLES_NAME.AUTHOR ||
                                roleName === ROLES_NAME.REVIEWER) && (
                                <CustomNavbar
                                    to={`/conferences/${conferenceId}/submission/${
                                        roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR
                                            ? 'submission-console'
                                            : roleName === ROLES_NAME.AUTHOR
                                            ? 'author'
                                            : 'reviewer'
                                    }`}
                                    style={{ fontSize: 16, ml: 1, fontFamily: 'sans-serif' }}
                                >
                                    {roleName === ROLES_NAME.REVIEWER && 'Assigned'} Submission
                                </CustomNavbar>
                            )}
                            {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && (
                                <CustomNavbar
                                    to={`/conferences/${conferenceId}/manuscript`}
                                    style={{ fontSize: 16, ml: 1, fontFamily: 'sans-serif' }}
                                >
                                    Manuscripts
                                </CustomNavbar>
                            )}
                            {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && (
                                <Button
                                    size="large"
                                    sx={{
                                        mx: 1,
                                        color: (theme) =>
                                            `${open ? theme.palette.primary.main : AppStyles.colors['#F7F7F7']}`,
                                        backgroundColor: (theme) =>
                                            `${open ? AppStyles.colors['#F7F7F7'] : theme.palette.primary.main}`,
                                        textTransform: 'none',
                                        fontSize: 16,
                                    }}
                                    onClick={handleClick}
                                    endIcon={<ArrowDropDown />}
                                >
                                    Users
                                </Button>
                            )}
                            {open && <UsersMenu anchorEl={anchorElUserMenu} open={open} handleClose={handleClose} />}
                            {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && (
                                <CustomNavbar
                                    to={`/conferences/${conferenceId}/settings/paper-status`}
                                    style={{ fontSize: 16, fontFamily: 'sans-serif' }}
                                >
                                    Settings
                                </CustomNavbar>
                            )}
                            {roleName === ROLES_NAME.REVIEWER && (
                                <CustomNavbar
                                    to={`/conferences/${conferenceId}/my-reviewing`}
                                    style={{ fontSize: 16, ml: 1, fontFamily: 'sans-serif' }}
                                >
                                    Settings
                                </CustomNavbar>
                            )}
                            {roleName === ROLES_NAME.AUTHOR && (
                                <CustomNavbar
                                    to={`/conferences/${conferenceId}/my-registration`}
                                    style={{ fontSize: 16, ml: 1, fontFamily: 'sans-serif' }}
                                >
                                    My Registration
                                </CustomNavbar>
                            )}
                        </Box>
                        <Box display="flex" alignItems="center">
                            {!(roleName === ROLES_NAME.TRACK_CHAIR) ? null : (
                                <Box display="flex" sx={{ mr: 2 }} alignItems="center">
                                    {!isSingleTrack && (
                                        <React.Fragment>
                                            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Track:</Typography>
                                            <FormControl
                                                sx={{
                                                    ml: 2,
                                                    minWidth: 150,
                                                    maxWidth: 200,
                                                    '& .MuiInputBase-formControl': {
                                                        height: 35,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: `${AppStyles.colors['#F7F7F7']} !important`,
                                                    },
                                                    '& .MuiInputLabel-formControl': {
                                                        color: AppStyles.colors['#F7F7F7'],
                                                    },
                                                    '& .Mui-focused': {
                                                        color: `${AppStyles.colors['#F7F7F7']} !important`,
                                                    },
                                                    '& .MuiSelect-select': {
                                                        color: AppStyles.colors['#F7F7F7'],
                                                    },
                                                    '& .MuiSelect-icon': {
                                                        color: AppStyles.colors['#F7F7F7'],
                                                    },
                                                }}
                                                size="small"
                                            >
                                                <Select value={trackId} onChange={handleSwitchTrack}>
                                                    {tracksConference.map((track) => (
                                                        <MenuItem
                                                            key={track.id}
                                                            value={track.id}
                                                            sx={{ fontWeight: trackId === track.id && 'bold' }}
                                                        >
                                                            {track.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </React.Fragment>
                                    )}
                                </Box>
                            )}
                            <Tooltip title="Reminder" TransitionComponent={Zoom} placement="bottom">
                                <IconButton onClick={openMessage} sx={{}}>
                                    <Badge badgeContent={messages.length} color="error" variant="dot">
                                        <InboxOutlined sx={{ color: AppStyles.colors['#EFEFEF'] }} />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            {(roleName === 'Author' || roleName === 'Reviewer') && (
                                <Tooltip title="PC Member Contacts" TransitionComponent={Zoom} placement="bottom">
                                    <IconButton onClick={handleOpenModal} sx={{ mr: 1 }}>
                                        <ContactSupport sx={{ color: AppStyles.colors['#EFEFEF'] }} />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {openMessageMenu && (
                                <MessageMenu
                                    anchorEl={anchorElMessageMenu}
                                    open={openMessageMenu}
                                    handleClose={closeMessage}
                                    popoverId={popoverId}
                                    messages={messages}
                                />
                            )}
                            <Typography sx={{ fontSize: 15, fontWeight: 'bold', mr: 1 }}>Your Role:</Typography>
                            {roleName && (
                                <Button
                                    sx={{
                                        mr: 1,
                                        color:
                                            roleName === 'Chair'
                                                ? '#d84315'
                                                : roleName === 'Track Chair'
                                                ? '#1b5e20'
                                                : roleName === 'Author'
                                                ? '#af861f'
                                                : '#607D8B',
                                        backgroundColor:
                                            roleName === 'Chair'
                                                ? '#fff5e6'
                                                : roleName === 'Track Chair'
                                                ? '#ecf7ed'
                                                : roleName === 'Author'
                                                ? '#fffdeb'
                                                : '#F5F5F5',
                                        ':hover': {
                                            opacity: 1,
                                            color:
                                                roleName === 'Chair'
                                                    ? '#d84315'
                                                    : roleName === 'Track Chair'
                                                    ? '#1b5e20'
                                                    : roleName === 'Author'
                                                    ? '#af861f'
                                                    : '#607D8B',
                                            backgroundColor:
                                                roleName === 'Chair'
                                                    ? '#ffe6c1'
                                                    : roleName === 'Track Chair'
                                                    ? '#d3ebd3'
                                                    : roleName === 'Author'
                                                    ? '#fff9c4'
                                                    : '#F5F5F5',
                                        },
                                        fontWeight: 'bold',
                                        fontSize: 15,
                                        textAlign: 'center',
                                    }}
                                    endIcon={<ArrowDropDown />}
                                    ref={buttonRoleMenuRef}
                                    {...anchorProps}
                                >
                                    {roleName}
                                </Button>
                            )}

                            {openRoleMenu && (
                                <RoleMenu
                                    open={openRoleMenu}
                                    onClose={() => setOpenRoleMenu(false)}
                                    anchorRef={buttonRoleMenuRef}
                                    rolesTrack={rolesTrack}
                                    handleSwitchRole={handleSwitchRole}
                                    roleName={roleName}
                                />
                            )}
                            {openConferenceMenu && (
                                <ConferenceMenu
                                    anchorEl={anchorElConferenceMenu}
                                    open={openConferenceMenu}
                                    handleClose={closeConference}
                                    conferences={conferences}
                                    handleSwitchConference={handleSwitchConference}
                                    conferenceName={conferenceName}
                                />
                            )}
                            <Box display="flex" justifyContent="center">
                                <Divider
                                    orientation="vertical"
                                    sx={{
                                        height: 30,
                                        backgroundColor: '#dee2e6',
                                        opacity: 0.5,
                                        mx: 1,
                                    }}
                                />
                            </Box>

                            <Box>
                                <Button
                                    sx={{
                                        color: (theme) =>
                                            `${
                                                openSettingMenu
                                                    ? theme.palette.primary.main
                                                    : AppStyles.colors['#F7F7F7']
                                            }`,
                                        backgroundColor: (theme) =>
                                            `${
                                                openSettingMenu
                                                    ? AppStyles.colors['#F7F7F7']
                                                    : theme.palette.primary.main
                                            }`,
                                        textTransform: 'none',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                    }}
                                    onClick={openUserSetting}
                                    endIcon={<ArrowDropDown />}
                                >
                                    {firstName} {lastName}
                                </Button>
                                {openSettingMenu && (
                                    <UserSetting
                                        open={openSettingMenu}
                                        anchorEl={anchorElSettingMenu}
                                        handleClose={closeUserSetting}
                                        conferenceName={conferenceName}
                                        roleName={roleName}
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Time
                        conferenceFullName={conferenceFullName}
                        conferenceName={conferenceName}
                        conferenceStatus={conferenceStatus}
                        openConferenceMenu={openConferenceMenu}
                        openConference={openConference}
                    />
                </Container>
            </Toolbar>
        </AppBar>
    )
}

export default ConferenceHeader
