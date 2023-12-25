import React, { memo } from 'react'

import { cloneDeep } from 'lodash'

import {
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography,
} from '@mui/material'

import TitleSection from '../TitleSection'

import { SHOW_AS, TYPES } from '~/constants/SubmissionQuestionsConstant'

const AdditionalQuestions = ({ questions, setQuestions, setMessageError, setError, error, messageError }) => {
    const handleQuestions = (
        id,
        typeName,
        parentIndex,
        event,
        typeInput,
        nameOfValue = undefined,
        selectProps = undefined,
        idItem = undefined
    ) => {
        setMessageError((prev) => ({ ...prev, ['questions']: '' }))
        setError((prev) => ({ ...prev, ['questions']: false }))
        const question = questions.find((quest) => quest.id === id)
        const updatedQuestion = cloneDeep(question)
        const updatedQuestions = cloneDeep(questions)
        if (typeName === TYPES.AGREEMENT) {
            updatedQuestion.showAs.result.valueInput = event.target.checked
            updatedQuestions.splice(parentIndex, 1, updatedQuestion)
        } else if (typeName === TYPES.COMMENT) {
            updatedQuestions[parentIndex].showAs.result.valueInput = event.target.value
        } else if (typeName === TYPES.OPTIONS) {
            if (typeInput === SHOW_AS.RADIO) {
                updatedQuestions[parentIndex].showAs.result.valueInput = event.target.value
            } else if (typeInput === SHOW_AS.CHECKBOX) {
                const { value, checked } = event.target
                if (checked) {
                    updatedQuestions[parentIndex].showAs.result.valueInput.push(value)
                } else {
                    updatedQuestions[parentIndex].showAs.result.valueInput = updatedQuestions[
                        parentIndex
                    ].showAs.result.valueInput.filter((item) => item !== value)
                }
            } else if (typeInput === SHOW_AS.SELECT_ONE) {
                updatedQuestions[parentIndex].showAs.result.valueInput = event.target.value
            } else if (typeInput === SHOW_AS.SELECT_MULTIPLE) {
                const { value } = event.target
                const newValue = typeof value === 'string' ? value.split(',') : value
                updatedQuestions[parentIndex].showAs.result.valueInput = [...newValue]
            }
        } else if (typeName === TYPES.OPTIONSVALUE) {
            const { value } = event.target
            if (typeInput === SHOW_AS.RADIO) {
                updatedQuestions[parentIndex].showAs.result.valueInput = cloneDeep({
                    value: nameOfValue,
                    point: value,
                    id: idItem,
                })
            } else if (typeInput === SHOW_AS.CHECKBOX) {
                const { value, checked } = event.target
                if (checked) {
                    updatedQuestions[parentIndex].showAs.result.valueInput.push({
                        value: nameOfValue,
                        point: value,
                        id: idItem,
                    })
                } else {
                    updatedQuestions[parentIndex].showAs.result.valueInput = updatedQuestions[
                        parentIndex
                    ].showAs.result.valueInput.filter((item) => item.point !== value)
                }
            } else if (typeInput === SHOW_AS.SELECT_ONE) {
                const { props } = selectProps
                updatedQuestions[parentIndex].showAs.result.valueInput = { value: props.children, point: props.value }
            } else if (typeInput === SHOW_AS.SELECT_MULTIPLE) {
                const { props } = selectProps
                const item = updatedQuestions[parentIndex].showAs.result.value.find((value) => value.id === props.value)
                if (updatedQuestions[parentIndex].showAs.result.valueInput.length === 0) {
                    updatedQuestions[parentIndex].showAs.result.valueInput.push(item)
                } else {
                    const position = updatedQuestions[parentIndex].showAs.result.valueInput.findIndex(
                        (value) => value.id === props.value
                    )
                    if (position === -1) {
                        updatedQuestions[parentIndex].showAs.result.valueInput.push(item)
                    } else {
                        updatedQuestions[parentIndex].showAs.result.valueInput.splice(position, 1)
                    }
                }
            }
        }
        setQuestions(updatedQuestions)
    }

    return (
        <Box mb={3}>
            <TitleSection>ADDITIONAL QUESTIONS</TitleSection>
            {error.questions && <FormHelperText error={error.questions}>{messageError.questions}</FormHelperText>}
            <Box mt={2}>
                {questions.map((quest, index) => (
                    <Box key={quest.id} sx={{ mb: 1.5 }}>
                        <Box display="flex">
                            <Typography variant="subtitle1" component="span" fontWeight={700}>
                                {index + 1}.
                            </Typography>
                            {quest.isRequired && (
                                <Box component={'span'} sx={{ color: 'red', ml: 1, mr: 0.25 }}>
                                    *
                                </Box>
                            )}
                            <Typography ml={0.5} variant="subtitle1" component="span" fontWeight={500}>
                                {quest.title}
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                            {quest.text}
                        </Typography>
                        <Box sx={{ ml: 4 }}>
                            {(() => {
                                switch (quest.typeName) {
                                    case TYPES.AGREEMENT:
                                        return (
                                            <Box sx={{ mt: 1 }} display="flex" alignItems="center">
                                                <Checkbox
                                                    sx={{ p: 0 }}
                                                    checked={quest.showAs.result.valueInput}
                                                    onChange={(event) =>
                                                        handleQuestions(
                                                            quest.id,
                                                            quest.typeName,
                                                            index,
                                                            event,
                                                            quest.showAs.result.valueInputType
                                                        )
                                                    }
                                                />
                                                <Typography sx={{ ml: 0.5 }}>I agree</Typography>
                                            </Box>
                                        )
                                    case TYPES.COMMENT:
                                        return (
                                            <TextField
                                                variant="outlined"
                                                minRows={10}
                                                multiline
                                                size="small"
                                                sx={{ width: 600, mt: 1 }}
                                                value={quest.showAs.result.valueInput}
                                                onChange={(event) =>
                                                    handleQuestions(
                                                        quest.id,
                                                        quest.typeName,
                                                        index,
                                                        event,
                                                        quest.showAs.result.valueInputType
                                                    )
                                                }
                                            />
                                        )
                                    case TYPES.OPTIONS:
                                        return (
                                            <React.Fragment>
                                                {(() => {
                                                    switch (quest.showAs.result.render) {
                                                        case SHOW_AS.RADIO:
                                                            return (
                                                                <RadioGroup value={quest.showAs.result.valueInput}>
                                                                    {quest.showAs.result.value.map((value) => (
                                                                        <FormControlLabel
                                                                            key={value.id}
                                                                            value={value.value}
                                                                            control={<Radio />}
                                                                            label={value.value}
                                                                            onChange={(event) =>
                                                                                handleQuestions(
                                                                                    quest.id,
                                                                                    quest.typeName,
                                                                                    index,
                                                                                    event,
                                                                                    SHOW_AS.RADIO
                                                                                )
                                                                            }
                                                                        />
                                                                    ))}
                                                                </RadioGroup>
                                                            )
                                                        case SHOW_AS.CHECKBOX:
                                                            return (
                                                                <FormGroup>
                                                                    {quest.showAs.result.value.map((value) => (
                                                                        <FormControlLabel
                                                                            key={value.id}
                                                                            control={<Checkbox />}
                                                                            label={value.value}
                                                                            value={value.value}
                                                                            onChange={(event) =>
                                                                                handleQuestions(
                                                                                    quest.id,
                                                                                    quest.typeName,
                                                                                    index,
                                                                                    event,
                                                                                    SHOW_AS.CHECKBOX
                                                                                )
                                                                            }
                                                                            checked={quest.showAs.result.valueInput.includes(
                                                                                value.value
                                                                            )}
                                                                        />
                                                                    ))}
                                                                </FormGroup>
                                                            )
                                                        case SHOW_AS.SELECT_ONE:
                                                            return (
                                                                <FormControl size="small" sx={{ minWidth: 200, mt: 1 }}>
                                                                    <Select
                                                                        multiple={quest.showAs.result.multiple}
                                                                        size="small"
                                                                        value={quest.showAs.result.valueInput}
                                                                        onChange={(event) =>
                                                                            handleQuestions(
                                                                                quest.id,
                                                                                quest.typeName,
                                                                                index,
                                                                                event,
                                                                                SHOW_AS.SELECT_ONE
                                                                            )
                                                                        }
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
                                                                <FormControl size="small" sx={{ minWidth: 200, mt: 1 }}>
                                                                    <Select
                                                                        multiple={quest.showAs.result.multiple}
                                                                        size="small"
                                                                        value={quest.showAs.result.valueInput}
                                                                        onChange={(event) =>
                                                                            handleQuestions(
                                                                                quest.id,
                                                                                quest.typeName,
                                                                                index,
                                                                                event,
                                                                                SHOW_AS.SELECT_MULTIPLE
                                                                            )
                                                                        }
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
                                    case TYPES.OPTIONSVALUE:
                                        return (
                                            <React.Fragment>
                                                {(() => {
                                                    switch (quest.showAs.result.render) {
                                                        case SHOW_AS.RADIO:
                                                            return (
                                                                <RadioGroup>
                                                                    {quest.showAs.result.value.map((value) => (
                                                                        <FormControlLabel
                                                                            key={value.id}
                                                                            value={value.point}
                                                                            control={<Radio />}
                                                                            label={value.value}
                                                                            onChange={(event) =>
                                                                                handleQuestions(
                                                                                    quest.id,
                                                                                    quest.typeName,
                                                                                    index,
                                                                                    event,
                                                                                    SHOW_AS.RADIO,
                                                                                    value.value,
                                                                                    undefined,
                                                                                    value.id
                                                                                )
                                                                            }
                                                                        />
                                                                    ))}
                                                                </RadioGroup>
                                                            )
                                                        case SHOW_AS.CHECKBOX:
                                                            return (
                                                                <FormGroup>
                                                                    {quest.showAs.result.value.map((value) => (
                                                                        <FormControlLabel
                                                                            key={value.id}
                                                                            control={<Checkbox />}
                                                                            label={value.value}
                                                                            value={value.point}
                                                                            onChange={(event) =>
                                                                                handleQuestions(
                                                                                    quest.id,
                                                                                    quest.typeName,
                                                                                    index,
                                                                                    event,
                                                                                    SHOW_AS.CHECKBOX,
                                                                                    value.value,
                                                                                    undefined,
                                                                                    value.id
                                                                                )
                                                                            }
                                                                            checked={quest.showAs.result.valueInput.some(
                                                                                (item) => item.id === value.id
                                                                            )}
                                                                        />
                                                                    ))}
                                                                </FormGroup>
                                                            )
                                                        case SHOW_AS.SELECT_ONE:
                                                            return (
                                                                <FormControl size="small" sx={{ minWidth: 200, mt: 1 }}>
                                                                    <Select
                                                                        multiple={quest.showAs.result.multiple}
                                                                        size="small"
                                                                        value={quest.showAs.result.valueInput.point}
                                                                        onChange={(event, props) =>
                                                                            handleQuestions(
                                                                                quest.id,
                                                                                quest.typeName,
                                                                                index,
                                                                                event,
                                                                                SHOW_AS.SELECT_ONE,
                                                                                undefined,
                                                                                props,
                                                                                undefined
                                                                            )
                                                                        }
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
                                                                <FormControl size="small" sx={{ minWidth: 200, mt: 1 }}>
                                                                    <Select
                                                                        multiple={quest.showAs.result.multiple}
                                                                        size="small"
                                                                        value={quest.showAs.result.valueInput.map(
                                                                            (item) => item.value
                                                                        )}
                                                                        renderValue={(selected) => selected.join(', ')}
                                                                        onChange={(event, props) =>
                                                                            handleQuestions(
                                                                                quest.id,
                                                                                quest.typeName,
                                                                                index,
                                                                                event,
                                                                                SHOW_AS.SELECT_MULTIPLE,
                                                                                undefined,
                                                                                props,
                                                                                undefined
                                                                            )
                                                                        }
                                                                    >
                                                                        {quest.showAs.result.value.map((value) => (
                                                                            <MenuItem value={value.id} key={value.id}>
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
            </Box>
        </Box>
    )
}

export default memo(AdditionalQuestions)
