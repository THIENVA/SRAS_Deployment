import { useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Close } from '@mui/icons-material'
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import InputField from '~/components/InputField'
import TransitionCompo from '~/components/TransitionCompo'

import CommentSection from './CommentSection'
import OptionSection from './OptionSection'

import { TYPES } from '~/constants/SubmissionQuestionsConstant'
import { TYPE_OF_QUESTIONS } from '~/mock/SubmissionQuest'

const NewQuestionDialog = ({ open, onClose, title, handleAddingQuestion }) => {
    const [textField, setTextField] = useState({ title: '', text: '' })
    const [checkboxField, setCheckboxField] = useState({ isRequired: true, isVisibleToReviewers: false })
    const [typeSelected, setTypeSelected] = useState({ type: 'radio', typeName: TYPES.AGREEMENT })
    const [showAs, setShowAs] = useState({
        result: {
            render: 'checkbox',
            value: false,
            valueInput: false,
            valueInputType: 'boolean',
        },
    })

    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckChange = (event) => {
        const { name, checked } = event.target
        setCheckboxField((prev) => ({ ...prev, [name]: checked }))
    }

    const handleTypeChange = (event) => {
        const { value } = event.target
        if (value === TYPES.AGREEMENT) {
            setTypeSelected({ type: 'checkbox', typeName: value })
            setShowAs({
                result: {
                    render: 'checkbox',
                    multiple: false,
                    value: false,
                    valueInput: false,
                    valueInputType: 'boolean',
                },
            })
        } else if (value === TYPES.COMMENT) {
            setTypeSelected({ type: 'textarea', typeName: value })
            setShowAs({
                result: {
                    render: 'textarea',
                    multiple: false,
                    value: 8000,
                    valueInput: '',
                    valueInputType: 'string',
                },
            })
        } else if (value === TYPES.OPTIONS) {
            setTypeSelected({ type: 'select', typeName: value })
            setShowAs({
                result: {
                    render: 'radio',
                    multiple: false,
                    value: [],
                    valueInput: '',
                    valueInputType: 'string',
                },
            })
        } else if (value === TYPES.OPTIONSVALUE) {
            setTypeSelected({ type: 'selectWithValue', typeName: value })
            setShowAs({
                result: {
                    render: 'radio',
                    multiple: false,
                    value: [],
                    valueInput: '',
                    valueInputType: 'number',
                },
            })
        }
    }

    const handleAddQuest = () => {
        const { title, text } = textField
        const { isRequired, isVisibleToReviewers } = checkboxField
        const { type, typeName } = typeSelected

        const quest = {
            id: uuid(),
            title,
            text,
            isRequired,
            isVisibleToReviewers,
            type,
            typeName,
            showAs,
        }

        handleAddingQuestion(quest)
        onClose()
    }

    return (
        <Dialog
            TransitionComponent={TransitionCompo}
            fullWidth
            maxWidth="sm"
            onClose={onClose}
            open={open}
            keepMounted={false}
            sx={{ backdropFilter: 'blur(4px)' }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle>
                    {title}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <InputField
                        boxStyle={{ mt: 1, display: 'flex', alignItems: 'baseline' }}
                        text="Title"
                        isRequire={true}
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <TextField
                                fullWidth={true}
                                placeholder="title"
                                variant="outlined"
                                size="small"
                                required
                                name="title"
                                value={textField.title}
                                onChange={handleTextChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'baseline' }}
                        text="Text"
                        isRequire={true}
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <TextField
                                fullWidth={true}
                                placeholder="Text"
                                variant="outlined"
                                size="small"
                                multiline
                                rows={5}
                                required
                                name="text"
                                value={textField.text}
                                onChange={handleTextChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        text="Required"
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                        otherTextProps={{ component: 'label', htmlFor: 'required' }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <Checkbox
                                sx={{ p: 0 }}
                                id="required"
                                checked={checkboxField.isRequired}
                                name="isRequired"
                                onChange={handleCheckChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        text="Visible to user"
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                        otherTextProps={{ component: 'label', htmlFor: 'visible' }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <Checkbox
                                sx={{ p: 0 }}
                                id="visible"
                                name="isVisibleToReviewers"
                                value={checkboxField.isVisibleToReviewers}
                                onChange={handleCheckChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        text="Type"
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                    >
                        <FormControl size="small" sx={{ maxWidth: 300 }} fullWidth>
                            <Select size="small" value={typeSelected.typeName} onChange={handleTypeChange}>
                                {TYPE_OF_QUESTIONS.map((question, index) => (
                                    <MenuItem key={index} value={question}>
                                        {question}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </InputField>
                    {(() => {
                        switch (typeSelected.typeName) {
                            case 'Comment':
                                return <CommentSection showAs={showAs} setShowAs={setShowAs} />
                            case 'Options':
                                return <OptionSection showAs={showAs} setShowAs={setShowAs} />
                        }
                    })()}
                </DialogContent>
                <DialogActions sx={{ py: 1.5 }}>
                    <Button onClick={onClose} variant="contained" color="error" sx={{ mr: 1.5 }}>
                        Close
                    </Button>
                    <Button onClick={handleAddQuest} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default NewQuestionDialog
