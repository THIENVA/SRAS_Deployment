import { Fragment, useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, Skeleton, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import ConferenceDetail from '../ConferenceDetail'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useUser } from '~/api/common/user'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const ReviewerEditConflict = () => {
    const showSnackbar = useSnackbar()
    const { submissionId, conferenceId } = useParams()
    const { getConflictCase } = usePaperSubmission()
    const { userId } = useAppSelector((state) => state.auth)
    const history = useHistory()
    const [conflicts, setConflicts] = useState([])
    const [reviewerConflicts, setReviewerConflicts] = useState([])
    const { getReviewerConflict, editReviewerConflict } = useUser()
    const [isDisable, setDisable] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [paperInfo, setPaperInfo] = useState({ id: '', title: '', trackName: '' })
    const { id, title, trackName } = paperInfo

    const handleSubmit = () => {
        setDisable(true)
        const submittedConflicts = reviewerConflicts.map((conflict) => conflict.conflictCaseId)
        editReviewerConflict(userId, conferenceId, submissionId, submittedConflicts)
            .then(() => {
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Edit Conflict Successfully.',
                // })
                history.push(`/conferences/${conferenceId}/submission/reviewer`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, cannot upload question image.',
                })
            })
            .finally(() => {
                setDisable(false)
            })
    }

    const handleCheckChange = (event, conflictName) => {
        const conflictId = event.target.value
        const updatedReviewerConflicts = cloneDeep(reviewerConflicts)
        const position = reviewerConflicts.findIndex((conflict) => conflict.conflictCaseId === conflictId)
        if (position === -1) {
            updatedReviewerConflicts.push({ conflictCaseId: conflictId, conflictCaseName: conflictName })
        } else {
            updatedReviewerConflicts.splice(position, 1)
        }
        setReviewerConflicts(updatedReviewerConflicts)
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const signal = controller.signal
        const secondSignal = secondController.signal

        const reviewerConflict = getReviewerConflict(userId, conferenceId, submissionId, signal)
        const getAllConflict = getConflictCase(secondSignal)

        Promise.all([reviewerConflict, getAllConflict])
            .then((response) => {
                const getReviewerConflicts = response[0].data
                const allConflict = response[1].data
                const { submissionId, submissionTitle, trackName, conflicts: reviewerConflicts } = getReviewerConflicts
                setPaperInfo({ id: submissionId, title: submissionTitle, trackName })
                setConflicts(allConflict)
                setReviewerConflicts(reviewerConflicts || [])
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])
    return (
        <ConferenceDetail>
            <Box maxWidth="lg" m="0 auto">
                <Box mb={4}>
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Reviewer Define Conflicts of Interest
                    </Typography>
                    {isLoading ? (
                        <Box>
                            {[0, 1, 2].map((index) => (
                                <Box
                                    key={index}
                                    sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}
                                >
                                    <Skeleton variant="text" sx={{ width: 800, height: 24 }} />
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Fragment>
                            <ListItemPopupInfo
                                itemName="Track name"
                                value={trackName}
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            />
                            <ListItemForID
                                itemName="Paper ID"
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            >
                                <IDField id={id} showButton={true} />
                            </ListItemForID>
                            {/* <ListItemPopupInfo
                                itemName="Paper ID"
                                value={id}
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            /> */}
                            <ListItemPopupInfo
                                itemName="Paper title"
                                value={title}
                                itemWidth={3}
                                valueWidth={9}
                                outerStyle={{ boxShadow: 'none' }}
                            />
                        </Fragment>
                    )}
                </Box>
                {isLoading ? (
                    <Box>
                        {[0, 1, 2, 3, 4].map((index) => (
                            <Box key={index} sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                                <Skeleton sx={{ width: 28, height: 42 }} />
                                <Skeleton variant="text" sx={{ ml: 2, width: 300, height: 32 }} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box>
                        {conflicts.map((value, index) => (
                            <Box key={index} sx={{ px: 2, display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
                                <Checkbox
                                    size="medium"
                                    name="isCorrect"
                                    value={value.conflictCaseId}
                                    onChange={(event) => handleCheckChange(event, value.conflictCaseName)}
                                    checked={reviewerConflicts.some(
                                        (conflict) => conflict.conflictCaseId === value.conflictCaseId
                                    )}
                                />
                                <Typography>{value.conflictCaseName}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}
                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 2,
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        display: 'flex',
                    }}
                >
                    <Box ml={6}>
                        <Button
                            color="error"
                            variant="contained"
                            sx={{ textTransform: 'none', height: 36 }}
                            onClick={() => history.goBack()}
                        >
                            Go Back
                        </Button>
                    </Box>
                    <Box ml={4}>
                        <LoadingButton
                            sx={{ textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isDisable}
                            loading={isDisable}
                            loadingPosition="start"
                            startIcon={<Save />}
                        >
                            Save Changes
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </ConferenceDetail>
    )
}

export default ReviewerEditConflict
