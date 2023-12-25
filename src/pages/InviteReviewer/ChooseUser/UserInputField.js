import React from 'react'

import { Add, CancelOutlined, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'

import { AppStyles } from '~/constants/colors'
import { countries } from '~/constants/countries'

const UserInputField = ({
    textField,
    handleTextChange,
    createInvite,
    loading,
    handleCountrySelected,
    countrySelected,
    isUpdateInvite,
    updateInvite,
    cancelUpdate,
    isDisable,
}) => {
    const { firstName, lastName, organization, middleName, email } = textField
    return (
        <React.Fragment>
            <Box mt={1}>
                {isUpdateInvite === false && (
                    <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 'bold' }}>
                        User with email {email} was not found. Enter information below to continue. Account will not be
                        created for the user.
                    </Typography>
                )}
                <Box ml={8} mt={2}>
                    <InputField
                        text="First Name"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        textBoxStyle={{ width: 180 }}
                    >
                        <Box minWidth={300}>
                            <TextField
                                fullWidth={true}
                                placeholder="First Name"
                                variant="outlined"
                                sx={{ height: 42 }}
                                value={firstName}
                                name="firstName"
                                onChange={handleTextChange}
                                size="small"
                            />
                        </Box>
                    </InputField>
                    <InputField
                        text="Middle Name"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        textBoxStyle={{ width: 180 }}
                    >
                        <Box minWidth={300}>
                            <TextField
                                fullWidth={true}
                                placeholder="Middle Name"
                                variant="outlined"
                                sx={{ height: 42 }}
                                value={middleName}
                                name="middleName"
                                onChange={handleTextChange}
                                size="small"
                            />
                        </Box>
                    </InputField>
                    <InputField
                        text="Last Name"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        textBoxStyle={{ width: 180 }}
                    >
                        <Box minWidth={300}>
                            <TextField
                                fullWidth={true}
                                placeholder="Last Name"
                                variant="outlined"
                                sx={{ height: 42 }}
                                value={lastName}
                                name="lastName"
                                onChange={handleTextChange}
                                size="small"
                            />
                        </Box>
                    </InputField>
                    <InputField
                        text="Country"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        textBoxStyle={{ width: 180 }}
                    >
                        <Box minWidth={300}>
                            <Autocomplete
                                size="small"
                                fullWidth
                                autoHighlight
                                value={countrySelected}
                                onChange={(_, newValue) => handleCountrySelected(newValue)}
                                options={countries}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose a country"
                                        inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password', // disable autocomplete and autofill
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        text="Organization"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center' }}
                        textBoxStyle={{ width: 180 }}
                    >
                        <Box minWidth={300}>
                            <TextField
                                fullWidth={true}
                                placeholder="Organization"
                                variant="outlined"
                                sx={{ height: 42 }}
                                value={organization}
                                name="organization"
                                onChange={handleTextChange}
                                size="small"
                            />
                        </Box>
                    </InputField>
                </Box>
            </Box>
            <Box display="flex" alignItems="center" mt={5}>
                {isUpdateInvite === true && (
                    <Button
                        variant="outlined"
                        startIcon={<CancelOutlined />}
                        onClick={() => cancelUpdate()}
                        sx={{ height: 36, textTransform: 'none', borderRadius: 1 }}
                        disabled={loading}
                    >
                        Cancel Update
                    </Button>
                )}

                <LoadingButton
                    sx={{
                        ml: 1,
                        height: 36,
                        textTransform: 'none',
                        border: '1px solid #0077CC',
                        backgroundImage: 'linear-gradient(to bottom, #007EA3, #0048a3)',
                        borderRadius: 1,
                        color: AppStyles.colors['#FFFFFF'],
                        fontWeight: 500,
                        px: 1,
                        ':hover': {
                            backgroundColor: '#0048a3',
                            backgroundImage: 'linear-gradient(to bottom, #1482D0, #0048a3)',
                            borderColor: '#1482D0',
                            textDecoration: 'none',
                        },
                        ':active': {
                            backgroundImage: 'linear-gradient(#3D94D9, #0067B9)',
                            borderColor: '#006DBC',
                            outline: 'none',
                        },
                        ':focus': {
                            boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                            outline: 'none',
                        },
                        ':disabled': {
                            color: '#EFEFEF',
                            backgroundColor: '#EFEFEF',
                            boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                            outline: 'none',
                        },
                    }}
                    onClick={isUpdateInvite === true ? updateInvite : createInvite}
                    loading={loading}
                    endIcon={isUpdateInvite === true ? <Save fontSize="large" /> : <Add fontSize="large" />}
                    loadingPosition="end"
                    disabled={isDisable}
                >
                    <Typography>{isUpdateInvite === true ? 'Save' : 'Create Invite'} </Typography>
                </LoadingButton>
            </Box>
        </React.Fragment>
    )
}

export default UserInputField
