import { useState } from 'react'

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
import { TYPE_OF_QUESTIONS_NOTE } from '~/mock/SubmissionQuest'

const EditQuestionDialog = ({ open, onClose, title, handleEditQuestion, question }) => {
    const {
        text,
        required,
        type,
        typeName,
        showAs: showAsEdited,
        visibleToAuthor,
        visibleToReviewer,
        lockedEdit,
    } = question

    const [textField, setTextField] = useState(text)
    const [checkboxField, setCheckboxField] = useState({
        required: required,
        visibleToAuthor: visibleToAuthor,
        visibleToReviewer: visibleToReviewer,
        lockedEdit: lockedEdit,
    })
    const [typeSelected, setTypeSelected] = useState({ type: type, typeName: typeName })
    const [showAs, setShowAs] = useState(showAsEdited)

    const handleTextChange = (event) => {
        const { value } = event.target
        setTextField(value)
    }

    const handleCheckChange = (event) => {
        const { name, checked } = event.target
        setCheckboxField((prev) => ({ ...prev, [name]: checked }))
    }

    const handleTypeChange = (event) => {
        const { value } = event.target
        if (value === TYPES.COMMENT) {
            setTypeSelected({ type: 'textarea', typeName: value })
            setShowAs({
                result: {
                    render: 'textarea',
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
        }
    }

    const handleEditQuest = () => {
        const text = textField
        const { required, visibleToAuthor, visibleToReviewer, lockedEdit } = checkboxField
        const { type, typeName } = typeSelected

        const quest = {
            id: question.id,
            text,
            required,
            visibleToAuthor,
            visibleToReviewer,
            lockedEdit,
            type,
            typeName,
            showAs,
        }

        handleEditQuestion(quest)
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
                                value={textField}
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
                                checked={checkboxField.required}
                                name="required"
                                onChange={handleCheckChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        text="Locked for edit"
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                        otherTextProps={{ component: 'label', htmlFor: 'required' }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <Checkbox
                                sx={{ p: 0 }}
                                id="lockedEdit"
                                checked={checkboxField.lockedEdit}
                                name="lockedEdit"
                                onChange={handleCheckChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        text="Visible to Authors"
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                        otherTextProps={{ component: 'label', htmlFor: 'visible' }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <Checkbox
                                sx={{ p: 0 }}
                                id="visibleToAuthor"
                                name="visibleToAuthor"
                                value={checkboxField.visibleToAuthor}
                                onChange={handleCheckChange}
                            />
                        </Box>
                    </InputField>
                    <InputField
                        boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                        text="Visible to Authors"
                        textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
                        otherTextProps={{ component: 'label', htmlFor: 'visible' }}
                    >
                        <Box minWidth={300} maxWidth={500}>
                            <Checkbox
                                sx={{ p: 0 }}
                                id="visibleToReviewer"
                                name="visibleToReviewer"
                                value={checkboxField.visibleToReviewer}
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
                                {TYPE_OF_QUESTIONS_NOTE.map((question, index) => (
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
                    <Button onClick={handleEditQuest} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default EditQuestionDialog
