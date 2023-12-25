import React from 'react'

import { useHistory } from 'react-router-dom'

import { Search } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, FormControl, InputBase, MenuItem, Paper, Select, Typography } from '@mui/material'

import TableUser from './TableUser'
import UserInputField from './UserInputField'
import UserSearched from './UserSearched'

import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ChooseUser = ({
    textField,
    handleTextChange,
    activeStep,
    handleBack,
    handleNext,
    handleEmailInvited,
    invitedEmail,
    isCreatedInvite,
    isShow,
    isSearchResult,
    nextStep,
    steps,
    handleSearch,
    loading,
    handleCreateOutsider,
    handleCountrySelected,
    countrySelected,
    isUpdateInvite,
    setIsUpdateInvite,
    setNextStep,
    handleUpdateOutsider,
    hasAccount,
    userAccount,
    cancelUpdate,
    actionButtonLoading,
    handleChangeTrack,
    track,
    tracks,
}) => {
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)

    const history = useHistory()
    const { firstName, lastName, organization, middleName } = textField

    const isDisable = !firstName || !lastName || !organization || !middleName || !countrySelected

    function createInvite() {
        if (!isDisable) {
            handleCreateOutsider()
        }
    }
    function updateInvite() {
        if (!isDisable) {
            handleUpdateOutsider()
        }
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                    Choose user
                </Typography>
            </Box>
            {roleName === ROLES_NAME.CHAIR && (
                <Box my={4} display="flex" alignItems={'center'}>
                    <Typography sx={{ fontWeight: 'bold' }}>Select Track: </Typography>
                    <FormControl variant="outlined" sx={{ maxWidth: 256, ml: 2 }} size="small" fullWidth>
                        <Select
                            size="small"
                            value={track.trackId}
                            onChange={(_, newValue) => handleChangeTrack(newValue)}
                        >
                            {tracks.map((track) => (
                                <MenuItem key={track.id} value={track.id}>
                                    {track.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            )}
            <Paper
                component="form"
                sx={{
                    mt: 2,
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: 500,
                    border: '1px solid #0077CC',
                }}
            >
                <InputBase
                    name="searchValue"
                    onChange={handleEmailInvited}
                    value={invitedEmail}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Enter email and click Search"
                    disabled={isUpdateInvite}
                />
                <LoadingButton
                    sx={{
                        height: 36,
                        textTransform: 'none',
                        border: '1px solid #0077CC',
                        backgroundImage: 'linear-gradient(#42A1EC, #0070C9)',
                        borderRadius: 1,
                        color: AppStyles.colors['#FFFFFF'],
                        fontWeight: 500,
                        px: 1,
                        ':hover': {
                            backgroundImage: 'linear-gradient(#51A9EE, #147BCD)',
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
                            color: AppStyles.colors['#EFEFEF'],
                            boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                            outline: 'none',
                        },
                    }}
                    onClick={() => handleSearch()}
                    loading={loading}
                    startIcon={<Search fontSize="large" />}
                    loadingPosition="start"
                    disabled={isUpdateInvite || !invitedEmail}
                >
                    <Typography>Search</Typography>
                </LoadingButton>
            </Paper>
            {/* Body */}
            {isShow && (
                <React.Fragment>
                    {isSearchResult === false || hasAccount === false ? (
                        <React.Fragment>
                            {isCreatedInvite === false || isUpdateInvite === true ? (
                                <UserInputField
                                    textField={textField}
                                    handleTextChange={handleTextChange}
                                    createInvite={createInvite}
                                    updateInvite={updateInvite}
                                    loading={actionButtonLoading}
                                    countrySelected={countrySelected}
                                    handleCountrySelected={handleCountrySelected}
                                    isUpdateInvite={isUpdateInvite}
                                    cancelUpdate={cancelUpdate}
                                    isDisable={isDisable}
                                />
                            ) : (
                                <TableUser
                                    textField={textField}
                                    setIsUpdateInvite={setIsUpdateInvite}
                                    setNextStep={setNextStep}
                                />
                            )}
                        </React.Fragment>
                    ) : (
                        <UserSearched userAccount={userAccount} />
                    )}
                </React.Fragment>
            )}

            {/* End Body */}
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 2,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                }}
            >
                <Box ml={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            ml: 5,
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            fontSize: '1.125rem',
                            ':hover': {
                                textDecoration: 'underline',
                            },
                        }}
                        onClick={() => history.goBack()}
                    >
                        Cancel Invite
                    </Typography>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                        variant="outlined"
                    >
                        Previous
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleNext}
                        variant="contained"
                        disabled={!nextStep}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                    >
                        {activeStep === steps.length - 1 ? 'Send' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default ChooseUser
