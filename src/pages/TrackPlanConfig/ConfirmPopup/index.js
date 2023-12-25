import { useState } from 'react'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const ConfirmPopup = ({ open, handleClose, deadlinesActivity, trackIdSubmitted, setButtonLoading, setFirstTime }) => {
    const { firstName, lastName, middleName } = useAppSelector((state) => state.auth)
    const showSnackbar = useSnackbar()
    const { updateTrackPlan } = useTrack()
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)

    const removeErrorHelperText = (data) => {
        const modifiedArray = data.map((obj) => {
            const { error, helperText, ...rest } = obj
            return rest
        })
        return modifiedArray
    }
    const handleSubmit = () => {
        setLoading(true)
        const data = removeErrorHelperText(deadlinesActivity)
        if (isChecked) {
            updateTrackPlan(trackIdSubmitted, JSON.stringify(data))
                .then(() => {
                    setFirstTime(false)
                })
                .catch((err) => {
                    const data = err?.response?.data?.error?.code
                    const stringWithoutPrefix = data.replace(/^Sras:ConferenceManagement:/, '')
                    const words = stringWithoutPrefix.split(/(?=[A-Z])/)
                    const formattedString = words.join(' ')

                    showSnackbar({
                        severity: 'error',
                        children: `${
                            formattedString
                                ? formattedString
                                : 'Something went wrong, please check plan deadlines again.'
                        }`,
                    })
                })
                .finally(() => {
                    handleClose()
                    setButtonLoading(false)
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
            header={'Action Confirmation'}
            headerStyle={{ fontSize: 24, fontWeight: 'bold', color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Confirm"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center">
                <Box display={'flex'} alignItems={'center'}>
                    {/* <Box display={'flex'} alignItems={'center'} mb={1}>
                        <WarningAmber color="warning" />
                        <Typography sx={{ fontSize: 18, ml: 1 }}>
                            <strong>Caution: </strong>Once submitted, this decision is irreversible.
                        </Typography>
                    </Box> */}
                    <FormControlLabel control={<Checkbox value={isChecked} onChange={handleCheck} />} />
                    <Typography>
                        I,{' '}
                        <strong>
                            {firstName} {middleName && middleName} {lastName}
                        </strong>
                        , understand that creating track plan is one time action. Once I submitted, this decision is
                        irreversible.
                    </Typography>
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default ConfirmPopup
