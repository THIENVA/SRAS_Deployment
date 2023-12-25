import React from 'react'

import { enGB } from 'date-fns/locale'

import { Autocomplete, Box, FormControl, FormHelperText, TextField, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import InputField from '~/components/InputField'

import TitleSection from '../TitleSection'

import { countries } from '~/constants/countries'
import { isEmpty, splitEveryFirstLetterOfWord } from '~/utils/commonFunction'

const RequireDetails = ({
    textField,
    handleTextChange,
    dateField,
    handleDateChange,
    selectField,
    handleSelectField,
    error,
    messageError,
    start,
    end,
}) => {
    const { fullName, shortName, city, websiteLink } = textField
    const { startDate, endDate } = dateField
    return (
        <React.Fragment>
            <TitleSection>CONFERENCES DETAILS</TitleSection>
            <Box mt={1.5}>
                <InputField text="Conference full name" isRequire={true} textStyle={{ fontSize: 18 }}>
                    <Box minWidth={500} maxWidth={800}>
                        <TextField
                            fullWidth={true}
                            variant="outlined"
                            sx={{ height: 50 }}
                            size="small"
                            name="fullName"
                            value={fullName}
                            onChange={handleTextChange}
                            error={error.fullName}
                            helperText={error.fullName ? messageError.fullName : ''}
                        />
                    </Box>
                </InputField>
                <InputField
                    boxStyle={{ mb: 2 }}
                    text="Short name of the conference"
                    isRequire={true}
                    textStyle={{ fontSize: 18 }}
                >
                    {!isEmpty(fullName) && (
                        <Typography gutterBottom variant="body2" color="info">
                            (Recommendation Conference short name: {splitEveryFirstLetterOfWord(fullName)})
                        </Typography>
                    )}
                    <Box minWidth={500} maxWidth={800}>
                        <TextField
                            fullWidth={true}
                            variant="outlined"
                            sx={{ height: 50 }}
                            size="small"
                            name="shortName"
                            value={shortName}
                            onChange={handleTextChange}
                            error={error.shortName}
                            helperText={error.shortName ? messageError.shortName : ''}
                        />
                    </Box>
                </InputField>
                <Box mb={2} display="flex" alignItems={'center'}>
                    <InputField
                        boxStyle={{ width: 392, mr: 2 }}
                        text="Country"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                    >
                        <Box>
                            <Autocomplete
                                size="small"
                                fullWidth
                                autoHighlight
                                value={selectField}
                                onChange={(_, newValue) => handleSelectField(newValue)}
                                options={countries}
                                ListboxProps={{
                                    style: {
                                        overflow: 'auto',
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose a country"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password',
                                        }}
                                        error={error.country}
                                    />
                                )}
                            />
                        </Box>
                        {error.country && <FormHelperText error={error.country}>{messageError.country}</FormHelperText>}
                    </InputField>
                    <InputField boxStyle={{ width: 392 }} text="Location" isRequire={true} textStyle={{ fontSize: 18 }}>
                        <Box>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                name="city"
                                value={city}
                                onChange={handleTextChange}
                                error={error.city}
                                helperText={error.city ? messageError.city : ''}
                            />
                        </Box>
                    </InputField>
                </Box>
                <InputField boxStyle={{ mb: 2, width: 392 }} text="Conference website" textStyle={{ fontSize: 18 }}>
                    <Box minWidth={800} maxWidth={800}>
                        <TextField
                            fullWidth={true}
                            placeholder="https://"
                            variant="outlined"
                            sx={{ height: 50 }}
                            size="small"
                            name="websiteLink"
                            value={websiteLink}
                            onChange={handleTextChange}
                            error={error.websiteLink}
                            helperText={error.websiteLink ? messageError.websiteLink : ''}
                        />
                    </Box>
                </InputField>
                <Box display="flex" alignItems={'center'}>
                    <InputField
                        text="Start Date"
                        isRequire={true}
                        textBoxStyle={{ justifyContent: 'none', width: 130 }}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ mb: 2, width: 392 }}
                    >
                        <Box maxWidth={392}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                                <FormControl fullWidth size="small">
                                    <DatePicker
                                        views={['day', 'month', 'year']}
                                        renderInput={(params) => (
                                            <TextField size="small" {...params} error={error.startDate} />
                                        )}
                                        value={startDate}
                                        minDate={start}
                                        onChange={(value) => handleDateChange(value, 'startDate')}
                                    />
                                </FormControl>
                                {error.startDate && (
                                    <FormHelperText error={error.startDate}>{messageError.startDate}</FormHelperText>
                                )}
                            </LocalizationProvider>
                        </Box>
                    </InputField>
                    <InputField
                        text="End Date"
                        isRequire={true}
                        textBoxStyle={{ justifyContent: 'none', width: 130 }}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ mb: 2, ml: 2, width: 392 }}
                    >
                        <Box maxWidth={392}>
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                                <FormControl fullWidth size="small">
                                    <DatePicker
                                        views={['day', 'month', 'year']}
                                        renderInput={(params) => (
                                            <TextField size="small" {...params} error={error.endDate} />
                                        )}
                                        value={endDate}
                                        minDate={end}
                                        onChange={(value) => handleDateChange(value, 'endDate')}
                                    />
                                </FormControl>
                                {error.endDate && (
                                    <FormHelperText error={error.endDate}>{messageError.endDate}</FormHelperText>
                                )}
                            </LocalizationProvider>
                        </Box>
                    </InputField>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default RequireDetails
