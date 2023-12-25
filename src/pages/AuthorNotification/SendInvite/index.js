import React, { useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Box, Typography } from '@mui/material'

import StatusTable from './StatusTable'

import useEmail from '~/api/common/email'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import Loading from '~/pages/Loading'
import { replaceLineBreak } from '~/utils/commonFunction'

const SendInvite = ({
    trackName,
    selectedStatusRows,
    // trackId,
    // userId,
    // conferenceRoleId,
    // allAuthors,
    collectEmailSent,
    submissionIds,
}) => {
    const { conferenceId } = useParams()
    const { userId } = useAppSelector((state) => state.auth)
    const { sendNotificationEmail, changeSubmissionStatus } = useEmail()
    const [loading, setLoading] = useState(true)
    // const { sendEmail } = useEmailTemplate()
    // const checkAllAuthor = allAuthors === 'true' ? true : false
    // const showSnackbar = useSnackbar()
    const {
        roleConference: { roleName },
        trackConference: { trackId },
    } = useAppSelector((state) => state.conference)

    useEffect(() => {
        const getTrackId = roleName === ROLES_NAME.TRACK_CHAIR ? trackId : null
        const formatEmail = collectEmailSent.map((item) => ({ ...item, body: replaceLineBreak(item.body) }))
        const emailObject = {
            conferenceId,
            trackId: getTrackId,
            accountIdOfSender: userId,
            emailToSend: formatEmail,
        }
        changeSubmissionStatus(submissionIds)
            .then(() => {
                sendNotificationEmail(emailObject).finally(() => {
                    setLoading(false)
                })
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const history = useHistory()
    return (
        <React.Fragment>
            {loading ? (
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
                            Send
                        </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 16, mb: 1 }}>
                        {/* You have sent emails. You can check the status using the following links or go back to{' '} */}
                        You have sent emails. You can now go back to{' '}
                        <Typography
                            component="span"
                            sx={{
                                fontSize: 16,
                                color: AppStyles.colors['#027A9D'],
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                                cursor: 'pointer',
                            }}
                            onClick={() => history.push(`/conferences/${conferenceId}/submission/submission-console`)}
                        >
                            {roleName} Console.
                        </Typography>
                    </Typography>

                    <StatusTable tableData={selectedStatusRows} trackName={trackName} />
                    <Box
                        sx={{
                            mt: 4,
                            px: 2,
                            py: 2,
                            boxShadow: 'inset 0 -1px 0 #edeeef',
                            backgroundColor: AppStyles.colors['#F8F9FA'],
                        }}
                    ></Box>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default SendInvite
