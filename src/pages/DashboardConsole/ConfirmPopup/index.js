import { useState } from 'react'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const ConfirmPopup = ({ open, handleClose, handleCheckChange, checkInfo }) => {
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)

        if (isChecked) {
            handleCheckChange(checkInfo.event, checkInfo.row)
            handleClose()
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
            header={'Choose Reviewer'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Confirm"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center">
                <Box>
                    <Box display={'flex'} alignItems={'center'} mb={1}>
                        <Typography sx={{ fontSize: 18, ml: 1 }}>
                            Are you certain about your choice to designate this reviewer with a relevance score of 0 for
                            assignment?
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
