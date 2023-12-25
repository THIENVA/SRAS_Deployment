import React from 'react'

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
    Radio,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import TransitionCompo from '~/components/TransitionCompo'

import { SHOW_AS, TYPES } from '~/constants/SubmissionQuestionsConstant'

const PreviewQuestionDialog = ({ questions, open, onClose, title }) => {
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
                    {questions.map((quest, index) => (
                        <Box key={quest.id} sx={{ mb: 1.5 }}>
                            <Typography component="span" fontWeight={700} variant="subtitle1">
                                {index + 1}. {quest.text}
                            </Typography>
                            <Box component="span" sx={{ color: 'red', ml: 0.5 }}>
                                *
                            </Box>
                            <Box sx={{ ml: 4 }}>
                                {(() => {
                                    switch (quest.typeName) {
                                        case TYPES.COMMENT:
                                            return (
                                                <TextField
                                                    variant="outlined"
                                                    minRows={5}
                                                    multiline
                                                    size="small"
                                                    disabled
                                                    sx={{ width: 300, mt: 1 }}
                                                />
                                            )
                                        case TYPES.OPTIONS:
                                            return (
                                                <React.Fragment>
                                                    {(() => {
                                                        switch (quest.showAs.result.render) {
                                                            case SHOW_AS.RADIO:
                                                                return quest.showAs.result.value.map((value) => (
                                                                    <Box sx={{ mt: 1, display: 'flex' }} key={value.id}>
                                                                        <Radio sx={{ p: 0 }} disabled size="small" />
                                                                        <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                                                            {value.value}
                                                                        </Typography>
                                                                    </Box>
                                                                ))
                                                            case SHOW_AS.CHECKBOX:
                                                                return quest.showAs.result.value.map((value) => (
                                                                    <Box sx={{ mt: 1, display: 'flex' }} key={value.id}>
                                                                        <Checkbox sx={{ p: 0 }} disabled size="small" />
                                                                        <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                                                            {value.value}
                                                                        </Typography>
                                                                    </Box>
                                                                ))
                                                            case SHOW_AS.SELECT_ONE:
                                                                return (
                                                                    <FormControl
                                                                        size="small"
                                                                        sx={{ minWidth: 200, mt: 1 }}
                                                                    >
                                                                        <Select
                                                                            multiple={quest.showAs.result.multiple}
                                                                            size="small"
                                                                        >
                                                                            {quest.showAs.result.value.map((value) => (
                                                                                <MenuItem
                                                                                    value={value.value}
                                                                                    key={value.id}
                                                                                >
                                                                                    {value.value}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                )
                                                            case SHOW_AS.SELECT_MULTIPLE:
                                                                return (
                                                                    <FormControl
                                                                        size="small"
                                                                        sx={{ minWidth: 200, mt: 1 }}
                                                                    >
                                                                        <Select
                                                                            multiple={quest.showAs.result.multiple}
                                                                            size="small"
                                                                            value={quest.showAs.result.value.map(
                                                                                (value) => value.value
                                                                            )}
                                                                        >
                                                                            {quest.showAs.result.value.map((value) => (
                                                                                <MenuItem
                                                                                    value={value.value}
                                                                                    key={value.id}
                                                                                >
                                                                                    {value.value}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                )
                                                        }
                                                    })()}
                                                </React.Fragment>
                                            )
                                    }
                                })()}
                            </Box>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions sx={{ py: 1.5 }}>
                    <Button onClick={onClose} variant="contained" color="error" sx={{ mr: 1.5 }}>
                        Close
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default PreviewQuestionDialog
