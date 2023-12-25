import { useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ConfirmPopup = ({ open, handleClose, reviewersConflicts, generalInfo }) => {
    const { id, conferenceId } = useParams()
    const history = useHistory()
    const { firstName, lastName, middleName } = useAppSelector((state) => state.auth)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { editSubmissionConflict } = usePaperSubmission()
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)

        if (isChecked) {
            if (reviewersConflicts.length === 0) {
                roleName === ROLES_NAME.AUTHOR
                    ? history.push(`/conferences/${conferenceId}/submission-summary/${generalInfo.submissionId}`)
                    : history.push(`/conferences/${conferenceId}/submission-summary/${generalInfo.submissionId}`)
            } else {
                setLoading(true)
                const submittedData = reviewersConflicts.flatMap((item) =>
                    item.conflicts.map((conflict) => ({
                        reviewerId: item.reviewerId,
                        conflictCaseId: conflict.conflictCaseId,
                    }))
                )
                editSubmissionConflict(id, submittedData)
                    .then(() => {
                        roleName === ROLES_NAME.AUTHOR
                            ? history.push(
                                  `/conferences/${conferenceId}/submission-summary/${generalInfo.submissionId}`
                              )
                            : history.push(
                                  `/conferences/${conferenceId}/submission-summary/${generalInfo.submissionId}`
                              )
                    })
                    .catch(() => {
                        // showSnackbar({
                        //     severity: 'error',
                        //     children: 'Something went wrong, cannot upload question image.',
                        // })
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }

    const handleCheck = (event) => {
        setCheck(event.target.checked)
        if (event.target.checked === true) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Action Confirmation'}
            headerStyle={{ fontSize: 24, fontWeight: 'bold', color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Confirm"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center">
                <Box display={'flex'} alignItems={'center'}>
                    {/* <Box display={'flex'} alignItems={'center'} mb={1}>
                        <WarningAmber color="warning" />
                        <Typography sx={{ fontSize: 18, ml: 1 }}>
                            <strong>Caution: </strong>Once submitted, this decision is irreversible.
                        </Typography>
                    </Box> */}
                    <FormControlLabel control={<Checkbox value={isChecked} onChange={handleCheck} />} />
                    <Typography>
                        I,{' '}
                        <strong>
                            {firstName} {middleName && middleName} {lastName}
                        </strong>
                        , confirm that I have read everything before taking this action.
                    </Typography>
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default ConfirmPopup
