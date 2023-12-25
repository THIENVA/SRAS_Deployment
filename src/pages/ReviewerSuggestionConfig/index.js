import React, { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import { NumericFormat } from 'react-number-format'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material'
import InputField from '~/components/InputField'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import SectionLayout from './SectionLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
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
            allowLeadingZeros={false}
            decimalScale={2}
            isAllowed={(values) => {
                const { floatValue } = values
                return floatValue <= 1
            }}
            suffix={props.name}
        />
    )
})

NumericFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}
const ReviewerSuggestionConfig = () => {
    const { trackId } = useAppSelector((state) => state.trackForChair)
    const { getSubjectAreasRelevance, createSubjectAreasRelevance } = useTrack()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [radioCheck, setRadioCheck] = useState('true')
    const [pp, setPP] = useState(0)
    const [ps, setPS] = useState(0)
    const [sp, setSP] = useState(0)
    const [ss, setSS] = useState(0)

    const handleChangeRadio = (event) => {
        setRadioCheck(event.target.value)
    }
    const handlePPChange = (event) => {
        setPP(parseFloat(event.target.value))
    }
    const handlePSChange = (event) => {
        setPS(parseFloat(event.target.value))
    }
    const handleSPChange = (event) => {
        setSP(parseFloat(event.target.value))
    }
    const handleSSChange = (event) => {
        setSS(parseFloat(event.target.value))
    }
    const handleSubmit = () => {
        setLoading(true)
        if (radioCheck === 'false') {
            createSubjectAreasRelevance(trackId, {
                isDefault: false,
                pp: pp,
                ps: ps,
                sp: sp,
                ss: ss,
            })
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Custom Subject Relevance Scores Successfully Save',
                    })
                })
                .catch((err) => {
                    showSnackbar({
                        severity: 'error',
                        children: err.message,
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            createSubjectAreasRelevance(trackId, {
                isDefault: true,
            })
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Subject Relevance Scores Default Successfully Save',
                    })
                })
                .catch((err) => {
                    showSnackbar({
                        severity: 'error',
                        children: err.message,
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (trackId) {
            getSubjectAreasRelevance(trackId, signal)
                .then((response) => {
                    const data = response.data?.subjectAreaRelevanceCoefficients
                    setRadioCheck(String(data?.isDefault))
                    setPP(data?.pp)
                    setPS(data?.ps)
                    setSP(data?.sp)
                    setSS(data?.ss)
                })
                .catch((err) => {
                    showSnackbar({
                        severity: 'error',
                        children: err.message,
                    })
                })
        }

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackId])

    const isDisable = radioCheck === 'true'

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Subject Relevance Scores
                        </Typography>
                        <SectionLayout title="WEIGHTS">
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <FormControl>
                                    <RadioGroup value={radioCheck} onChange={handleChangeRadio}>
                                        <FormControlLabel
                                            value={true}
                                            control={<Radio size="small" />}
                                            label="Default"
                                        />
                                        <FormControlLabel
                                            value={false}
                                            control={<Radio size="small" />}
                                            label="Custom"
                                        />
                                    </RadioGroup>
                                </FormControl>

                                <InputField
                                    text="Paper and reviewer exact match on Primary"
                                    textStyle={{ fontSize: 18 }}
                                >
                                    <Box minWidth={100} maxWidth={200}>
                                        <TextField
                                            fullWidth={true}
                                            placeholder="pp"
                                            variant="outlined"
                                            sx={{ height: 50 }}
                                            size="small"
                                            name="pp"
                                            value={pp}
                                            onChange={handlePPChange}
                                            required
                                            disabled={isDisable}
                                            InputProps={{
                                                inputComponent: NumericFormatCustom,
                                            }}
                                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        />
                                    </Box>
                                </InputField>
                                <InputField
                                    text="Primary subject area of reviewer matches secondary subject area of paper"
                                    textStyle={{ fontSize: 18 }}
                                >
                                    <Box minWidth={100} maxWidth={200}>
                                        <TextField
                                            fullWidth={true}
                                            placeholder="ps"
                                            variant="outlined"
                                            sx={{ height: 50 }}
                                            size="small"
                                            name="ps"
                                            value={ps}
                                            onChange={handlePSChange}
                                            required
                                            disabled={isDisable}
                                            InputProps={{
                                                inputComponent: NumericFormatCustom,
                                            }}
                                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        />
                                    </Box>
                                </InputField>
                                <InputField
                                    text="Primary subject area of paper matches secondary subject area of reviewer"
                                    textStyle={{ fontSize: 18 }}
                                >
                                    <Box minWidth={100} maxWidth={200}>
                                        <TextField
                                            fullWidth={true}
                                            placeholder="sp"
                                            variant="outlined"
                                            sx={{ height: 50 }}
                                            size="small"
                                            name="sp"
                                            value={sp}
                                            onChange={handleSPChange}
                                            required
                                            disabled={isDisable}
                                            InputProps={{
                                                inputComponent: NumericFormatCustom,
                                            }}
                                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        />
                                    </Box>
                                </InputField>
                                <InputField
                                    text="Secondary subject area of reviewer overlaps with secondary subject area of paper"
                                    textStyle={{ fontSize: 18 }}
                                >
                                    <Box minWidth={100} maxWidth={200}>
                                        <TextField
                                            fullWidth={true}
                                            placeholder="ss"
                                            variant="outlined"
                                            sx={{ height: 50 }}
                                            size="small"
                                            name="ss"
                                            value={ss}
                                            onChange={handleSSChange}
                                            required
                                            disabled={isDisable}
                                            InputProps={{
                                                inputComponent: NumericFormatCustom,
                                            }}
                                            inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                        />
                                    </Box>
                                </InputField>
                            </Box>
                        </SectionLayout>
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                        >
                            <LoadingButton
                                variant="contained"
                                sx={{ textTransform: 'none', height: 36 }}
                                disabled={loading}
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<Save />}
                                onClick={() => handleSubmit()}
                            >
                                Save Changes
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default ReviewerSuggestionConfig
