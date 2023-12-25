import React from 'react'

import { enGB } from 'date-fns/locale'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { NumericFormat } from 'react-number-format'

import { Box, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                })
            }}
            allowNegative={false}
            allowLeadingZeros={false}
            decimalScale={0}
        />
    )
})
const RegisterConfig = ({
    registerConfig,
    setRegisterConfig,
    earlyRegister,
    setEarlyRegister,
    messageError,
    error,
    setMessageError,
    setError,
    setExtraPage,
    setMemberPrice,
    memberPrice,
    extraPage,
}) => {
    const { maxValidNumberOfPages, isEarlyRegistrationEnabled, maxNumberOfExtraPapers } = registerConfig

    const handleTextChange = (event) => {
        const { name, value } = event.target
        if (name === 'isEarlyRegistrationEnabled' && value === false) {
            const extraClone = cloneDeep(extraPage)
            const memberClone = cloneDeep(memberPrice)
            setMessageError((prev) => ({ ...prev, earlyDeadline: '' }))
            setError((prev) => ({ ...prev, earlyDeadline: false }))
            setEarlyRegister(null)

            for (const obj of extraClone) {
                obj.earlyRegistration = null
            }
            setExtraPage(extraClone)

            for (const obj of memberClone) {
                obj.earlyRegistration = null
            }
            setMemberPrice(memberClone)
        } else if (name === 'isEarlyRegistrationEnabled' && value === true) {
            const extraClone = cloneDeep(extraPage)
            const memberClone = cloneDeep(memberPrice)
            for (const obj of extraClone) {
                if (obj.isEnabled) {
                    obj.earlyRegistration = 0
                }
            }
            setExtraPage(extraClone)

            for (const obj of memberClone) {
                obj.earlyRegistration = 0
            }
            setMemberPrice(memberClone)
        }
        if (name === 'maxValidNumberOfPages') {
            setMessageError((prev) => ({ ...prev, numberPage: '' }))
            setError((prev) => ({ ...prev, numberPage: false }))
            setRegisterConfig((prev) => ({ ...prev, [name]: parseFloat(value) }))
        } else {
            setRegisterConfig((prev) => ({ ...prev, [name]: value }))
        }
    }

    const handleDateChange = (newDate) => {
        setMessageError((prev) => ({ ...prev, earlyDeadline: '' }))
        setError((prev) => ({ ...prev, earlyDeadline: false }))
        const formatDate = moment(newDate).format()
        const planDeadline =
            formatDate.toUpperCase() === 'INVALID DATE' ? null : formatDate.substring(0, 10) + 'T00:00:00'
        setEarlyRegister(planDeadline)
    }
    return (
        <Box display="flex" alignItems={'center'} justifyContent={'space-evenly'}>
            <Box>
                <Typography variant="subtitle2" sx={{ opacity: '60%' }}>
                    Early Registration
                </Typography>
                <FormControl sx={{ minWidth: 140 }}>
                    <Select
                        value={isEarlyRegistrationEnabled}
                        onChange={handleTextChange}
                        size="small"
                        name="isEarlyRegistrationEnabled"
                    >
                        <MenuItem value={true}>Enabled</MenuItem>
                        <MenuItem value={false}>Disabled</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{ opacity: '60%' }}>
                    Early Registration Deadline
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                    <FormControl size="small">
                        <DatePicker
                            disabled={!isEarlyRegistrationEnabled}
                            views={['day', 'month', 'year']}
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    {...params}
                                    error={error.earlyDeadline}
                                    helperText={error.earlyDeadline ? messageError.earlyDeadline : ''}
                                />
                            )}
                            minDate={new Date()}
                            value={earlyRegister}
                            onChange={(value) => handleDateChange(value)}
                        />
                    </FormControl>
                </LocalizationProvider>
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{ opacity: '60%' }}>
                    Number of Pages
                    <Typography component={'span'} color={'error'}>
                        *
                    </Typography>
                </Typography>
                <TextField
                    placeholder="Max valid number of page"
                    variant="outlined"
                    InputProps={{
                        inputComponent: NumericFormatCustom,
                    }}
                    sx={{ maxWidth: 180 }}
                    inputProps={{ min: 1, style: { textAlign: 'right' } }}
                    value={maxValidNumberOfPages}
                    name="maxValidNumberOfPages"
                    onChange={handleTextChange}
                    size="small"
                    error={error.numberPage}
                    helperText={error.numberPage ? messageError.numberPage : ''}
                />
            </Box>
            <Box>
                <Typography variant="subtitle2" sx={{ opacity: '60%' }}>
                    Number of Extra Papers
                </Typography>
                <TextField
                    sx={{ maxWidth: 180 }}
                    disabled={true}
                    placeholder="Max valid number of Extra Papers"
                    variant="outlined"
                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                    value={maxNumberOfExtraPapers}
                    name="maxNumberOfExtraPapers"
                    onChange={handleTextChange}
                    size="small"
                />
            </Box>
        </Box>
    )
}

export default RegisterConfig
