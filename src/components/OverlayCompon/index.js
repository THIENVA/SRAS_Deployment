import { useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { CheckCircle, Error } from '@mui/icons-material'
import { Backdrop, CircularProgress } from '@mui/material'

const OverlayCompo = ({ open, handleClose, shouldRedirect, path, state = {}, isSuccess, loading }) => {
    const history = useHistory()

    useEffect(() => {
        let timeoutId = -1
        if (isSuccess === true) {
            timeoutId = setTimeout(() => {
                if (shouldRedirect) {
                    handleClose()
                    history.push({
                        pathname: path,
                        state: { state },
                    })
                } else {
                    handleClose()
                }
            }, 1000)
        } else if (isSuccess === false) {
            timeoutId = setTimeout(() => {
                handleClose()
            }, 1000)
        }

        return () => {
            clearTimeout(timeoutId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, isSuccess])

    return (
        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
            {loading && isSuccess === null && <CircularProgress />}
            {!loading && isSuccess === true ? (
                <CheckCircle color="success" sx={{ fontSize: 32 }} />
            ) : isSuccess === false ? (
                <Error color="error" sx={{ fontSize: 32 }} />
            ) : null}
        </Backdrop>
    )
}

export default OverlayCompo
