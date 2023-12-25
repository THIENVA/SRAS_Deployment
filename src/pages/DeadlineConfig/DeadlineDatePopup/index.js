import { useState } from 'react'

import { enGB } from 'date-fns/locale'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import { Box, FormControl, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ModalInfo from '~/components/ModalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'

const DeadlineDatePopup = ({
    open,
    handleClose,
    deadlinesActivity,
    trackIdSubmitted,
    setDeadlinesActivity,
    currentIndexDate,
}) => {
    const showSnackbar = useSnackbar()
    const { postActivityExtension } = useTrack()

    const [isLoading, setLoading] = useState(false)
    const [dateTime, setDateTime] = useState(deadlinesActivity[currentIndexDate].planDeadline)

    const isDisable = moment(dateTime).format() !== moment(deadlinesActivity[currentIndexDate].planDeadline).format()

    const handleDeadlineTime = (newDate) => {
        setDateTime(newDate)
    }
    const handleSubmit = () => {
        const formatDate = moment(dateTime).format()
        const planDeadline = formatDate.substring(0, 19)
        const updatedDeadlines = cloneDeep(deadlinesActivity)
        updatedDeadlines[currentIndexDate].deadline = planDeadline
        // console.log(JSON.stringify(updatedDeadlines[currentIndexDate]))
        setLoading(true)

        if (isDisable) {
            postActivityExtension(trackIdSubmitted, JSON.stringify(updatedDeadlines[currentIndexDate]))
                .then((res) => {
                    // console.log(res)
                    setDeadlinesActivity(updatedDeadlines)
                    // showSnackbar({
                    //     severity: 'success',
                    //     children: `${updatedDeadlines[currentIndexDate].name} Deadline Has Been Extended.`,
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

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Extend Deadline'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="xs"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={!isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center" flexDirection="column">
                <Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <FormControl fullWidth size="small">
                            <DatePicker
                                views={['day', 'month', 'year']}
                                renderInput={(params) => <TextField size="small" {...params} />}
                                value={dateTime}
                                onChange={(value) => handleDeadlineTime(value)}
                                minDate={deadlinesActivity[currentIndexDate].planDeadline}
                            />
                        </FormControl>
                    </LocalizationProvider>
                </Box>
                {/* <Box>
                    <Typography sx={{ fontSize: 18, mb: 1 }}>
                        <strong>Caution: </strong>Once submitted, this decision is irreversible.
                    </Typography>
                    <FormControlLabel
                        control={<Checkbox value={isChecked} onChange={handleCheck} />}
                        label="Yes, I understand."
                    />
                </Box> */}
            </Box>
        </ModalInfo>
    )
}

export default DeadlineDatePopup
