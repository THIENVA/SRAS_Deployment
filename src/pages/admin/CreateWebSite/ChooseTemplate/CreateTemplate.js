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
import TransitionCompo from '~/components/TransitionCompo'

const CreateTemplate = ({ open, handleClose, handleNewTemplate }) => {
    const [textField, setTextField] = useState({ name: '', description: '' })
    const { name, description } = textField
    const [loading, setLoading] = useState(false)

    const HandleTextChange = (event) => {
        const { value, name } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
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
                    <Typography>Create new Template</Typography>
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
                    <TextField
                        placeholder="Template Name"
                        size="small"
                        fullWidth
                        name="name"
                        value={name}
                        onChange={HandleTextChange}
                    />
                    <TextField
                        sx={{ mt: 2 }}
                        multiline
                        rows={5}
                        placeholder="Template Description"
                        size="small"
                        fullWidth
                        name="description"
                        value={description}
                        onChange={HandleTextChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        onClick={() => {
                            setLoading(true)
                            handleNewTemplate(name, description, setLoading)
                        }}
                    >
                        Save Changes
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default CreateTemplate
