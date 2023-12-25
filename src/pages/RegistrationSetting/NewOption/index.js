import React, { useState } from 'react'

import { cloneDeep } from 'lodash'
import { NumericFormat } from 'react-number-format'
import { v4 as uuid } from 'uuid'

import { Grid, TextField, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'
import { isEmpty } from '~/utils/commonFunction'

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
            suffix={`${' '}VND`}
            thousandSeparator={'.'}
            allowedDecimalSeparators={false}
            decimalSeparator=","
        />
    )
})

const NewOption = ({ open, handleClose, setMemberPrice, memberPrice, registerConfig }) => {
    const [textField, setTextField] = useState({
        option: '',
        earlyRegistration: registerConfig.isEarlyRegistrationEnabled ? '0' : null,
        regularRegistration: '0',
    })
    const [error, setError] = useState({
        option: false,
        earlyRegistration: false,
        regularRegistration: false,
    })

    const [messageError, setMessageError] = useState({
        option: '',
        earlyRegistration: '',
        regularRegistration: '',
    })

    const handleSubmit = () => {
        const optionExists = memberPrice.some((item) => item.option === textField.option)
        // const earlyNotZero = textField.earlyRegistration > 0
        // const regularNotZero = textField.regularRegistration > 0
        const isOptionName = !isEmpty(textField.option)
        let validEarlyPrice
        if (registerConfig.isEarlyRegistrationEnabled === true) {
            if (textField.earlyRegistration !== null && textField.earlyRegistration.trim() !== '') {
                validEarlyPrice = true
            } else {
                validEarlyPrice = false
            }
        } else {
            validEarlyPrice = true
        }

        const validRegularPrice = textField.regularRegistration !== null && textField.regularRegistration.trim() !== ''

        // const isValid = earlyNotZero && regularNotZero && !optionExists && isOptionName
        const isValid = !optionExists && isOptionName && validRegularPrice && validEarlyPrice

        if (!isValid) {
            console.log(validEarlyPrice)
            console.log(validRegularPrice)
            setMessageError({
                option: optionExists ? 'Option name already exist' : 'Option name cannot be empty',
                earlyRegistration: !validEarlyPrice && 'Early registration cannot be empty',
                regularRegistration: !validRegularPrice && 'Regular registration cannot be empty',
            })
            setError({
                option: optionExists || !isOptionName,
                earlyRegistration: !validEarlyPrice,
                regularRegistration: !validRegularPrice,
            })
        } else {
            const newOption = cloneDeep(memberPrice)
            const updatedTextField = {
                ...textField,
                id: uuid(),
                isEnabled: false,
                helperOption: '',
                errorOption: false,
                helperRegular: '',
                errorRegular: false,
                helperEarly: '',
                errorEarly: false,
            }
            newOption.push(updatedTextField)
            setMemberPrice(newOption)
            handleClose()
        }
    }

    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'New Option'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
        >
            <Grid container px={3} rowSpacing={2}>
                <Grid container item>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Option Name:
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                        <TextField
                            placeholder="Option Name"
                            variant="outlined"
                            size="small"
                            value={textField.option}
                            onChange={(value) => handleTextChange(value)}
                            required
                            name="option"
                            error={error.option}
                            helperText={error.option ? messageError.option : ''}
                            inputProps={{ style: { textAlign: 'right' } }}
                        />
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Early Registration:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <TextField
                            disabled={!registerConfig.isEarlyRegistrationEnabled}
                            placeholder="Early Price"
                            variant="outlined"
                            size="small"
                            name="earlyRegistration"
                            value={textField.earlyRegistration}
                            onChange={(value) => handleTextChange(value)}
                            required
                            InputProps={{
                                inputComponent: NumericFormatCustom,
                            }}
                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                            error={error.earlyRegistration}
                            helperText={error.earlyRegistration ? messageError.earlyRegistration : ''}
                        />
                    </Grid>
                </Grid>
                <Grid container item>
                    <Grid item xs={12} md={6} lg={6}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Regular Registration:
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <TextField
                            placeholder="Regular Price"
                            variant="outlined"
                            size="small"
                            name="regularRegistration"
                            value={textField.regularRegistration}
                            onChange={(value) => handleTextChange(value)}
                            required
                            InputProps={{
                                inputComponent: NumericFormatCustom,
                            }}
                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                            error={error.regularRegistration}
                            helperText={error.regularRegistration ? messageError.regularRegistration : ''}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default NewOption
