import { useState } from 'react'

import { cloneDeep } from 'lodash'

import { Add } from '@mui/icons-material'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import EditQuestionDialog from './EditQuestionDialog'
import NewNoteDialog from './NewNoteDialog'
import PreviewQuestionDialog from './PreviewQuestionDialog'
import Questions from './Questions'

const ChairNote = () => {
    const [openAddQuestion, setOpenAddQuestion] = useState(false)
    const [openEditQuestion, setOpenEditQuestion] = useState(false)
    const [openPreview, setOpenPreview] = useState(false)
    const [questions, setQuestions] = useState([])
    const [question, setQuestion] = useState(null)
    const [alertPopup, setAlertPopup] = useState(false)

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

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            New Note Question
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
                            <Button
                                type="button"
                                startIcon={<Add />}
                                variant="contained"
                                onClick={() => setOpenPreview(true)}
                            >
                                Preview
                            </Button>
                        </Box>
                        {questions.length > 0 && (
                            <Questions
                                questions={questions}
                                handleOpenEdit={handleOpenEdit}
                                openAlertPopup={openAlertPopup}
                                handleMoveQuestion={handleMoveQuestion}
                            />
                        )}
                    </Grid>
                </Grid>
            </Container>
            {openAddQuestion && (
                <NewNoteDialog
                    title={'Create New Question'}
                    onClose={handleCloseQuestion}
                    open={openAddQuestion}
                    handleAddingQuestion={handleAddingQuestion}
                />
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
            {alertPopup && (
                <AlertPopup
                    open={alertPopup}
                    handleClose={handleCloseAlertPopup}
                    handleDelete={() => handleDeleteQuestion(question.id)}
                >
                    Are you sure you want to delete the question?
                </AlertPopup>
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

export default ChairNote
