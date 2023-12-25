import { Close } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'

export default function ModalInfo({
    open,
    handleClose,
    children,
    style,
    header,
    headerStyle,
    maxWidth,
    submitBtnName,
    handleSubmit,
    enableActions = false,
    cancelBtnName,
    isDisable,
    loading,
}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            disableEscapeKeyDown={false}
            fullWidth
            maxWidth={maxWidth}
            sx={{ backdropFilter: 'blur(4px)', ...style }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle display={'flex'} alignContent={'center'}>
                    <Typography sx={{ ...headerStyle }}>{header}</Typography>
                    {handleClose ? (
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
                    ) : null}
                </DialogTitle>
                <DialogContent dividers sx={{ pb: 4 }}>
                    {children}
                </DialogContent>
                {enableActions && (
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" color="error" sx={{ textTransform: 'none' }}>
                            {cancelBtnName ? cancelBtnName : 'Cancel'}
                        </Button>
                        <LoadingButton
                            onClick={handleSubmit}
                            autoFocus
                            variant="contained"
                            disabled={isDisable || loading}
                            loading={loading}
                            sx={{ textTransform: 'none' }}
                        >
                            {submitBtnName}
                        </LoadingButton>
                    </DialogActions>
                )}
            </Box>
        </Dialog>
    )
}
