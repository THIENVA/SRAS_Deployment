import { Autocomplete, Box, FormHelperText, TextField } from '@mui/material'

import { countries } from '~/constants/countries'

const PersonalInfo = ({
    personalInfo,
    handlePersonalInfoChange,
    handleSelectCountry,
    countrySelected,
    messageError,
    error,
}) => {
    return (
        <Box mt={3}>
            <Box
                sx={{
                    borderRadius: '6px 6px 0px 0px',
                    p: 2,
                    fontWeight: 'bold',
                    fontSize: 20,
                    backgroundColor: '#eeeeee',
                }}
            >
                Personal Information
            </Box>
            <Box sx={{ borderRadius: '0px 0px 6px 6px', p: 2, backgroundColor: '#f9f9f9', pb: 3 }}>
                <TextField
                    required
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    label="First Name"
                    name="firstName"
                    value={personalInfo.firstName}
                    onChange={handlePersonalInfoChange}
                    size="small"
                    error={error.firstName}
                    helperText={error.firstName ? messageError.firstName : ''}
                />
                <TextField
                    required
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    label="Middle Name"
                    name="middleName"
                    value={personalInfo.middleName}
                    onChange={handlePersonalInfoChange}
                    size="small"
                    error={error.middleName}
                    helperText={error.middleName ? messageError.middleName : ''}
                />
                <TextField
                    required
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    label="Last Name"
                    name="lastName"
                    value={personalInfo.lastName}
                    onChange={handlePersonalInfoChange}
                    size="small"
                    error={error.lastName}
                    helperText={error.lastName ? messageError.lastName : ''}
                />
                <TextField
                    required
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    label="Organization Name"
                    name="organization"
                    value={personalInfo.organization}
                    onChange={handlePersonalInfoChange}
                    size="small"
                    error={error.organization}
                    helperText={error.organization ? messageError.organization : ''}
                />
                <Autocomplete
                    size="small"
                    name="country"
                    fullWidth
                    autoHighlight
                    value={countrySelected}
                    onChange={(_, newValue) => handleSelectCountry(newValue)}
                    options={countries}
                    renderInput={(params) => (
                        <TextField
                            margin="normal"
                            label="Country"
                            {...params}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                            error={error.countrySelected}
                        />
                    )}
                />
                {error.countrySelected && (
                    <FormHelperText error={error.countrySelected}>{messageError.countrySelected}</FormHelperText>
                )}
            </Box>
        </Box>
    )
}

export default PersonalInfo
