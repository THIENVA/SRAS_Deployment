import React, { useEffect, useState } from 'react'

import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import { NumericFormat } from 'react-number-format'

import { RateReview } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Checkbox, Container, FormControlLabel, Skeleton, TextField, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import InputField from '~/components/InputField'

import ConferenceDetail from '../ConferenceDetail'
import ReviewChecklistCriteria from './ReviewChecklistCriteria'
import SuggestionForAuthor from './SuggestionForAuthor'
import SuggestionForChair from './SuggestionForChair'

import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { useTrack } from '~/api/common/track'
import { useUser } from '~/api/common/user'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

    return (
        <NumericFormat
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                })
            }}
            allowNegative={false}
            // allowLeadingZeros={false}
            decimalScale={2}
            isAllowed={(values) => {
                const { floatValue } = values
                return floatValue <= 100
            }}
            suffix={props.name}
        />
    )
})

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}

const ReviewerReviews = () => {
    // const showSnackbar = useSnackbar()
    const { firstName, lastName, middleName } = useAppSelector((state) => state.auth)
    const { getReviewCriteriaSetting } = useTrack()
    const {
        conference: { conferenceId },
    } = useAppSelector((state) => state.conference)
    const { submissionId, id, trackId } = useParams()
    const { editReviewTotalScoreCriteria } = useUser()
    const { getSubmissionInfo } = usePaperSubmission()
    const [generalInfo, setGeneralInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isLoading, setButtonLoading] = useState(false)
    const [suggestionForChair, setSuggestionForChair] = useState('')
    const [suggestionForAuthor, setSuggestionForAuthor] = useState('')
    const [checkListCriteria, setChecklistCriteria] = useState([])
    const [error, setError] = useState({ suggestionForChair: false, suggestionForAuthor: false })
    const [messageError, setMessageError] = useState({ suggestionForChair: '', suggestionForAuthor: '' })
    const [isChecked, setCheck] = useState(false)

    const history = useHistory()
    const [pp, setPP] = useState(0)

    const handleCheck = (event) => {
        setCheck(event.target.checked)
    }

    const handleSuggestionChairChange = (event) => {
        const { name } = event.target
        setSuggestionForChair(event.target.value)
        setError((prev) => ({ ...prev, [name]: '' }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
    }

    const handleSuggestionAuthorChange = (event) => {
        const { name } = event.target
        setSuggestionForAuthor(event.target.value)
        setError((prev) => ({ ...prev, [name]: '' }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
    }

    const handleSubmitRevisions = () => {
        const isSuggestForChair = !isEmpty(suggestionForChair)
        const isCommentAuthor = !isEmpty(suggestionForAuthor)
        const isValid = isCommentAuthor && isSuggestForChair
        if (!isValid) {
            setError({
                suggestionForChair: !isSuggestForChair,
                suggestionForAuthor: !isCommentAuthor,
            })
            setMessageError({
                suggestionForChair: !isSuggestForChair ? 'Suggestion for Chair must not be empty' : '',
                suggestionForAuthor: !isCommentAuthor ? 'Comment for Author must not be empty' : '',
            })
        } else {
            setButtonLoading(true)
            editReviewTotalScoreCriteria(id, {
                totalScore: Math.round(pp),
                suggestionsForChair: suggestionForChair,
                commentsForAuthors: suggestionForAuthor,
                reviewCriteriaResult: JSON.stringify(checkListCriteria),
            })
                .then(() => {
                    history.push(`/conferences/${conferenceId}/submission/reviewer`)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, Please Try again later.',
                    // })
                })
                .finally(() => {
                    setButtonLoading(false)
                })
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()

        const reviewCriteriaGet = getReviewCriteriaSetting(trackId, secondController.signal)
        const submissionInfoGet = getSubmissionInfo(submissionId, controller.signal)
        Promise.all([submissionInfoGet, reviewCriteriaGet])
            .then((response) => {
                const data = response[0].data
                const checklist = response[1].data ? response[1].data : []
                if (checklist.length > 0) {
                    const formatChecklist = checklist.map((item) => ({ ...item, grade: 0 }))
                    setChecklistCriteria(formatChecklist)
                }
                setGeneralInfo(data)
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
    }, [])

    useEffect(() => {
        const result =
            100 *
            checkListCriteria.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.grade / currentValue.gradeLevel).toFixed(3) * currentValue.factor
            }, 0)
        setPP(result)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkListCriteria])

    const isDisable = !isChecked

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography mb={3} sx={{ fontSize: 28, fontWeight: 600 }}>
                    Review Paper Submission
                </Typography>
                {loading ? (
                    <Box maxWidth={500}>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                    </Box>
                ) : (
                    <React.Fragment>
                        <InputField
                            text="Paper ID"
                            isRequire={false}
                            textStyle={{ fontSize: 18 }}
                            boxStyle={{ display: 'flex', alignItems: 'center', mb: 1 }}
                            textBoxStyle={{ width: 100 }}
                        >
                            <Box ml={3}>
                                <IDField id={generalInfo?.submissionId} showButton={true} />
                            </Box>
                        </InputField>
                        <InputField
                            text="Title"
                            isRequire={false}
                            textStyle={{ fontSize: 18 }}
                            boxStyle={{ display: 'flex', alignItems: 'center', mb: 1 }}
                            textBoxStyle={{ width: 100 }}
                        >
                            <Box ml={3}>
                                <Typography sx={{ fontSize: 18 }}>{generalInfo?.title}</Typography>
                            </Box>
                        </InputField>
                    </React.Fragment>
                )}
                <ReviewChecklistCriteria
                    loading={loading}
                    criteria={checkListCriteria}
                    setChecklistCriteria={setChecklistCriteria}
                />
                <Box display="flex" justifyContent="flex-end">
                    <InputField
                        text="Average Evaluation score (Average Score of Above Criteria)"
                        textStyle={{ fontSize: 18 }}
                        boxStyle={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        textBoxStyle={{ alignItems: 'center', mr: 1 }}
                        explainText={'This score will be used to calculate the average for this paper'}
                        explainPosition={'bottom-end'}
                    >
                        <Box maxWidth={100}>
                            <TextField
                                variant="outlined"
                                size="small"
                                name="/100"
                                disabled
                                value={pp}
                                required
                                InputProps={{
                                    inputComponent: NumericFormatCustom,
                                }}
                                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                            />
                        </Box>
                    </InputField>
                </Box>
                <SuggestionForChair
                    suggestionForChair={suggestionForChair}
                    handleChange={handleSuggestionChairChange}
                    messageError={messageError}
                    error={error}
                />
                <SuggestionForAuthor
                    suggestionForAuthor={suggestionForAuthor}
                    handleChange={handleSuggestionAuthorChange}
                    messageError={messageError}
                    error={error}
                />

                <Box mt={3} display={'flex'} alignItems={'center'}>
                    <FormControlLabel control={<Checkbox value={isChecked} onChange={handleCheck} />} sx={{ mr: 0 }} />
                    <Typography sx={{ fontSize: 18, ml: 1 }}>
                        I,{' '}
                        <strong>
                            {firstName} {middleName && middleName} {lastName}
                        </strong>
                        , agree that my submitting score is completely fair and accurate.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: 3,
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
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            onClick={() => history.goBack()}
                        >
                            Go Back
                        </Button>
                    </Box>
                    <Box ml={4}>
                        <LoadingButton
                            sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                            variant="contained"
                            onClick={handleSubmitRevisions}
                            disabled={isDisable}
                            loading={isLoading}
                            loadingPosition="start"
                            startIcon={<RateReview />}
                        >
                            Submit Review
                        </LoadingButton>
                    </Box>
                </Box>
            </Container>
        </ConferenceDetail>
    )
}

export default ReviewerReviews
