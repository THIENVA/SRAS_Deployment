import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Add, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SettingCompo from '~/components/SettingCompo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import EditQuestionDialog from './EditQuestionDialog'
import NewQuestionDialog from './NewQuestionDialog'
import PreviewQuestionDialog from './PreviewQuestionDialog'
import Questions from './Questions'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import useQuestionGroup from '~/api/common/question-group'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const SubmissionQuestion = () => {
    const {
        trackConference: { trackId },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { trackId: getTrackId } = useAppSelector((state) => state.trackForChair)
    const { getSubmissionQuestions, createSubmissionQuestions } = usePaperSubmission()
    const { getQuestionSubmission } = useQuestionGroup()
    const showSnackbar = useSnackbar()
    const [openAddQuestion, setOpenAddQuestion] = useState(false)
    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [openPreview, setOpenPreview] = useState(false)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [alertPopup, setAlertPopup] = useState(false)
    const [questionGroup, setQuestionGroup] = useState('')
    const [uniqueId, setUniqueId] = useState(uuid())

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? trackId : getTrackId

    const handleCloseQuestion = () => {
        setOpenAddQuestion(false)
    }

    const handleAddingQuestion = (question) => {
        const updatedQuestions = cloneDeep(questions)
        updatedQuestions.push(question)
        setQuestions(updatedQuestions)
    }

    const handleEditQuestion = (questionSelected) => {
        const updatedQuestions = cloneDeep(questions)
        const { id } = questionSelected
        const position = questions.findIndex((quest) => quest.id === id)
        updatedQuestions.splice(position, 1, questionSelected)
        setQuestions(updatedQuestions)
        setQuestion(null)
    }

    const handleDeleteQuestion = (id) => {
        const updatedQuestions = questions.filter((quest) => quest.id !== id)
        setQuestions(updatedQuestions)
        setQuestion(null)
        setAlertPopup(false)
    }

    const handleOpenEdit = (id) => {
        const questionFound = questions.find((quest) => quest.id === id)
        setQuestion(questionFound)
        setOpenEditQuestion(true)
    }

    const handleCloseEdit = () => {
        setOpenEditQuestion(false)
        setQuestion(null)
    }

    const openAlertPopup = (id) => {
        const questionFound = questions.find((quest) => quest.id === id)
        setQuestion(questionFound)
        setAlertPopup(true)
    }

    const handleCloseAlertPopup = () => {
        setAlertPopup(false)
        setQuestion(null)
    }

    const handleClosePreviewDialog = () => {
        setOpenPreview(false)
    }

    const handleMoveQuestion = (index, action) => {
        const quest = cloneDeep(questions.at(index))
        const nextQuest = cloneDeep(questions.at(index + 1))
        const prevQuest = cloneDeep(questions.at(index - 1))
        const updatedQuestions = cloneDeep(questions)
        if (action === 'down') {
            updatedQuestions[index] = nextQuest
            updatedQuestions[index + 1] = quest
        } else if (action === 'up') {
            updatedQuestions[index] = prevQuest
            updatedQuestions[index - 1] = quest
        }

        setQuestions(updatedQuestions)
    }

    const handleAddQuestions = () => {
        const formatQuestions = questions.map((quest) => ({
            ...quest,
            questionGroupId: questionGroup,
            trackId: trackIdSubmitted,
        }))
        setUpdateLoading(true)
        createSubmissionQuestions(trackIdSubmitted, { questions: formatQuestions })
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Update submission questions successfully.',
                })
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setUpdateLoading(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        setLoading(true)
        if (trackIdSubmitted) {
            const getQuestion = getQuestionSubmission(secondController.signal)
            const submissionQuestionsGet = getSubmissionQuestions(trackIdSubmitted, controller.signal)
            Promise.all([getQuestion, submissionQuestionsGet])
                .then((response) => {
                    const data = response[1].data
                    const groupQuestion = response[0].data
                    setQuestionGroup(groupQuestion)
                    setQuestions(data)
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
        }
        return () => {
            controller.abort()
            secondController.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackIdSubmitted, uniqueId])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Submission Questions
                        </Typography>
                        <Box sx={{ mt: 1.5, display: 'flex' }}>
                            <Button
                                type="button"
                                startIcon={<Add />}
                                variant="contained"
                                sx={{ mr: 1.5 }}
                                onClick={() => setOpenAddQuestion(true)}
                            >
                                Add New Question
                            </Button>
                            <Button type="button" variant="outlined" onClick={() => setOpenPreview(true)}>
                                Preview
                            </Button>
                            <SyncComponent setSync={() => setUniqueId(uuid())} />
                        </Box>
                        {loading ? (
                            <Loading height="70vh" />
                        ) : (
                            <React.Fragment>
                                {questions.length > 0 && (
                                    <Questions
                                        questions={questions}
                                        handleOpenEdit={handleOpenEdit}
                                        openAlertPopup={openAlertPopup}
                                        handleMoveQuestion={handleMoveQuestion}
                                    />
                                )}
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: 36 }}
                                        disabled={updateLoading}
                                        loading={updateLoading}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        onClick={handleAddQuestions}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
            {openAddQuestion && (
                <NewQuestionDialog
                    title={'Create New Question'}
                    onClose={handleCloseQuestion}
                    open={openAddQuestion}
                    handleAddingQuestion={handleAddingQuestion}
                />
            )}
            {alertPopup && (
                <AlertPopup
                    open={alertPopup}
                    handleClose={handleCloseAlertPopup}
                    handleDelete={() => handleDeleteQuestion(question.id)}
                >
                    Are you sure you want to delete the question?
                </AlertPopup>
            )}
            {openEditQuestion && (
                <EditQuestionDialog
                    open={openEditQuestion}
                    onClose={handleCloseEdit}
                    title="Edit Question"
                    handleEditQuestion={handleEditQuestion}
                    question={question}
                />
            )}
            {openPreview && (
                <PreviewQuestionDialog
                    questions={questions}
                    open={openPreview}
                    onClose={handleClosePreviewDialog}
                    title="Submission Questions Preview"
                />
            )}
        </ConferenceDetail>
    )
}

export default SubmissionQuestion
