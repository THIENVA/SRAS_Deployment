import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { LoadingButton } from '@mui/lab'
import { Box, Button, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'
import SupportPlaceholder from '~/components/SupportPlaceholder'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useReviewer } from '~/api/common/reviewer'
import { AppStyles } from '~/constants/colors'

const ComposeEmail = ({
    infoField,
    handleTextChange,
    activeStep,
    handleBack,
    handleNext,
    emailField,
    fromFirstName,
    fromLastName,
    fromMiddleName,
    fromEmail,
    trackIdSubmitted,
    userId,
    setEmailField,
}) => {
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const { getEmail } = useReviewer()
    const { body, subject } = emailField
    const { firstName, lastName, middleName, email, participantId } = infoField

    const [loading, setIsLoading] = useState(false)
    const isDisable = !subject || !body

    const handleSubmit = () => {
        setIsLoading(true)
        const info = {
            userId: userId,
            participantId: participantId,
            subject: subject,
            body: body,
            trackId: trackIdSubmitted,
        }
        getEmail(info)
            .then((response) => {
                const data = response.data
                setEmailField((prev) => ({
                    ...prev,
                    completeBody: data?.body,
                    completeSubject: data?.subject,
                }))
                handleNext()
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setIsLoading(false)
            })
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
                <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                    Compose email
                </Typography>
            </Box>
            <Box mt={1} mb={3}>
                <Box ml={8} mt={2}>
                    <InputField
                        text="From"
                        isRequire={false}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        textBoxStyle={{ width: 80 }}
                    >
                        <Box ml={5}>
                            <Typography sx={{ fontSize: 18 }}>
                                {fromFirstName} {fromLastName} {fromMiddleName} {'<'}
                                {fromEmail}
                                {'>'}
                            </Typography>
                        </Box>
                    </InputField>
                    <InputField
                        text="To"
                        isRequire={false}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        textBoxStyle={{ width: 80 }}
                    >
                        <Box ml={5}>
                            <Typography sx={{ fontSize: 18 }}>
                                {firstName} {middleName && middleName} {lastName}
                                {' <'}
                                {email}
                                {'>'}
                            </Typography>
                        </Box>
                    </InputField>
                    <InputField
                        text="Subject"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 3 }}
                        textBoxStyle={{ width: 80 }}
                    >
                        <Box ml={5} minWidth={600}>
                            <TextField
                                fullWidth={true}
                                placeholder="Subject"
                                variant="outlined"
                                sx={{ height: 42 }}
                                value={subject}
                                name="subject"
                                onChange={handleTextChange}
                                size="small"
                            />
                        </Box>
                    </InputField>
                    <InputField
                        text="Body"
                        isRequire={true}
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex' }}
                        textBoxStyle={{ width: 80 }}
                    >
                        <Box ml={5} minWidth={600}>
                            <TextField
                                fullWidth={true}
                                variant="outlined"
                                value={body}
                                name="body"
                                onChange={handleTextChange}
                                size="small"
                                multiline
                                rows={8}
                            />
                        </Box>
                    </InputField>
                </Box>
            </Box>
            <SupportPlaceholder />
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
                        Cancel
                    </Typography>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                        variant="outlined"
                    >
                        Previous
                    </Button>
                    <LoadingButton
                        type="submit"
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isDisable}
                        loading={loading}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                    >
                        Next
                    </LoadingButton>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default ComposeEmail
