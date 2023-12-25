import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import StatusTable from './StatusTable'

import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import Loading from '~/pages/Loading'

const ReviewNotification = ({
    handleNext,
    handleBack,
    activeStep,
    step,
    trackName,
    selectedStatusRows,
    trackId,
    isAllAuthor,
    statuses,
    setStatuses,
    loading,
    setLoading,
}) => {
    const { conferenceId: id } = useParams()
    const { reviewNotification } = loading
    const { getNumberSubmissionWithStatus } = usePaperSubmission()
    const history = useHistory()
    const checkAllAuthor = isAllAuthor === 'true' ? true : false
    const [totalSubmission, setTotalSubmission] = useState(0)
    const [totalEmail, setTotalEmail] = useState(0)

    useEffect(() => {
        setLoading((prev) => ({ ...prev, reviewNotification: true }))
        const statusesId = selectedStatusRows.map((status) => status.statusId)
        getNumberSubmissionWithStatus({ trackId, paperStatuses: statusesId, allAuthors: checkAllAuthor })
            .then((response) => {
                const getStatuses = response.data.map((status) => ({
                    name: status.name,
                    numberOfEmail: status.numberOfEmail,
                    numberOfSubmissions: status.numberOfSubmissions,
                }))
                const totalSubmissions = getStatuses.reduce((total, item) => total + item.numberOfSubmissions, 0)
                const totalEmails = getStatuses.reduce((total, item) => total + item.numberOfEmail, 0)
                setTotalSubmission(totalSubmissions)
                setTotalEmail(totalEmails)
                setStatuses(getStatuses)
            })
            .finally(() => {
                setLoading((prev) => ({ ...prev, reviewNotification: false }))
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return reviewNotification ? (
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
                    Review
                </Typography>
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>
                Author Notification activity deadline
            </Typography>
            <Typography sx={{ fontSize: 16, mb: 1 }}>
                For all the tracks mentioned below the &quot;Author Notification&quot; activity will be marked as
                &quot;Completed&quot; and the deadline will be set to a date in past.
            </Typography>
            <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>Emails</Typography>
            <Typography sx={{ fontSize: 16, mb: 1 }}>
                Total of {totalEmail} emails will be sent to the primary contact authors only of {totalSubmission}{' '}
                papers.
            </Typography>

            <StatusTable tableData={statuses} trackName={trackName} />
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

export default ReviewNotification
