import { useState } from 'react'

import { Close } from '@mui/icons-material'
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

import TransitionCompo from '../TransitionCompo'
import InputLayout from './InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { useAppSelector } from '~/hooks/redux-hooks'
import { isEmpty } from '~/utils/commonFunction'

const PrimaryEmailModal = ({ open, handleClose }) => {
    const showSnackbar = useSnackbar()
    const { userId } = useAppSelector((state) => state.auth)
    const { checkPrimaryEmail } = useProfile()
    const [primaryEmail, setEmail] = useState({ email: '', error: false, message: '' })
    const [isEmailExisted, setIsEmailExisted] = useState(false)
    const { error, email, message } = primaryEmail
    const [loading, setLoading] = useState(false)

    const handleEmailChange = (event) => {
        const { value } = event.target
        if (isEmailExisted) {
            setIsEmailExisted(false)
        }
        setEmail({ email: value, error: false, message: '' })
    }

    const handleSendEmail = () => {
        if (isEmpty(email)) {
            setEmail((prev) => ({ ...prev, error: true, message: 'Please enter your email' }))
        } else if (!email.endsWith('@fe.edu.vn')) {
            setEmail((prev) => ({ ...prev, error: true, message: 'Only use @fe.edu.vn account' }))
        } else {
            setLoading(true)
            checkPrimaryEmail(userId, email)
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Send email successfully. Please confirm your email',
                    })
                    handleClose()
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        setIsEmailExisted(true)
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'Something went wrong. Please try again later',
                        })
                    }
                })
                .finally(() => {
                    setLoading(true)
                })
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
            fullWidth
            TransitionComponent={TransitionCompo}
            sx={{ backdropFilter: 'blur(4px)' }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle id="alert-dialog-title">
                    Email Profile
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
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
                    <InputLayout boxStyle={{ mb: 2 }} label="Email">
                        <TextField
                            helperText={error ? message : ''}
                            value={email}
                            error={error}
                            onChange={handleEmailChange}
                            inputProps={{ type: 'email' }}
                            size="small"
                            fullWidth
                        />
                    </InputLayout>
                    {isEmailExisted && <Typography mt={1}>This email has already been used</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton loading={loading} onClick={handleSendEmail} variant="contained">
                        Send
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default PrimaryEmailModal
