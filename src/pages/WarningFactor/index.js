import React, { useEffect, useState } from 'react'

import { NumericFormat } from 'react-number-format'
import { useParams } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, Grid, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useConference } from '~/api/common/conference'
import { AppStyles } from '~/constants/colors'

const NumericFormatThreshold = React.forwardRef(function NumericFormatThreshold(props, ref) {
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
            allowLeadingZeros={false}
            isAllowed={(values) => {
                const { floatValue } = values
                return floatValue > 0 && floatValue <= 100
            }}
            suffix={'/100'}
        />
    )
})

const NumericFormatTotalScore = React.forwardRef(function NumericFormatTotalScore(props, ref) {
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
            allowLeadingZeros={false}
            isAllowed={(values) => {
                const { floatValue } = values
                return floatValue >= 0 && floatValue < 100
            }}
            suffix={'/100'}
        />
    )
})

const WarningFactor = () => {
    const [warningThreshold, setWarningThreshold] = useState(80)
    const [totalScore, setTotalScore] = useState(50)
    const { getReviewAbnormalitySetting, updateReviewAbnormalitySetting } = useConference()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)
    const { conferenceId } = useParams()

    const handleWarningThreshold = (event) => {
        setWarningThreshold(parseFloat(event.target.value))
    }

    const handleTotalScore = (event) => {
        setTotalScore(parseInt(event.target.value))
    }

    const handleSubmit = () => {
        setButtonLoading(true)
        const data = {
            settings: JSON.stringify({
                warningThreshold,
                totalScore,
            }),
        }
        updateReviewAbnormalitySetting(conferenceId, JSON.stringify(data))
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Save review abnormality successfully.',
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        getReviewAbnormalitySetting(conferenceId, controller.signal)
            .then((response) => {
                if (response.data) {
                    setWarningThreshold(response.data.warningThreshold)
                    setTotalScore(response.data.totalScore)
                }
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Review Abnormality Detection
                        </Typography>
                        {loading ? (
                            <Loading height="80vh" />
                        ) : (
                            <React.Fragment>
                                <InputField text="Warning Threshold" boxStyle={{ mt: 2 }} textStyle={{ fontSize: 18 }}>
                                    <Box minWidth={100} maxWidth={200}>
                                        <TextField
                                            fullWidth={true}
                                            variant="outlined"
                                            sx={{ height: 50 }}
                                            size="small"
                                            name="threshold"
                                            value={warningThreshold}
                                            onChange={handleWarningThreshold}
                                            InputProps={{
                                                inputComponent: NumericFormatThreshold,
                                            }}
                                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        />
                                    </Box>
                                </InputField>
                                <InputField text="Review Total Score Threshold" textStyle={{ fontSize: 18 }}>
                                    <Box minWidth={100} maxWidth={200}>
                                        <TextField
                                            fullWidth={true}
                                            variant="outlined"
                                            sx={{ height: 50 }}
                                            size="small"
                                            name="totalThreshold"
                                            value={totalScore}
                                            onChange={handleTotalScore}
                                            InputProps={{
                                                inputComponent: NumericFormatTotalScore,
                                            }}
                                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        />
                                    </Box>
                                </InputField>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 1, p: 2, borderRadius: 2 }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: 36 }}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        onClick={handleSubmit}
                                        loading={buttonLoading}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default WarningFactor
