import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'

import { Add } from '@mui/icons-material'
import { Box, Button, CircularProgress, Typography } from '@mui/material'

import ChairAddTrack from './ChairAddTrack'
import ChairManageRole from './ChairManageRole'
import RoleMenu from './RoleMenu'
import TrackChairManageRole from './TrackChairManageRole'
import UserInfo from './UserInfo'

import { useConferenceRole } from '~/api/common/roles'
import { useTrack } from '~/api/common/track'
import { useUser } from '~/api/common/user'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ManageRoles = ({ userId, user, setUser }) => {
    const {
        trackConference: { trackName, trackId },
        roleConference: { roleName },
        conference: { conferenceId },
    } = useAppSelector((state) => state.conference)
    const { getUserRole } = useUser()
    const { getAllTrack } = useTrack()
    const { getAllRoles } = useConferenceRole()
    const [anchorAddRole, setAnchorAddRole] = useState(null)
    const copyRoles = useRef(null)
    const copyTracksAvailable = useRef([])
    const [openChairManageRole, setOpenChairManageRole] = useState({
        open: false,
        roleSelectedId: null,
        roleSelectedName: null,
    })
    const [roleConferenceSelected, setRoleConferenceSelected] = useState(null)
    const chairTracksAction = useRef('add')
    const openAddRole = Boolean(anchorAddRole)
    const [loading, setLoading] = useState(true)

    const handleOpenAddMenu = (event) => {
        setAnchorAddRole(event.currentTarget)
    }

    const handleCloseAddMenu = () => {
        setAnchorAddRole(null)
    }

    const handleTrackChairAddUserToRole = (id) => {
        const updatedUser = cloneDeep(user)
        const role = user.rolesNotAdded.find((roleNotAdded) => roleNotAdded.roleId === id)
        updatedUser.roles.push(role)
        updatedUser.rolesNotAdded = user.rolesNotAdded.filter((roleNotAdded) => roleNotAdded.roleId !== id)
        setUser(updatedUser)
        handleCloseAddMenu()
    }

    const handleTrackChairRemoveUserToRole = (id) => {
        const updatedUser = cloneDeep(user)
        const role = user.roles.find((roleAvailable) => roleAvailable.roleId === id)
        updatedUser.rolesNotAdded.push(role)
        updatedUser.roles = updatedUser.roles.filter((roleAvailable) => roleAvailable.roleId !== id)
        setUser(updatedUser)
        handleCloseAddMenu()
    }

    const handleChairModifyUserToRole = (roleId, tracksAdded, tracksNotAdded) => {
        const updatedUser = cloneDeep(user)
        let role = null
        if (chairTracksAction.current === 'add')
            role = user.rolesNotAdded.find((roleAvailable) => roleAvailable.roleId === roleId)
        else if (chairTracksAction.current === 'edit')
            role = user.roles.find((roleAvailable) => roleAvailable.roleId === roleId)
        role.tracks.tracksEngaged = tracksAdded.slice(0)
        role.tracks.tracksAvailable = tracksNotAdded.slice(0)
        const updatedRole = cloneDeep(role)
        if (updatedRole.tracks.tracksEngaged.length === 0) {
            updatedUser.roles = updatedUser.roles.filter((roleConference) => roleConference.roleId !== roleId)
            const roleDeleted = copyRoles.current.find((role) => role.roleId === roleId)
            const cloneRoleDeleted = cloneDeep(roleDeleted)
            cloneRoleDeleted.tracks = new Object()
            cloneRoleDeleted.tracks.tracksEngaged = new Array()
            cloneRoleDeleted.tracks.tracksAvailable = cloneDeep(copyTracksAvailable.current)
            updatedUser.rolesNotAdded.push(cloneRoleDeleted)
        } else {
            if (chairTracksAction.current === 'add') {
                updatedUser.roles.push(updatedRole)
                updatedUser.rolesNotAdded = user.rolesNotAdded.filter((roleNotAdded) => roleNotAdded.roleId !== roleId)
            } else if (chairTracksAction.current === 'edit') {
                const position = updatedUser.roles.findIndex((roleConference) => roleConference.roleId === roleId)
                updatedUser.roles.splice(position, 1, updatedRole)
            }
        }
        setUser(updatedUser)
    }

    const handleChairRemoveUserToRole = (roleId) => {
        const updatedUser = cloneDeep(user)
        const roleDeleted = copyRoles.current.find((role) => role.roleId === roleId)
        const cloneRoleDeleted = cloneDeep(roleDeleted)
        updatedUser.roles = updatedUser.roles.filter((role) => role.roleId !== roleId)
        cloneRoleDeleted.tracks = new Object()
        cloneRoleDeleted.tracks.tracksEngaged = new Array()
        cloneRoleDeleted.tracks.tracksAvailable = cloneDeep(copyTracksAvailable.current)
        updatedUser.rolesNotAdded.push(cloneRoleDeleted)
        setUser(updatedUser)
    }

    const handleOpenChairManager = (roleId, roleSelectedName, action) => {
        let role = null
        if (action === 'chair-add') {
            role = user.rolesNotAdded.find((roleConference) => roleConference.roleId === roleId)
            chairTracksAction.current = 'add'
        } else {
            role = user.roles.find((roleConference) => roleConference.roleId === roleId)
            chairTracksAction.current = 'edit'
        }
        const updatedRole = cloneDeep(role)
        if (roleSelectedName === ROLES_NAME.CHAIR) {
            const updatedUser = cloneDeep(user)
            updatedRole.tracks = new Object()
            updatedRole.tracks.tracksEngaged = new Array()
            updatedRole.tracks.tracksAvailable = new Array()
            updatedUser.roles.push(updatedRole)
            updatedUser.rolesNotAdded = user.rolesNotAdded.filter((roleNotAdded) => roleNotAdded.roleId !== roleId)
            setUser(updatedUser)
        } else {
            setRoleConferenceSelected(updatedRole)
            setOpenChairManageRole({ open: true, roleSelectedId: roleId, roleSelectedName })
        }
        handleCloseAddMenu()
    }

    const handleCloseChairManager = () => {
        setOpenChairManageRole({ open: false, roleSelectedId: null, roleSelectedName: null })
        setRoleConferenceSelected(null)
    }

    useEffect(() => {
        setLoading(true)
        const firstController = new AbortController()
        const secondController = new AbortController()
        const thirdController = new AbortController()
        const getTrackId = roleName === ROLES_NAME.CHAIR ? null : trackId

        const userRoleInfoGet = getUserRole(userId, conferenceId, getTrackId, firstController.signal)
        const allTrackGet = getAllTrack(conferenceId, secondController.signal)
        const allRole = getAllRoles(thirdController.signal)

        Promise.all([userRoleInfoGet, allTrackGet, allRole])
            .then((response) => {
                const getUser = response[0].data
                let { tracks } = response[1].data
                let roles = response[2].data
                tracks = tracks.map((track) => ({ ...track, trackId: track.id, trackName: track.name }))
                roles = roles.map((role) => ({ ...role, roleId: role.id, roleName: role.name }))

                if (getUser.roles !== null) {
                    const formatUser = getUser.roles.map((role) => {
                        if (role.roleName === ROLES_NAME.CHAIR) return { ...role, engagedTracks: new Array() }
                        return { ...role }
                    })

                    getUser.roles = cloneDeep(formatUser)
                    let rolesNotAdded = roles
                        .filter((role) => !getUser.roles.some((item) => item.roleId === role.id))
                        .filter((role) => role.factor !== 4)
                    if (roleName === ROLES_NAME.TRACK_CHAIR)
                        rolesNotAdded = rolesNotAdded.filter((role) => role.factor !== 1)

                    rolesNotAdded = rolesNotAdded.map((role) => {
                        if (role.name === ROLES_NAME.CHAIR) role.tracks = null
                        else {
                            role.tracks = new Object()
                            role.tracks.tracksEngaged = new Array()
                            role.tracks.tracksAvailable = [...tracks]
                        }
                        return role
                    })
                    getUser.roles.forEach((role) => {
                        if (role.name === ROLES_NAME.CHAIR) role.tracks = null
                        else {
                            const tracksAvailable = tracks.filter(
                                (track) => !role.engagedTracks.some((item) => item.trackId === track.id)
                            )
                            role.tracks = new Object()
                            role.tracks.tracksAvailable = tracksAvailable
                            role.tracks.tracksEngaged = cloneDeep(role.engagedTracks)
                        }
                    })
                    getUser.rolesNotAdded = rolesNotAdded
                } else {
                    getUser.roles = new Array()
                    let rolesNotAdded = [...roles].slice(0)
                    if (roleName === ROLES_NAME.CHAIR) rolesNotAdded = rolesNotAdded.filter((role) => role.factor !== 4)
                    else if (roleName === ROLES_NAME.TRACK_CHAIR)
                        rolesNotAdded = rolesNotAdded.filter((role) => role.factor !== 4 && role.factor !== 1)
                    rolesNotAdded.forEach((role) => {
                        if (role.roleName === ROLES_NAME.CHAIR) role.tracks = null
                        else {
                            const cloneTracksAvailable = cloneDeep(tracks)
                            role.tracks = new Object()
                            role.tracks.tracksEngaged = new Array()
                            role.tracks.tracksAvailable = new Array()
                            cloneTracksAvailable.forEach((track) => {
                                role.tracks.tracksAvailable.push(track)
                            })
                        }
                    })
                    getUser.rolesNotAdded = rolesNotAdded
                }

                const cloneGetUser = cloneDeep(getUser)
                setUser(cloneGetUser)
                copyRoles.current = [...roles]
                copyTracksAvailable.current = [...tracks]
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setLoading(false)
            })
        return () => {
            firstController.abort()
            secondController.abort()
            thirdController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])

    return (
        <Box sx={{ mt: 2 }}>
            {loading ? (
                <Box py={2} display="flex" alignItems="center" justifyContent="center">
                    <CircularProgress />
                </Box>
            ) : (
                <React.Fragment>
                    {user && (
                        <React.Fragment>
                            <Typography gutterBottom variant="h6">
                                User Information
                            </Typography>
                            <UserInfo
                                email={user.email}
                                organization={user.organization}
                                fullName={`${user.firstName} ${user.lastName}`}
                            />
                        </React.Fragment>
                    )}
                    {roleName === ROLES_NAME.TRACK_CHAIR ? (
                        <React.Fragment>
                            <Typography gutterBottom mt={3} variant="h6">
                                Roles
                            </Typography>
                            <TrackChairManageRole
                                user={user}
                                handleRemoveUserToRole={handleTrackChairRemoveUserToRole}
                                trackName={trackName}
                            />
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography gutterBottom mt={3} variant="h6">
                                Roles
                            </Typography>
                            <ChairManageRole
                                user={user}
                                handleOpenChairManager={handleOpenChairManager}
                                handleChairRemoveUserToRole={handleChairRemoveUserToRole}
                            />
                        </React.Fragment>
                    )}
                    {user?.rolesNotAdded.length > 0 && (
                        <Button
                            sx={{ mt: 2 }}
                            startIcon={<Add />}
                            onClick={handleOpenAddMenu}
                            size="small"
                            variant="contained"
                        >
                            Add Role
                        </Button>
                    )}
                    {openAddRole && (
                        <RoleMenu
                            anchorEl={anchorAddRole}
                            open={openAddRole}
                            handleClose={handleCloseAddMenu}
                            rolesNotAdded={user.rolesNotAdded}
                            handleAddUserToRole={handleTrackChairAddUserToRole}
                            roleName={roleName}
                            handleOpenChairManager={handleOpenChairManager}
                        />
                    )}
                    {openChairManageRole.open && (
                        <ChairAddTrack
                            onClose={handleCloseChairManager}
                            title={openChairManageRole.roleSelectedName}
                            open={openChairManageRole.open}
                            tracks={roleConferenceSelected.tracks}
                            handleChairModifyUserToRole={handleChairModifyUserToRole}
                            roleId={roleConferenceSelected.roleId}
                            action={chairTracksAction.current}
                        />
                    )}
                </React.Fragment>
            )}
        </Box>
    )
}

export default ManageRoles
