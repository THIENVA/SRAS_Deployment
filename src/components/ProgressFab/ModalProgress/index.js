import React, { Fragment, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory } from 'react-router-dom'

import { ExpandMore } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Popover,
    Select,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { handleCurrentStep, handleFinishStep, handleNextStep, handleUpdateSteps } from '~/features/track-steps'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'

const ModalProgress = ({
    open,
    popoverId,
    handleClose,
    anchorEl,
    currentStep,
    allTrack,
    handleChange,
    trackIdChair,
    loading,
}) => {
    const {
        roleConference: { roleName },
        conference: { conferenceId },
    } = useAppSelector((state) => state.conference)
    const { finishStep } = useTrack()
    const showSnackbar = useSnackbar()
    const {
        stepSelected: { guideLines, trackId },
        steps,
        guidelineGroup,
    } = useAppSelector((state) => state.trackSteps)

    const dispatch = useAppDispatch()

    const history = useHistory()
    const [finishLoading, setFinishLoading] = useState(false)
    const [finishStepLoading, setFinishStepLoading] = useState(false)

    const handleNext = (index) => {
        const updatedSteps = cloneDeep(steps)
        const position = updatedSteps.findIndex((step) => step.trackId === trackId)
        if (updatedSteps[position].currentStep === updatedSteps[position].guideLines.length - 1) {
            setFinishStepLoading(true)
            finishStep({ trackId, guidelineGroup })
                .then(() => {
                    updatedSteps[position].currentStep = updatedSteps[position].guideLines.length
                    updatedSteps[position].guideLines = new Array()
                    dispatch(handleCurrentStep(updatedSteps[position]))
                    dispatch(handleFinishStep())
                    dispatch(handleUpdateSteps(updatedSteps))
                    handleClose()
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later',
                    })
                })
                .finally(() => {
                    setFinishStepLoading(false)
                })
        } else {
            updatedSteps[position].currentStep = updatedSteps[position].currentStep + 1
            dispatch(handleUpdateSteps(updatedSteps))
            dispatch(handleNextStep())
            if (!(currentStep === guideLines.length - 1)) {
                const link = guideLines[index + 1].route
                let updatedLink = link
                if (link.includes(':conferenceId')) {
                    updatedLink = updatedLink.replace(':conferenceId', conferenceId)
                }

                history.push(updatedLink)
            }
        }
    }

    const handleIgnore = () => {
        const updatedSteps = cloneDeep(steps)
        const position = updatedSteps.findIndex((step) => step.trackId === trackId)
        updatedSteps[position].currentStep = updatedSteps[position].currentStep + 1
        dispatch(handleUpdateSteps(updatedSteps))
        dispatch(handleNextStep())
    }

    const handleGetStarted = () => {
        const updatedSteps = cloneDeep(steps)
        const position = updatedSteps.findIndex((step) => step.trackId === trackId)
        updatedSteps[position].currentStep = 0
        dispatch(handleUpdateSteps(updatedSteps))
        dispatch(handleNextStep())
        if (!(currentStep === guideLines.length - 1)) {
            const link = guideLines[0].route
            let updatedLink = link
            if (link.includes(':conferenceId')) {
                updatedLink = updatedLink.replace(':conferenceId', conferenceId)
            }

            history.push(updatedLink)
        }
    }

    const handleFinish = () => {
        setFinishLoading(true)
        finishStep({ trackId, guidelineGroup })
            .then(() => {
                const updatedSteps = cloneDeep(steps)
                const position = updatedSteps.findIndex((step) => step.trackId === trackId)
                updatedSteps[position].currentStep = updatedSteps[position].guideLines.length
                updatedSteps[position].guideLines = new Array()
                dispatch(handleCurrentStep(updatedSteps[position]))
                dispatch(handleFinishStep())
                dispatch(handleUpdateSteps(updatedSteps))
                handleClose()
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later',
                })
            })
            .finally(() => {
                setFinishLoading(false)
            })
    }

    return (
        <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
        >
            <React.Fragment>
                <Box sx={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.08)' }}>
                    <Box display="flex" justifyContent="space-between" mt={1} alignItems="center" mx={2}>
                        <Typography sx={{ fontSize: 18, color: '#39739d' }}>First Time Walking Wizard</Typography>
                        <Tooltip placement="top-start" title="Close" TransitionComponent={Zoom}>
                            <IconButton size="small" sx={{ opacity: 0.7 }} disableRipple onClick={() => handleClose()}>
                                <ExpandMore fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
                {loading ? (
                    <Box height={200} display="flex" alignItems="center" justifyContent="center">
                        <CircularProgress size={50} />
                    </Box>
                ) : (
                    <Fragment>
                        {roleName === ROLES_NAME.CHAIR && (
                            <FormControl sx={{ pl: 3, maxWidth: 256, mt: 2 }} size="small" fullWidth>
                                <Select size="small" value={trackIdChair} onChange={handleChange}>
                                    {allTrack.map((track) => (
                                        <MenuItem key={track.id} value={track.id}>
                                            {track.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <Box p={3} sx={{ borderRadius: 10 }} maxWidth={400}>
                            {guideLines.length > 0 && (
                                <React.Fragment>
                                    {currentStep === -1 && (
                                        <Button
                                            variant="contained"
                                            sx={{ mb: 2 }}
                                            color="info"
                                            onClick={handleGetStarted}
                                        >
                                            Get Started
                                        </Button>
                                    )}
                                    <Stepper activeStep={currentStep} orientation="vertical">
                                        {guideLines.map((step, index) => (
                                            <Step key={index}>
                                                <StepLabel
                                                    optional={
                                                        index === guideLines.length - 1 ? (
                                                            <Typography variant="caption">Last step</Typography>
                                                        ) : null
                                                    }
                                                >
                                                    {step.name}
                                                </StepLabel>
                                                <StepContent>
                                                    <Typography>{step.description}</Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        <div>
                                                            <LoadingButton
                                                                loading={finishStepLoading}
                                                                disabled={finishStepLoading}
                                                                variant="contained"
                                                                onClick={() => handleNext(index)}
                                                                sx={{ mt: 1, mr: 1 }}
                                                            >
                                                                {currentStep === guideLines.length - 1
                                                                    ? 'Finish'
                                                                    : 'Continue'}
                                                            </LoadingButton>
                                                            <Button
                                                                disabled={index === guideLines.length - 1}
                                                                onClick={() => handleIgnore()}
                                                                sx={{ mt: 1, mr: 1 }}
                                                                variant="outlined"
                                                            >
                                                                Ignore
                                                            </Button>
                                                            <LoadingButton
                                                                loading={finishLoading}
                                                                disabled={finishLoading}
                                                                onClick={handleFinish}
                                                                sx={{ mt: 1, mr: 1, color: 'red' }}
                                                            >
                                                                Ignore All
                                                            </LoadingButton>
                                                        </div>
                                                    </Box>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                </React.Fragment>
                            )}
                            {(currentStep === guideLines.length || guideLines.length === 0) && (
                                <Paper square elevation={0}>
                                    <Typography>No guidelines are currently available.</Typography>
                                </Paper>
                            )}
                        </Box>
                    </Fragment>
                )}
            </React.Fragment>
        </Popover>
    )
}

export default ModalProgress
