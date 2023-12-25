import { useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const ConfirmPopup = ({ open, handleClose, deleteConference, row, setUnique }) => {
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)

        if (isChecked) {
            deleteConference(row.id)
                .then(() => {
                    setUnique(uuid())
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
            header={'Delete Conference'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="xs"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center">
                <Box>
                    <Box display={'flex'} alignItems={'center'} mb={1}>
                        <Typography sx={{ fontSize: 18, ml: 1 }}>Are you sure want to delete Conference?</Typography>
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
