import React, { memo } from 'react'

import { cloneDeep } from 'lodash'
import { NumericFormat } from 'react-number-format'

import {
    Box,
    FormControlLabel,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'

import { AppStyles } from '~/constants/colors'

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

const ExtraPage = ({ extraPage, setExtraPage, registerConfig }) => {
    const handleRegularPriceChange = (event, index) => {
        const updatePrice = cloneDeep(extraPage)
        // const notZero = event.target.value > 0
        if (event.target.value) {
            updatePrice[index].regularRegistration = event.target.value
            updatePrice[index].errorRegular = false
            updatePrice[index].helperRegular = ''
        } else {
            updatePrice[index].errorRegular = true
            updatePrice[index].helperRegular = 'Cannot be empty'
        }
        setExtraPage(updatePrice)
    }

    const handleEarlyPriceChange = (event, index) => {
        const updatePrice = cloneDeep(extraPage)
        // const notZero = event.target.value > 0
        if (event.target.value) {
            updatePrice[index].earlyRegistration = event.target.value
            updatePrice[index].errorEarly = false
            updatePrice[index].helperEarly = ''
        } else {
            updatePrice[index].errorEarly = true
            updatePrice[index].helperEarly = 'Cannot be empty'
        }
        setExtraPage(updatePrice)
    }

    const handleEnableChange = (event, index) => {
        const updatePrice = cloneDeep(extraPage)

        if (index === 1 && event.target.checked === false) {
            updatePrice[index + 1].isEnabled = event.target.checked
            updatePrice[index + 1].earlyRegistration = null
            updatePrice[index + 1].regularRegistration = null
        }
        if (event.target.checked === false) {
            updatePrice[index].earlyRegistration = null
            updatePrice[index].regularRegistration = null
        } else {
            updatePrice[index].earlyRegistration = 0
            updatePrice[index].regularRegistration = 0
        }
        if (index === 2 && event.target.checked === true && !updatePrice[1].isEnabled === true) {
            return
        }
        updatePrice[index].errorEarly = false
        updatePrice[index].helperEarly = ''
        updatePrice[index].errorRegular = false
        updatePrice[index].helperRegular = ''
        updatePrice[index].isEnabled = event.target.checked
        setExtraPage(updatePrice)
    }

    return (
        <TableContainer sx={{ mt: 1 }} component={Paper}>
            <Table
                sx={{
                    width: '100%',
                    border: `1px solid ${AppStyles.colors['#ddd']}`,
                    borderRadius: 2,
                }}
            >
                <TableHead>
                    <TableRow
                        sx={{
                            'td, th': {
                                borderRight: '1px solid #cecdcd',
                                py: 1,
                                px: 2,
                            },
                        }}
                    >
                        <TableCell align="left">Option</TableCell>
                        <TableCell
                            align="left"
                            style={{
                                width: 140,
                                maxWidth: 140,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderStyle: 'border-box',
                            }}
                        >
                            Early Registration
                        </TableCell>
                        <TableCell
                            align="left"
                            style={{
                                width: 140,
                                maxWidth: 140,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderStyle: 'border-box',
                            }}
                        >
                            Regular Registration
                        </TableCell>
                        <TableCell align="left">Enabled</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {extraPage.map((extra, index) => (
                        <TableRow
                            key={index}
                            sx={{
                                'td, th': {
                                    borderRight: '1px solid #cecdcd',
                                    py: 1,
                                    px: 2,
                                },
                            }}
                        >
                            <TableCell>{extra.option}</TableCell>
                            <TableCell>
                                <Box pt={extra?.helperEarly !== '' && 3}>
                                    <TextField
                                        placeholder="Early Price"
                                        variant="outlined"
                                        size="small"
                                        name="$"
                                        disabled={!extra.isEnabled || !registerConfig.isEarlyRegistrationEnabled}
                                        value={extra.earlyRegistration}
                                        onChange={(value) => handleEarlyPriceChange(value, index)}
                                        required
                                        InputProps={{
                                            inputComponent: NumericFormatCustom,
                                        }}
                                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        helperText={extra?.helperEarly !== '' && extra?.helperEarly}
                                        error={extra?.errorEarly}
                                    />{' '}
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box pt={extra?.helperRegular !== '' && 3}>
                                    <TextField
                                        placeholder="Regular Price"
                                        variant="outlined"
                                        size="small"
                                        name="$"
                                        disabled={!extra.isEnabled}
                                        value={extra.regularRegistration}
                                        onChange={(value) => handleRegularPriceChange(value, index)}
                                        required
                                        InputProps={{
                                            inputComponent: NumericFormatCustom,
                                        }}
                                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        helperText={extra?.helperRegular !== '' && extra?.helperRegular}
                                        error={extra?.errorRegular}
                                    />{' '}
                                </Box>
                            </TableCell>
                            <TableCell align="left">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={extra.isEnabled}
                                            onChange={(value) => handleEnableChange(value, index)}
                                            name="jason"
                                        />
                                    }
                                    label="Enabled"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default memo(ExtraPage)
