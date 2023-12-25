import React, { createContext, useContext, useState } from 'react'

import { Alert, Slide, Snackbar } from '@mui/material'

// eslint-disable-next-line no-empty-pattern
const SnackbarContext = createContext(({}) => {})
export const useSnackbar = () => useContext(SnackbarContext)

const SlideTransition = React.forwardRef((props, ref) => {
    return <Slide {...props} direction="left" ref={ref} />
})

const SnackbarProvider = ({ children }) => {
    const [alert, setAlert] = useState({})
    const [open, setOpen] = useState(false)

    const showSnackbar = (newAlert) => {
        setAlert({
            variant: 'filled',
            severity: 'success',
            ...newAlert,
        })
        setOpen(true)
    }

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

    return (
        <SnackbarContext.Provider value={showSnackbar}>
            {children}
            <Snackbar
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}
                TransitionComponent={SlideTransition}
                autoHideDuration={3000}
            >
                <Alert variant="filled" {...alert} onClose={handleClose} />
            </Snackbar>
        </SnackbarContext.Provider>
    )
}

export default SnackbarProvider
