import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

const AlertPopup = ({ open, handleClose, handleDelete, children }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ backdropFilter: 'blur(4px)' }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle id="alert-dialog-title">{'System Alert'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete}>OK</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default AlertPopup
