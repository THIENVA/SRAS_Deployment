import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { TipsAndUpdates } from '@mui/icons-material'
import { Box, Fab, Tooltip } from '@mui/material'

import ModalProgress from './ModalProgress'

import { useConference } from '~/api/common/conference'
// import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import {
    handleFactorIsCurrent,
    handleFirstLoading,
    handleGetSteps,
    handleLoading,
    handleOpenStep,
    resetStepWhenTrackChange,
} from '~/features/guidelines'
import { trackChange } from '~/features/track-for-chair'
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

const GuideLineFab = () => {
    const { isLoading, isFirstLoading, openStep } = useAppSelector((state) => state.guidelines)
    const { trackId, tracks, trackName: getTrackName } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
        trackConference: { trackId: getTrackId, trackName },
    } = useAppSelector((state) => state.conference)
    const [sync, setSync] = useState(uuid())
    const boxRef = useRef(null)
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState(null)
    const [phase, setPhase] = useState(null)
    const { conferenceId } = useParams()
    const { getPhase } = useConference()
    const { getGuideline } = useTrack()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
        dispatch(handleOpenStep(true))
    }

    const handleClose = () => {
        dispatch(handleOpenStep(false))
    }

    const trackNameGuideline = roleName === ROLES_NAME.TRACK_CHAIR ? trackName : getTrackName

    const handleChange = (_, { props }) => {
        dispatch(handleLoading(true))
        dispatch(trackChange({ id: props.value, name: props.children }))
        dispatch(resetStepWhenTrackChange())
        getGuideline(props.value, true, {})
            .then((response) => {
                const data = response.data
                if (data) {
                    const currentRow = data.rows.find((item) => item.isCurrentPhase === true)
                    if (!currentRow) {
                        dispatch(handleGetSteps({ steps: data.rows, stepSelected: null }))
                    } else {
                        let positionGuidelines = -1
                        if (currentRow.guidelines) {
                            positionGuidelines = currentRow.guidelines.findIndex((item) => !item.isFinished)
                        }
                        dispatch(
                            handleGetSteps({
                                steps: data.rows,
                                stepSelected: {
                                    ...cloneDeep(currentRow),
                                    trackId: props.value,
                                    guideLineSelected:
                                        positionGuidelines !== -1
                                            ? { ...currentRow.guidelines[positionGuidelines] }
                                            : null,
                                    currentStep: positionGuidelines,
                                },
                            })
                        )
                        dispatch(handleFactorIsCurrent(currentRow.guidelineGroupFactor))
                    }
                } else {
                    dispatch(handleGetSteps({ steps: null, stepSelected: null }))
                }
            })
            .finally(() => {
                dispatch(handleLoading(false))
            })
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
                    const guidelineTrackId = trackId ? trackId : id
                    getGuideline(guidelineTrackId, true, secondController.signal)
                        .then((response) => {
                            const data = response.data
                            if (data) {
                                const currentRow = data.rows.find((item) => item.isCurrentPhase === true)
                                if (!currentRow) {
                                    dispatch(handleGetSteps({ steps: data.rows, stepSelected: null }))
                                } else {
                                    let positionGuidelines = -1
                                    if (currentRow.guidelines) {
                                        positionGuidelines = currentRow.guidelines.findIndex((item) => !item.isFinished)
                                    }
                                    dispatch(
                                        handleGetSteps({
                                            steps: data.rows,
                                            stepSelected: {
                                                ...cloneDeep(currentRow),
                                                trackId: id,
                                                guideLineSelected:
                                                    positionGuidelines !== -1
                                                        ? { ...currentRow.guidelines[positionGuidelines] }
                                                        : null,
                                                currentStep: positionGuidelines,
                                            },
                                        })
                                    )
                                    dispatch(handleFactorIsCurrent(currentRow.guidelineGroupFactor))
                                }
                            } else {
                                dispatch(handleGetSteps({ steps: null, stepSelected: null }))
                            }
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
                        if (data) {
                            const currentRow = data.rows.find((item) => item.isCurrentPhase === true)
                            if (!currentRow) {
                                dispatch(handleGetSteps({ steps: data.rows, stepSelected: null }))
                            } else {
                                let positionGuidelines = -1
                                if (currentRow.guidelines) {
                                    positionGuidelines = currentRow.guidelines.findIndex((item) => !item.isFinished)
                                }
                                dispatch(
                                    handleGetSteps({
                                        steps: data.rows,
                                        stepSelected: {
                                            ...cloneDeep(currentRow),
                                            trackId: getTrackId,
                                            guideLineSelected:
                                                positionGuidelines !== -1
                                                    ? { ...currentRow.guidelines[positionGuidelines] }
                                                    : null,
                                            currentStep: positionGuidelines,
                                        },
                                    })
                                )
                                dispatch(handleFactorIsCurrent(currentRow.guidelineGroupFactor))
                            }
                        } else {
                            dispatch(handleGetSteps({ steps: null, stepSelected: null }))
                        }
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
    }, [roleName, tracks.length, getTrackId, isLoading, trackId])

    const track = roleName === ROLES_NAME.CHAIR ? trackId : getTrackId
    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (conferenceId && track) {
            getPhase(conferenceId, track, signal)
                .then((response) => {
                    const data = response.data
                    setPhase(data)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId, track, sync])

    return (
        <React.Fragment>
            <Tooltip title={trackNameGuideline}>
                <Box sx={{ m: 1, position: 'fixed', bottom: 70, right: 80, zIndex: 1300 }} ref={boxRef}>
                    <Fab variant="extended" aria-describedby={popoverId} sx={buttonSx} onClick={handleClick}>
                        <TipsAndUpdates />
                        {trackNameGuideline.length >= 25
                            ? trackNameGuideline.substring(0, 25) + '...'
                            : trackNameGuideline}
                    </Fab>
                </Box>
            </Tooltip>
            <ModalProgress
                handleClose={handleClose}
                popoverId={popoverId}
                anchorEl={anchorEl}
                open={openStep}
                allTrack={tracks}
                handleChange={handleChange}
                trackIdChair={trackId}
                trackIdTrack={getTrackId}
                loading={isLoading}
                trackName={trackName}
                phase={phase}
                setSync={setSync}
            />
        </React.Fragment>
    )
}

export default GuideLineFab
