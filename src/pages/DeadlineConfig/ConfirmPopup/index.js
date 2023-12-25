import { useState } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'

const ConfirmPopup = ({
    open,
    handleClose,
    deadlinesActivity,
    trackIdSubmitted,
    currentIndex,
    setDeadlinesActivity,
}) => {
    const showSnackbar = useSnackbar()
    const { postActivityCompletion } = useTrack()
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        const updatedDeadlines = cloneDeep(deadlinesActivity)
        updatedDeadlines[currentIndex].status = 'Completed'
        setDeadlinesActivity(updatedDeadlines)
        setLoading(true)
        if (isChecked) {
            postActivityCompletion(trackIdSubmitted, updatedDeadlines[currentIndex].id)
                .then((res) => {
                    updatedDeadlines[currentIndex].status = 'Completed'
                    updatedDeadlines[currentIndex].completionTime = res.data.completionTime
                    setDeadlinesActivity(updatedDeadlines)
                    // showSnackbar({
                    //     severity: 'success',
                    //     children: `${updatedDeadlines[currentIndex].name} Has Been Completed.`,
                    // })
                })
                .catch((err) => {
                    const error = err.response.data.error.code
                        ? err.response.data.error.code
                        : 'Something went wrong, please try again later'
                    showSnackbar({
                        severity: 'error',
                        children: `${error}`,
                    })
                })
                .finally(() => {
                    handleClose()
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
            header={'Change Status to Complete?'}
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
                    <Typography sx={{ fontSize: 18, mb: 1 }}>
                        <strong>Caution: </strong>Once submitted, this decision is irreversible.
                    </Typography>
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
