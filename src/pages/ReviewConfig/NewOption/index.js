import { useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Box, TextField } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import InputLayout from './InputLayout'

import { AppStyles } from '~/constants/colors'
import { blockInvalidChar, isEmpty } from '~/utils/commonFunction'

const NewOption = ({ open, handleClose, handleAddCriterion, criteria }) => {
    const [textField, setTextField] = useState({ title: '', evaluationCriteria: '', gradeLevel: 1, factor: 1 })
    const { title, evaluationCriteria, gradeLevel, factor } = textField
    const [error, setError] = useState({
        title: false,
        evaluationCriteria: false,
        gradeLevel: false,
        factor: false,
    })
    const [messageError, setMessageError] = useState({
        title: '',
        evaluationCriteria: '',
        gradeLevel: '',
        factor: '',
    })

    const handleChange = (event) => {
        const { name, value } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = () => {
        const formatGradeLevel = +gradeLevel
        let formatFactor = +factor

        const isTitle = !isEmpty(title)
        const isEvaluationCriteria = !isEmpty(evaluationCriteria)
        const isGradeLevel = formatGradeLevel > 0 && formatGradeLevel <= 100
        const isFactor = factor > 0 && factor <= 100
        const isValid = isTitle && isEvaluationCriteria && isGradeLevel && isFactor

        if (!isValid) {
            setError({
                title: !isTitle,
                evaluationCriteria: !isEvaluationCriteria,
                gradeLevel: !isGradeLevel,
                factor: !isFactor,
            })
            setMessageError({
                title: !isTitle ? 'Criterion title must not be empty' : '',
                evaluationCriteria: !isEvaluationCriteria ? 'Evaluation Criterion must not be empty' : '',
                gradeLevel:
                    !isGradeLevel && formatGradeLevel <= 0
                        ? 'Grade level must be greater than 0'
                        : 'Grade level must be less or equal 100',
                factor:
                    !isFactor && formatFactor <= 0
                        ? 'factor must be greater than 0'
                        : 'factor level must be less or equal 100',
            })
        } else {
            const total = criteria.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.factor
            }, 0)
            if (total * 100 + formatFactor > 100) {
                formatFactor = 100 - total * 100
            }
            const formatCriterion = {
                title,
                evaluationCriterion: evaluationCriteria,
                gradeLevel: formatGradeLevel,
                factor: formatFactor / 100,
                id: uuid(),
            }
            handleAddCriterion(formatCriterion)
            handleClose()
        }
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'New Criterion'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
        >
            <Box sx={{ px: 3 }}>
                <InputLayout label="Criteria title">
                    <TextField
                        fullWidth
                        size="small"
                        value={title}
                        name="title"
                        onChange={handleChange}
                        error={error.title}
                        helperText={error.title ? messageError.title : ''}
                    />
                </InputLayout>
                <InputLayout label="Evaluation Criterion">
                    <TextField
                        fullWidth
                        size="small"
                        value={evaluationCriteria}
                        multiline
                        minRows={5}
                        maxRows={9}
                        name="evaluationCriteria"
                        onChange={handleChange}
                        error={error.evaluationCriteria}
                        helperText={error.evaluationCriteria ? messageError.evaluationCriteria : ''}
                    />
                </InputLayout>
                <InputLayout label="Grade level">
                    <TextField
                        inputProps={{ type: 'number', max: 100 }}
                        fullWidth
                        size="small"
                        onKeyDown={blockInvalidChar}
                        value={gradeLevel}
                        name="gradeLevel"
                        onChange={handleChange}
                        error={error.gradeLevel}
                        sx={{
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                display: 'none',
                            },
                            '& input[type=number]': {
                                MozAppearance: 'textfield',
                            },
                        }}
                        helperText={error.gradeLevel ? messageError.gradeLevel : ''}
                    />
                </InputLayout>
                <InputLayout label="Weight (%)">
                    <TextField
                        inputProps={{ type: 'number', max: 100 }}
                        fullWidth
                        size="small"
                        value={factor}
                        onKeyDown={blockInvalidChar}
                        name="factor"
                        onChange={handleChange}
                        sx={{
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                display: 'none',
                            },
                            '& input[type=number]': {
                                MozAppearance: 'textfield',
                            },
                        }}
                        error={error.factor}
                        helperText={error.factor ? messageError.factor : ''}
                    />
                </InputLayout>
            </Box>
        </ModalInfo>
    )
}

export default NewOption
