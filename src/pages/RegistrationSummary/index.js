import { useHistory, useParams } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import RegistrationItems from './RegistrationItems'

import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const RegistrationSummary = ({ order, userInfo }) => {
    const {
        conference: { conferenceName, conferenceFullName },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)

    const registrationPapers = order?.registration?.registrationPapers
    const registeredPapers = order?.registeredPapers

    const mergedPapers = []

    for (const registrationPaper of registrationPapers) {
        const submissionId = registrationPaper?.submissionId

        const matchingRegisteredPaper = registeredPapers?.find((paper) => paper?.submissionId === submissionId)

        if (matchingRegisteredPaper) {
            const mergedPaper = {
                ...registrationPaper,
                ...matchingRegisteredPaper,
            }

            mergedPapers.push(mergedPaper)
        }
    }
    const history = useHistory()
    const { conferenceId } = useParams()
    const { email, firstName, lastName, middleName, organization } = useAppSelector((state) => state.auth)

    const registrantInfo =
        roleName === ROLES_NAME.AUTHOR
            ? firstName + ' ' + middleName + ' ' + lastName + ' (' + email + ')'
            : userInfo.firstName + ' ' + userInfo.middleName + ' ' + userInfo.lastName + ' (' + userInfo.email + ')'

    const registrantOrg = roleName === ROLES_NAME.AUTHOR ? organization : userInfo.organization
    return (
        <Box width={ScreenSize.ScreenWidth} m="0 auto">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box></Box>
                <Box>
                    <Typography
                        textAlign={'center'}
                        sx={{ fontWeight: 600, fontSize: 36, color: AppStyles.colors['#002b5d'] }}
                    >
                        Registration Summary
                    </Typography>{' '}
                    <Typography
                        textAlign={'center'}
                        fontWeight={'bold'}
                        sx={{ fontSize: 18, color: AppStyles.colors['#333333'] }}
                    >
                        Review registration information below
                    </Typography>
                </Box>
                <Button
                    type="button"
                    variant="contained"
                    onClick={() => {
                        if (roleName === ROLES_NAME.AUTHOR) {
                            history.push(`/conferences/${conferenceId}/submission/author`)
                        } else {
                            history.push(`/conferences/${conferenceId}/manuscript`)
                        }
                    }}
                    sx={{ textTransform: 'none', height: 36, ml: 2 }}
                >
                    Finish
                </Button>
            </Box>

            <Box
                sx={{
                    mt: 3,
                    px: 2,
                    py: 1,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 20, color: AppStyles.colors['#F7F7F7'] }}>
                    Registration Information
                </Typography>
            </Box>

            <Box mt={2} sx={{ px: 2 }} display="flex" alignItems={'center'}>
                <Box width={600}>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 18, color: AppStyles.colors['#333333'] }}>
                            <strong>Registrant</strong>
                        </Typography>
                        <Typography textAlign="left" sx={{ fontSize: 18 }}>
                            {registrantInfo}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 18, color: AppStyles.colors['#333333'] }}>
                            <strong>Registrant Organization</strong>
                        </Typography>
                        <Typography textAlign="left" sx={{ fontSize: 18 }}>
                            {registrantOrg ? registrantOrg : 'N/A'}
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Box mb={3}>
                        <Typography sx={{ fontSize: 18, color: AppStyles.colors['#333333'] }}>
                            <strong>Conference Name</strong>
                        </Typography>
                        <Typography textAlign="left" sx={{ fontSize: 18 }}>
                            {conferenceFullName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: 18, color: AppStyles.colors['#333333'] }}>
                            <strong>Conference Short Name</strong>
                        </Typography>
                        <Typography textAlign="left" sx={{ fontSize: 18 }}>
                            {conferenceName}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 20, color: AppStyles.colors['#F7F7F7'] }}>
                    Paper Information
                </Typography>
            </Box>
            <RegistrationItems data={mergedPapers} />
        </Box>
    )
}

export default RegistrationSummary
