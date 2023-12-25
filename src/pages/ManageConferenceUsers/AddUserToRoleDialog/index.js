import React, { useEffect, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Close, Search } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import { grey, red } from '@mui/material/colors'
import TransitionCompo from '~/components/TransitionCompo'

import ManageRoles from '../ManageRoles'

import { useAddUserMutation } from '~/api/common/RTKQuery/ManagingUser'
import { useUser } from '~/api/common/user'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const AddUserToRoleDialog = ({ open, title, onClose, searchEmail = '', setUnique }) => {
    const {
        trackConference: { trackId },
        roleConference: { roleName },
        conference: { conferenceId },
    } = useAppSelector((state) => state.conference)
    const [email, setEmail] = useState(searchEmail)
    // const showSnackbar = useSnackbar()
    const [searchUser, setSearchUser] = useState({ user: null, isExistedAccount: null })
    const [addUser] = useAddUserMutation()
    const [loading, setLoading] = useState(false)
    const [submittedLoading, setSubmittedLoading] = useState(false)
    const { getUserByEmail } = useUser()
    const [user, setUser] = useState(null)

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
        if (searchUser.isExistedAccount === false) {
            setSearchUser({ user: null, isExistedAccount: null })
        }
    }

    const handleSearchUser = () => {
        setLoading(true)
        getUserByEmail(email)
            .then((response) => {
                const user = response.data
                if (user) {
                    setSearchUser({ user, isExistedAccount: true })
                } else {
                    setSearchUser({ user: null, isExistedAccount: false })
                }
                setEmail('')
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleAddRoleSubmit = () => {
        setSubmittedLoading(true)
        let userRoles = null
        if (roleName === ROLES_NAME.TRACK_CHAIR) {
            const roles = user.roles.map((role) => ({ trackId, roleId: role.roleId }))
            userRoles = {
                accountId: user.id,
                conferenceId,
                trackId,
                roles,
            }
        } else if (roleName === ROLES_NAME.CHAIR) {
            const roles = []
            user.roles.forEach((role) => {
                if (role.roleName === ROLES_NAME.CHAIR) roles.push({ trackId: null, roleId: role.roleId })
                else {
                    role.tracks.tracksEngaged.forEach((track) => {
                        roles.push({ trackId: track.trackId, roleId: role.roleId })
                    })
                }
            })
            userRoles = {
                accountId: user.id,
                conferenceId,
                trackId: null,
                roles,
            }
        }

        addUser(userRoles)
            .then(() => {
                setUnique(uuid())
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Add user to conference successfully.',
                // })
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setSubmittedLoading(false)
                onClose()
            })
    }

    useEffect(() => {
        if (searchEmail) {
            setLoading(true)
            getUserByEmail(email)
                .then((response) => {
                    const user = response.data
                    if (user) {
                        setSearchUser({ user, isExistedAccount: true })
                    } else {
                        setSearchUser({ user: null, isExistedAccount: false })
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchEmail])

    return (
        <Dialog
            TransitionComponent={TransitionCompo}
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            keepMounted={false}
            sx={{ backdropFilter: 'blur(4px)' }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle>
                    {title}
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
                    <Box display="flex" alignItems="center" component="form">
                        <TextField
                            placeholder="Email"
                            inputProps={{ type: 'email' }}
                            value={email}
                            size="small"
                            onChange={handleEmailChange}
                            sx={{ minWidth: 300 }}
                        />
                        <LoadingButton
                            variant="contained"
                            startIcon={<Search />}
                            size="medium"
                            disabled={loading}
                            loadingPosition="start"
                            loading={loading}
                            sx={{ ml: 1 }}
                            onClick={handleSearchUser}
                        >
                            Search
                        </LoadingButton>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5, color: grey[500] }}>
                        Enter email of a registered user
                    </Typography>
                    {searchUser.user && (
                        <React.Fragment>
                            <ManageRoles userId={searchUser.user.id} setUser={setUser} user={user} />
                        </React.Fragment>
                    )}
                    {searchUser.user === null && searchUser.isExistedAccount === false && (
                        <Typography sx={{ color: red[500], mt: 1 }}>
                            User with email {email} was not found. A registered account is needed for this operation
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ py: 1.5 }}>
                    <Button onClick={onClose} variant="contained" color="error">
                        Close
                    </Button>
                    <LoadingButton
                        loading={submittedLoading}
                        disabled={submittedLoading}
                        onClick={handleAddRoleSubmit}
                        variant="contained"
                        sx={{ ml: 1.5 }}
                    >
                        Save Changes
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default AddUserToRoleDialog
