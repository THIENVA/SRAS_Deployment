import { useState } from 'react'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { AppStyles } from '~/constants/colors'

const ConfirmPopup = ({ open, handleClose, deleteCameraReady, row }) => {
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)
    const showSnackbar = useSnackbar()

    const handleSubmit = () => {
        setLoading(true)
        if (isChecked) {
            deleteCameraReady(row.paperId)
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Delete camera ready successfully.',
                    })
                    window.location.reload()
                })
                .catch(() => {})
                .finally(() => {
                    handleClose()
                    setLoading(false)
                })
        }
    }

    const handleCheck = (event) => {
        setCheck(event.target.checked)
        if (event.target.checked === true) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Delete Camera Ready'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center">
                <Box>
                    <Box display={'flex'} alignItems={'center'} mb={1}>
                        <Typography sx={{ fontSize: 18, ml: 1 }}>
                            Are you sure want to delete Camera Ready for this paper?
                        </Typography>
                    </Box>
                    <FormControlLabel
                        control={<Checkbox value={isChecked} onChange={handleCheck} />}
                        label="Yes, I understand."
                    />
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default ConfirmPopup
