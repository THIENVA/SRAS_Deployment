import React from 'react'

import { Box, Typography } from '@mui/material'

import { SHOW_AS, TYPES } from '~/constants/SubmissionQuestionsConstant'

const QuestionsResponse = ({ questions }) => {
    return (
        <React.Fragment>
            {questions.map((question, index) => {
                return (
                    <Box key={index}>
                        <Typography gutterBottom variant="subtitle1" component="span" fontWeight={700}>
                            {index + 1}. {question.title}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                            {question.text}
                        </Typography>
                        {(() => {
                            switch (question.typeName) {
                                case TYPES.AGREEMENT:
                                    return (
                                        <Typography mt={1} mb={0.5}>
                                            {question.showAs.result.valueInput
                                                ? 'Agreement Accepted'
                                                : '[Not Answered]'}
                                        </Typography>
                                    )
                                case TYPES.COMMENT:
                                    return (
                                        <Typography mt={1} mb={0.5}>
                                            {question.showAs.result.valueInput
                                                ? question.showAs.result.valueInput
                                                : '[Not Answer]'}
                                        </Typography>
                                    )
                                case TYPES.OPTIONS:
                                    return (
                                        <React.Fragment>
                                            {(() => {
                                                switch (question.showAs.result.render) {
                                                    case SHOW_AS.RADIO:
                                                        return (
                                                            <Typography mt={1} mb={0.5}>
                                                                {question.showAs.result.valueInput
                                                                    ? question.showAs.result.valueInput
                                                                    : '[Not Answer]'}
                                                            </Typography>
                                                        )
                                                    case SHOW_AS.CHECKBOX:
                                                        return question.showAs.result.valueInput.length === 0 ? (
                                                            <Typography mt={1} mb={0.5}>
                                                                [Not Answer]
                                                            </Typography>
                                                        ) : (
                                                            <Box mt={1}>
                                                                {question.showAs.result.valueInput.map(
                                                                    (value, index) => (
                                                                        <Typography gutterBottom key={index}>
                                                                            {value}
                                                                        </Typography>
                                                                    )
                                                                )}
                                                            </Box>
                                                        )
                                                    case SHOW_AS.SELECT_ONE:
                                                        return (
                                                            <Typography mt={1} mb={0.5}>
                                                                {question.showAs.result.valueInput
                                                                    ? question.showAs.result.valueInput
                                                                    : '[Not Answer]'}
                                                            </Typography>
                                                        )
                                                    case SHOW_AS.SELECT_MULTIPLE:
                                                        return question.showAs.result.valueInput.length === 0 ? (
                                                            <Typography mt={1} mb={0.5}>
                                                                [Not Answer]
                                                            </Typography>
                                                        ) : (
                                                            <Box mt={1}>
                                                                {question.showAs.result.valueInput.map(
                                                                    (value, index) => (
                                                                        <Typography gutterBottom key={index}>
                                                                            {value}
                                                                        </Typography>
                                                                    )
                                                                )}
                                                            </Box>
                                                        )
                                                }
                                            })()}
                                        </React.Fragment>
                                    )
                                case TYPES.OPTIONSVALUE:
                                    return (
                                        <React.Fragment>
                                            {(() => {
                                                switch (question.showAs.result.render) {
                                                    case SHOW_AS.RADIO:
                                                        return (
                                                            <Typography mt={1} mb={0.5}>
                                                                {question.showAs.result.valueInput.value
                                                                    ? question.showAs.result.valueInput.value
                                                                    : '[Not Answer]'}
                                                            </Typography>
                                                        )
                                                    case SHOW_AS.CHECKBOX:
                                                        return question.showAs.result.valueInput.length === 0 ? (
                                                            <Typography mt={1} mb={0.5}>
                                                                [Not Answer]
                                                            </Typography>
                                                        ) : (
                                                            <Box mt={1}>
                                                                {question.showAs.result.valueInput.map(
                                                                    (value, index) => (
                                                                        <Typography gutterBottom key={index}>
                                                                            {value.value}
                                                                        </Typography>
                                                                    )
                                                                )}
                                                            </Box>
                                                        )
                                                    case SHOW_AS.SELECT_ONE:
                                                        return (
                                                            <Typography mt={1} mb={0.5}>
                                                                {question.showAs.result.valueInput.value
                                                                    ? question.showAs.result.valueInput.value
                                                                    : '[Not Answer]'}
                                                            </Typography>
                                                        )
                                                    case SHOW_AS.SELECT_MULTIPLE:
                                                        return question.showAs.result.valueInput.length === 0 ? (
                                                            <Typography mt={1} mb={0.5}>
                                                                [Not Answer]
                                                            </Typography>
                                                        ) : (
                                                            <Box mt={1}>
                                                                {question.showAs.result.valueInput.map(
                                                                    (value, index) => (
                                                                        <Typography gutterBottom key={index}>
                                                                            {value.value}
                                                                        </Typography>
                                                                    )
                                                                )}
                                                            </Box>
                                                        )
                                                }
                                            })()}
                                        </React.Fragment>
                                    )
                            }
                        })()}
                    </Box>
                )
            })}
        </React.Fragment>
    )
}

export default QuestionsResponse
