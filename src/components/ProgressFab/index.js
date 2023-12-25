import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'

import { TipsAndUpdates } from '@mui/icons-material'
import { Box, Fab, Tooltip } from '@mui/material'

import ModalProgress from './ModalProgress'

// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { trackChange } from '~/features/track-for-chair'
import {
    handleCurrentStep,
    handleFirstLoading,
    handleGetSteps,
    handleLoading,
    handleOpenStep,
} from '~/features/track-steps'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'

const buttonSx = {
    color: '#39739d',
    backgroundColor: '#e1ecf4',
    border: '1px solid #7aa7c7',
    boxShadow: 'none',
    boxSizing: 'border-box',
    ':hover': {
        backgroundColor: '#b3d3ea',
        color: '#2c5777',
    },
}

const ProgressFab = () => {
    const {
        isLoading,
        isFirstLoading,
        steps,
        stepSelected: { currentStep },
        openStep,
    } = useAppSelector((state) => state.trackSteps)
    const { trackId, tracks } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
        trackConference: { trackId: getTrackId, trackName },
    } = useAppSelector((state) => state.conference)
    const boxRef = useRef(null)
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState(null)
    const { getGuideline } = useTrack()
    // const [connection, setConnection] = useState()
    // const [messages, setMessages] = useState([])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
        dispatch(handleOpenStep(true))
    }

    const handleClose = () => {
        dispatch(handleOpenStep(false))
    }

    const handleChange = (_, { props }) => {
        dispatch(trackChange({ id: props.value, name: props.children }))
        const getStep = steps.find((step) => step.trackId === props.value)
        if (!getStep) {
            dispatch(handleLoading(true))
            getGuideline(props.value, true, {})
                .then((response) => {
                    const data = response.data
                    const getStepsOfTrack = {
                        steps: {
                            trackId: props.value,
                            currentStep: -1,
                            guideLines: data.guidelines ? data.guidelines : [],
                        },
                        stepSelected: {
                            trackId: props.value,
                            currentStep: -1,
                            guideLines: data.guidelines ? data.guidelines : [],
                        },
                        guidelineGroup: data.guidelineGroup,
                    }
                    dispatch(handleGetSteps(getStepsOfTrack))
                    dispatch(trackChange({ id: props.value, name: props.children }))
                })
                .finally(() => {
                    dispatch(handleLoading(false))
                })
        } else {
            const updatedStepSelected = cloneDeep(getStep)
            dispatch(handleCurrentStep(updatedStepSelected))
        }
    }

    const popoverId = openStep ? 'simple-popover' : undefined

    useEffect(() => {
        const secondController = new AbortController()
        setAnchorEl(boxRef.current)

        if (roleName === ROLES_NAME.CHAIR) {
            if (tracks.length > 0) {
                if (isFirstLoading) {
                    dispatch(handleOpenStep(true))
                    const { id } = tracks[0]
                    getGuideline(id, true, secondController.signal)
                        .then((response) => {
                            const data = response.data
                            const getStepsOfTrack = {
                                steps: {
                                    trackId: id,
                                    currentStep: -1,
                                    guideLines: data.guidelines ? data.guidelines : [],
                                },
                                stepSelected: {
                                    trackId: id,
                                    currentStep: -1,
                                    guideLines: data.guidelines ? data.guidelines : [],
                                },
                                guidelineGroup: data.guidelineGroup,
                            }
                            dispatch(handleGetSteps(getStepsOfTrack))
                        })
                        .finally(() => {
                            dispatch(handleLoading(false))
                            dispatch(handleFirstLoading(false))
                        })
                }
            }
        } else if (roleName === ROLES_NAME.TRACK_CHAIR) {
            if (isFirstLoading) {
                dispatch(handleOpenStep(true))
                getGuideline(getTrackId, false, secondController.signal)
                    .then((response) => {
                        const data = response.data
                        const getStepsOfTrack = {
                            steps: {
                                trackId: getTrackId,
                                currentStep: -1,
                                guideLines: data.guidelines ? data.guidelines : [],
                            },
                            stepSelected: {
                                trackId: getTrackId,
                                currentStep: -1,
                                guideLines: data.guidelines ? data.guidelines : [],
                            },
                            guidelineGroup: data.guidelineGroup,
                        }
                        dispatch(handleGetSteps(getStepsOfTrack))
                        dispatch(trackChange({ id: getTrackId, name: trackName }))
                    })
                    .catch(() => {
                        // showSnackbar({
                        //     severity: 'error',
                        //     children: 'Something went wrong. Please try again later',
                        // })
                    })
                    .finally(() => {
                        dispatch(handleLoading(false))
                        dispatch(handleFirstLoading(false))
                    })
            }
        }
        return () => {
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roleName, tracks.length, getTrackId])

    return (
        <React.Fragment>
            <Tooltip title="First Time Walking Wizard">
                <Box sx={{ m: 1, position: 'fixed', bottom: 70, right: 80, zIndex: 1300 }} ref={boxRef}>
                    <Fab aria-describedby={popoverId} sx={buttonSx} onClick={handleClick}>
                        <TipsAndUpdates />
                    </Fab>
                </Box>
            </Tooltip>
            <ModalProgress
                handleClose={handleClose}
                popoverId={popoverId}
                open={openStep}
                anchorEl={anchorEl}
                currentStep={currentStep}
                allTrack={tracks}
                handleChange={handleChange}
                trackIdChair={trackId}
                loading={isLoading}
            />
        </React.Fragment>
    )
}

export default ProgressFab
