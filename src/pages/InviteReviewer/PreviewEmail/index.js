import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import { replaceLineBreak } from '../../../utils/commonFunction'

import { useReviewer } from '~/api/common/reviewer'
import { AppStyles } from '~/constants/colors'

const PreviewEmail = ({
    activeStep,
    handleBack,
    handleNext,
    fromFirstName,
    fromLastName,
    fromMiddleName,
    fromEmail,
    infoField,
    emailField,
    userId,
    trackIdSubmitted,
}) => {
    // const showSnackbar = useSnackbar()
    const { sendEmail } = useReviewer()
    const [loading, setIsLoading] = useState(false)
    const { completeBody, completeSubject } = emailField
    const { firstName, lastName, middleName, email, participantId } = infoField

    const history = useHistory()

    const handleSubmit = () => {
        setIsLoading(true)
        const info = {
            userId: userId,
            participantId: participantId,
            subject: completeSubject,
            body: replaceLineBreak(completeBody),
            trackId: trackIdSubmitted,
        }
        handleNext()
        sendEmail(info)
            .then(() => {})
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
                    Preview
                </Typography>
            </Box>
            <Grid container spacing={2} sx={{ px: 8, py: 1, border: 'inset 0 -1px 0 #edeeef' }}>
                <ListItemPopupInfo
                    itemName="From"
                    value={fromFirstName + ' ' + fromLastName + ' ' + fromMiddleName + ' <' + fromEmail + '>'}
                    itemWidth={4}
                    valueWidth={8}
                    itemNameTxtStyle={{ fontSize: 18 }}
                    valueTxtStyle={{ fontSize: 18 }}
                />

                <ListItemPopupInfo
                    itemName="To"
                    value={firstName + ' ' + lastName + ' ' + middleName + ' <' + email + '>'}
                    itemWidth={4}
                    valueWidth={8}
                    itemNameTxtStyle={{ fontSize: 18 }}
                    valueTxtStyle={{ fontSize: 18 }}
                />
                <ListItemPopupInfo
                    itemName="Subject"
                    value={completeSubject}
                    itemWidth={4}
                    valueWidth={8}
                    itemNameTxtStyle={{ fontSize: 18 }}
                    valueTxtStyle={{ fontSize: 18 }}
                />
                <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                    <Grid item xs={12}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'], fontSize: 18 }}>
                            Body
                        </Typography>
                    </Grid>
                    <Grid
                        xs={8}
                        item
                        sx={{
                            mt: 1,
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            border: '1px solid rgba(0, 0, 0, 0.15)',
                            p: 1,
                            borderRadius: 1,
                        }}
                    >
                        <Typography
                            component={'pre'}
                            sx={{
                                fontSize: 14,
                                color: AppStyles.colors['#586380'],
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                            }}
                        >
                            {completeBody}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
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
                        loading={loading}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                    >
                        Send
                    </LoadingButton>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default PreviewEmail
