import React, { memo } from 'react'

import { cloneDeep } from 'lodash'
import { NumericFormat } from 'react-number-format'

import { Delete } from '@mui/icons-material'
import {
    Box,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Zoom,
} from '@mui/material'

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

const Member = ({ setMemberPrice, memberPrice, registerConfig }) => {
    const handleChangeOptionName = (event, index) => {
        const updatePrice = cloneDeep(memberPrice)
        const optionExists = memberPrice.some((item) => item.option === event.target.value)
        const isOptionName = !isEmpty(event.target.value)

        const isValid = !optionExists && isOptionName

        if (isValid) {
            updatePrice[index].option = event.target.value
            updatePrice[index].errorOption = false
            updatePrice[index].helperOption = ''
        } else {
            updatePrice[index].errorOption = true
            updatePrice[index].helperOption = optionExists ? 'Option name already exist' : 'Option name cannot be empty'
        }
        setMemberPrice(updatePrice)
    }

    const handleRegularPriceMemberChange = (event, index) => {
        const updatePrice = cloneDeep(memberPrice)
        // const notZero = event.target.value > 0
        if (event.target.value) {
            updatePrice[index].regularRegistration = event.target.value
            updatePrice[index].errorRegular = false
            updatePrice[index].helperRegular = ''
        } else {
            updatePrice[index].errorRegular = true
            updatePrice[index].helperRegular = 'Cannot be empty'
        }
        setMemberPrice(updatePrice)
    }

    const handleEarlyPriceMemberChange = (event, index) => {
        const updatePrice = cloneDeep(memberPrice)
        // const notZero = event.target.value > 0
        if (event.target.value) {
            updatePrice[index].earlyRegistration = event.target.value
            updatePrice[index].errorEarly = false
            updatePrice[index].helperEarly = ''
        } else {
            updatePrice[index].errorEarly = true
            updatePrice[index].helperEarly = 'Cannot be empty'
        }
        setMemberPrice(updatePrice)
    }

    const handleRemoveOption = (id) => {
        const updateMember = memberPrice.filter((option) => option.id !== id)
        setMemberPrice(updateMember)
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
                                width: 160,
                                maxWidth: 160,
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
                                width: 160,
                                maxWidth: 160,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                borderStyle: 'border-box',
                            }}
                        >
                            Regular Registration
                        </TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                    {memberPrice.map((extra, index) => (
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
                            <TableCell>
                                <Box pt={extra?.helperOption !== '' && 3}>
                                    <TextField
                                        placeholder="Option Name"
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        value={extra.option}
                                        onChange={(value) => handleChangeOptionName(value, index)}
                                        required
                                        helperText={extra?.helperOption !== '' && extra?.helperOption}
                                        error={extra?.errorOption}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box pt={extra?.helperEarly !== '' && 3}>
                                    <TextField
                                        placeholder="Early Price"
                                        variant="outlined"
                                        size="small"
                                        disabled={!registerConfig.isEarlyRegistrationEnabled}
                                        name="earlyRegistration"
                                        value={extra.earlyRegistration}
                                        onChange={(value) => handleEarlyPriceMemberChange(value, index)}
                                        required
                                        InputProps={{
                                            inputComponent: NumericFormatCustom,
                                        }}
                                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        helperText={extra?.helperEarly !== '' && extra?.helperEarly}
                                        error={extra?.errorEarly}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box pt={extra?.helperRegular !== '' && 3}>
                                    <TextField
                                        placeholder="Regular Price"
                                        variant="outlined"
                                        size="small"
                                        name="regularRegistration"
                                        value={extra.regularRegistration}
                                        onChange={(value) => handleRegularPriceMemberChange(value, index)}
                                        required
                                        InputProps={{
                                            inputComponent: NumericFormatCustom,
                                        }}
                                        inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        helperText={extra?.helperRegular !== '' && extra?.helperRegular}
                                        error={extra?.errorRegular}
                                    />
                                </Box>
                            </TableCell>
                            <TableCell align="center">
                                <Tooltip TransitionComponent={Zoom} title="Remove Option" placement="right">
                                    <IconButton size="small" onClick={() => handleRemoveOption(extra.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default memo(Member)
