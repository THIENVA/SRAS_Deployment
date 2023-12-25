import React, { Fragment, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { ExpandMore } from '@mui/icons-material'
import {
    Box,
    CircularProgress,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Popover,
    Select,
    Tooltip,
    Typography,
    Zoom,
} from '@mui/material'
import ListItemForID from '~/components/ListItemForID'
import SyncComponent from '~/components/SyncComponent'

import CurrentStep from './CurrentStep'
import FinishAllPhase from './FinishAllPhase'

import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import {
    handleChangeGuideLineGroup,
    handleCompleteStepGuideline,
    handleCurrentStep,
    handleFirstLoading,
    handleGetGuideLine,
    handleLoading,
    handleUpdateSteps,
} from '~/features/guidelines'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'

const ModalProgress = ({
    open,
    popoverId,
    handleClose,
    anchorEl,
    allTrack,
    handleChange,
    trackIdChair,
    loading,
    trackName,
    trackIdTrack,
    phase,
    setSync,
}) => {
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { finishStep } = useTrack()
    const { steps, stepSelected, factorIsCurrent } = useAppSelector((state) => state.guidelines)
    const { conferenceId } = useParams()

    const dispatch = useAppDispatch()

    const history = useHistory()
    const [finishStepLoading, setFinishStepLoading] = useState(false)

    const syncGuidelines = () => {
        dispatch(handleLoading(true))
        dispatch(handleFirstLoading(true))
        setSync(uuid())
    }

    const handleNext = (currentIndex, isFinishedMarkingGuideline, name, activityDeadlineId) => {
        const completionTrackId = roleName === ROLES_NAME.CHAIR ? trackIdChair : trackIdTrack
        if (isFinishedMarkingGuideline) {
            setFinishStepLoading(true)
            finishStep(completionTrackId, activityDeadlineId, name, true)
                .then(() => {
                    const nextIndex = stepSelected.guidelines.findIndex(
                        (item, index) => index > currentIndex && !item.isFinished
                    )
                    if (currentIndex !== stepSelected.guidelines.length) {
                        const link = stepSelected.guidelines[currentIndex].route
                        let updatedLink = link
                        if (link.includes(':conferenceId')) {
                            updatedLink = updatedLink.replace(':conferenceId', conferenceId)
                            history.push(updatedLink)
                        }
                        const stepPosition = steps.findIndex((step) => step.activityDeadlineId === activityDeadlineId)
                        const newPosition = nextIndex === -1 ? stepSelected.guidelines.length : nextIndex
                        const updatedGuidelines = cloneDeep(stepSelected.guidelines)
                        const updatedSteps = cloneDeep(steps)
                        updatedGuidelines[currentIndex].isFinished = true
                        updatedSteps[stepPosition].guidelines = updatedGuidelines
                        dispatch(handleCurrentStep(newPosition))
                        dispatch(handleGetGuideLine(stepSelected.guidelines[currentIndex]))
                        dispatch(handleCompleteStepGuideline(updatedGuidelines))
                        dispatch(handleUpdateSteps(updatedSteps))
                    }
                })
                .finally(() => {
                    setFinishStepLoading(false)
                })
        } else {
            const nextIndex = stepSelected.guidelines.findIndex(
                (item, index) => index > currentIndex && !item.isFinished
            )
            if (currentIndex !== stepSelected.guidelines.length) {
                const link = stepSelected.guidelines[currentIndex].route
                let updatedLink = link
                if (link.includes(':conferenceId')) {
                    updatedLink = updatedLink.replace(':conferenceId', conferenceId)
                    history.push(updatedLink)
                }
                const stepPosition = steps.findIndex((step) => step.activityDeadlineId === activityDeadlineId)
                const newPosition = nextIndex === -1 ? stepSelected.guidelines.length : nextIndex
                const updatedGuidelines = cloneDeep(stepSelected.guidelines)
                const updatedSteps = cloneDeep(steps)
                updatedGuidelines[currentIndex].isFinished = true
                updatedSteps[stepPosition].guidelines = updatedGuidelines
                dispatch(handleCurrentStep(newPosition))
                dispatch(handleGetGuideLine(stepSelected.guidelines[currentIndex]))
                dispatch(handleCompleteStepGuideline(updatedGuidelines))
                dispatch(handleUpdateSteps(updatedSteps))
            }
        }
    }

    const handleChangeGroupGuideline = (event) => {
        const stepGuideline = steps.find((item) => item.activityDeadlineId === event.target.value)
        const completionTrackId = roleName === ROLES_NAME.CHAIR ? trackIdChair : trackIdTrack
        const position = stepGuideline.guidelines.findIndex((item) => item.isFinished === false)
        const guidelineSelected = position === -1 ? null : stepGuideline.guidelines[position]
        const currentStep = position === -1 ? -1 : position
        const updatedStepSelected = {
            ...stepGuideline,
            trackId: completionTrackId,
            guideLineSelected: guidelineSelected,
            currentStep,
        }
        dispatch(handleChangeGuideLineGroup(updatedStepSelected))
    }

    // console.log(steps)
    // console.log(factorIsCurrent)
    // console.log(steps.filter((item) => item.guidelineGroupFactor <= factorIsCurrent))

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
                        <Box display="flex" alignItems="baseline" flex={1}>
                            <Typography sx={{ fontSize: 16, color: '#39739d' }}>Guidelines for: </Typography>
                            {roleName === ROLES_NAME.CHAIR ? (
                                <FormControl
                                    sx={{
                                        pl: 1,
                                        maxWidth: 200,
                                        '& .MuiInputBase-formControl': {
                                            paddingLeft: 1,
                                        },
                                    }}
                                    size="small"
                                    fullWidth
                                >
                                    <Select
                                        variant="standard"
                                        size="small"
                                        value={trackIdChair}
                                        onChange={handleChange}
                                    >
                                        {allTrack.map((track) => (
                                            <MenuItem key={track.id} value={track.id}>
                                                {track.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) : (
                                <Typography sx={{ fontSize: 16 }}>{trackName}</Typography>
                            )}
                        </Box>
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
                        {steps && factorIsCurrent !== -1 && (
                            <Box display="flex" mt={2}>
                                <FormControl sx={{ pl: 3, maxWidth: 300 }} size="small" fullWidth>
                                    <Select
                                        onChange={handleChangeGroupGuideline}
                                        value={stepSelected?.activityDeadlineId}
                                        size="small"
                                    >
                                        {steps
                                            .filter((item) => item.guidelineGroupFactor <= factorIsCurrent)
                                            .map((item) => (
                                                <MenuItem value={item.activityDeadlineId} key={item.activityDeadlineId}>
                                                    {item.guidelineGroup.toUpperCase()}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <SyncComponent buttonStyle={{ mx: 1 }} setSync={() => syncGuidelines()} />
                            </Box>
                        )}
                        <Box mx={3}>
                            {phase
                                ? phase[0]?.currentPhases && (
                                      <ListItemForID
                                          itemName="Current phase"
                                          itemWidth={4}
                                          valueWidth={8}
                                          outerStyle={{ boxShadow: 'none', my: 1 }}
                                      >
                                          <Box>
                                              <strong>{phase[0]?.currentPhases[0]?.phase}</strong>
                                              <Typography sx={{ fontSize: 14 }}>
                                                  {phase[0]?.currentPhases[0]?.deadlineName} (
                                                  {new Date(phase[0]?.currentPhases[0]?.deadline).toLocaleDateString(
                                                      'en-GB'
                                                  )}
                                                  )
                                              </Typography>
                                          </Box>
                                      </ListItemForID>
                                  )
                                : null}
                            {phase
                                ? phase[0]?.nextPhases && (
                                      <ListItemForID
                                          itemName="Next phase"
                                          itemWidth={4}
                                          valueWidth={8}
                                          outerStyle={{ boxShadow: 'none', my: 1 }}
                                      >
                                          <Box>
                                              <strong>{phase[0]?.nextPhases[0]?.phase}</strong>
                                              <Typography sx={{ fontSize: 14 }}>
                                                  {phase[0]?.nextPhases[0]?.deadlineName} (
                                                  {new Date(phase[0]?.nextPhases[0]?.deadline).toLocaleDateString(
                                                      'en-GB'
                                                  )}
                                                  )
                                              </Typography>
                                          </Box>
                                      </ListItemForID>
                                  )
                                : null}
                        </Box>
                        <Box p={3} sx={{ borderRadius: 10 }} maxWidth={400}>
                            {steps?.length > 0 && stepSelected === null && <FinishAllPhase rows={steps} />}
                            {steps === null && stepSelected === null && (
                                <Paper square elevation={0}>
                                    <Typography>No guidelines are currently available.</Typography>
                                </Paper>
                            )}
                            {steps?.length > 0 && stepSelected !== null && stepSelected.guidelines && (
                                <CurrentStep
                                    guideLines={stepSelected.guidelines}
                                    currentStep={stepSelected.currentStep}
                                    activityDeadlineId={stepSelected.activityDeadlineId}
                                    handleNext={handleNext}
                                    finishStepLoading={finishStepLoading}
                                />
                            )}
                        </Box>
                    </Fragment>
                )}
            </React.Fragment>
        </Popover>
    )
}

export default ModalProgress
