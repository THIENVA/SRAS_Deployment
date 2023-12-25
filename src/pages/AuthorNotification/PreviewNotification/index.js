import React, { useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { Box, Button, ThemeProvider, Typography, createTheme } from '@mui/material'

import ReviewerTable from './ReviewerTable'

import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'
import Loading from '~/pages/Loading'

const theme = createTheme({ typography: { fontSize: 16 } })

const PreviewNotification = ({
    handleNext,
    handleBack,
    activeStep,
    step,
    trackName,
    emailsSent,
    trackId,
    setEmailsSent,
    selectedStatusRows,
    loading,
    setLoading,
    isAllAuthor,
    setCollectEmailSent,
    setSubmissionIds,
}) => {
    const { conferenceId: id } = useParams()
    const { userId } = useAppSelector((state) => state.auth)
    const { previewNotification } = loading
    const { getEmailsSent } = usePaperSubmission()
    const checkAllAuthor = isAllAuthor === 'true' ? true : false
    const history = useHistory()

    useEffect(() => {
        setLoading((prev) => ({ ...prev, previewNotification: true }))
        const statuses = selectedStatusRows.map((status) => ({
            statusId: status.statusId,
            templateId: status.templateId,
        }))
        getEmailsSent({ userId, trackId, statuses, allAuthors: checkAllAuthor })
            .then((response) => {
                const getEmail = response.data.flatMap((item) =>
                    item.sendEmails.map((item) => ({
                        toEmail: item.toEmail,
                        body: item.body,
                        subject: item.subject,
                    }))
                )
                const submissionSet = new Set()
                response.data.forEach((item) => {
                    item.sendEmails.forEach((anotherItem) => {
                        submissionSet.add(anotherItem.submissionId)
                    })
                })
                setSubmissionIds(Array.from(submissionSet))
                setCollectEmailSent(getEmail)
                setEmailsSent(response.data)
            })
            .finally(() => {
                setLoading((prev) => ({ ...prev, previewNotification: false }))
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return previewNotification ? (
        <Loading height="70vh" />
    ) : (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    mb: 2,
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                    Preview
                </Typography>
            </Box>
            <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>{trackName}</Typography>

            <ThemeProvider theme={theme}>
                <Box mt={2}>
                    {emailsSent.map((status) => (
                        <Box mt={2} key={status.statusId}>
                            <ReviewerTable sendEmails={status.sendEmails} statusName={status.name} />
                        </Box>
                    ))}
                </Box>
            </ThemeProvider>

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
                        onClick={() => history.push(`/conferences/${id}/submission/submission-console`)}
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
                    <Button
                        type="submit"
                        onClick={handleNext}
                        variant="contained"
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                    >
                        {activeStep === step.length - 1 ? 'Send' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default PreviewNotification
