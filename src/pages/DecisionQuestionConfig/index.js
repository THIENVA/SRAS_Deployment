import React, { useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, Grid, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import FactorAffectingSelection from './FactorAffectingSelection'
import FactorDisqualifyingPaper from './FactorDisqualifyingPaper'
import InputDecision from './InputDecision'
import Questions from './Questions'
import SectionLayout from './SectionLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import { isEmpty } from '~/utils/commonFunction'

const DecisionQuestionConfig = () => {
    const { getDecisionCriteriaSetting, updateDecisionCriteriaSetting } = useTrack()
    const {
        conference: { conferenceId },
        roleConference: { roleName },
        trackConference: { trackId: id },
    } = useAppSelector((state) => state.conference)
    const { trackId } = useAppSelector((state) => state.trackForChair)
    const showSnackbar = useSnackbar()
    const [tracks, setTracks] = useState([])
    const [error, setError] = useState(false)
    const [messageError, setMessageError] = useState('')
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })
    const [track, setTrack] = useState({ isEditing: false, name: '' })
    const [modifyLoading, setModifyLoading] = useState(false)
    const factorAffectingSelection = useRef('')
    const factorsDisqualifyingPaper = useRef('')
    const [loading, setLoading] = useState(true)

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : trackId

    const handleClickOpenAlertPopup = (id) => {
        setOpenAlertPopup({ open: true, id })
    }

    const handleCloseAlertPopup = () => {
        setOpenAlertPopup({ open: false, id: null })
    }

    const openAddTrack = () => {
        setTrack({ name: '', isEditing: true })
        setIsAdd({ status: true, id: null })
    }

    const cancelEditingHandler = () => {
        setTrack(() => ({ name: '', isEditing: false }))
        setIsAdd({ status: true, id: null })
    }

    const deleteTrack = (id) => {
        if (track.isEditing) {
            isAdd.id === id && setTrack(() => ({ name: '', isEditing: false }))
        }
        const updatedTracks = tracks.filter((item) => item.id !== id)
        setTracks(updatedTracks)
        setOpenAlertPopup(false)
    }

    const openEditTrackHandler = (id) => {
        const subjectAreaItem = tracks.find((item) => item.id === id)
        setTrack({ isEditing: true, name: subjectAreaItem.name })
        setIsAdd({ status: false, id })
    }

    const submitQuestions = () => {
        setModifyLoading(true)
        updateDecisionCriteriaSetting(trackIdSubmitted, {
            decisionChecklist: tracks,
            factorsAffectingSelection: factorAffectingSelection.current,
            factorsDisqualifyingPaper: factorsDisqualifyingPaper.current,
        })
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Save check list decision successfully.',
                })
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setModifyLoading(false)
            })
    }

    const modifyTrackHandler = (value) => {
        const isValid = !isEmpty(value)
        if (!isValid) {
            setError(true)
            setMessageError('Question name must not be empty')
        } else {
            if (isAdd.status) {
                setTracks((prev) => [...prev, { id: uuid(), name: value, isChecked: false }])
                setTrack(() => ({ name: '', isEditing: false }))
                setIsAdd({ status: false, id: null })
            } else {
                const position = tracks.findIndex((item) => item.id === isAdd.id)
                const updatedTrack = { id: isAdd.id, name: value, isChecked: false }
                const updateTracks = cloneDeep(tracks)
                updateTracks[position] = updatedTrack
                setTracks(updateTracks)
                setTrack(() => ({ name: '', isEditing: false }))
                setIsAdd({ status: false, id: null })
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        if (conferenceId && trackIdSubmitted) {
            getDecisionCriteriaSetting(trackIdSubmitted, controller.signal)
                .then((response) => {
                    const data = response.data
                    setTracks(data.decisionChecklist ? data.decisionChecklist : [])
                    data.factorsAffectingSelection
                    if (data.factorsAffectingSelection) {
                        factorAffectingSelection.current = data.factorsAffectingSelection
                    }
                    if (data.factorsDisqualifyingPaper) {
                        factorsDisqualifyingPaper.current = data.factorsDisqualifyingPaper
                    }
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
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackIdSubmitted, conferenceId])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Decision Criteria Submission
                        </Typography>
                        {loading ? (
                            <Loading height="70vh" />
                        ) : (
                            <React.Fragment>
                                <SectionLayout
                                    title="DECISION CHECKLIST"
                                    onClick={() => openAddTrack()}
                                    buttonText="New Criterion"
                                >
                                    {track.isEditing && (
                                        <InputDecision
                                            cancelEditingHandler={cancelEditingHandler}
                                            modifyTrackHandler={modifyTrackHandler}
                                            track={track}
                                            modifyLoading={modifyLoading}
                                            error={error}
                                            messageError={messageError}
                                            setMessageError={setMessageError}
                                            setError={setError}
                                        />
                                    )}
                                </SectionLayout>
                                {openAlertPopup.open && (
                                    <AlertPopup
                                        open={openAlertPopup.open}
                                        handleClose={handleCloseAlertPopup}
                                        handleDelete={() => deleteTrack(openAlertPopup.id)}
                                    >
                                        Are you sure you want to delete this question?
                                    </AlertPopup>
                                )}
                                {tracks.length !== 0 && (
                                    <Questions
                                        tracks={tracks}
                                        handleClickOpenAlertPopup={handleClickOpenAlertPopup}
                                        openEditTrackHandler={openEditTrackHandler}
                                        isAdd={isAdd}
                                    />
                                )}
                                <SectionLayout title="FACTORS AFFECTING SELECTION" style={{ mt: 4 }}>
                                    <FactorAffectingSelection ref={factorAffectingSelection} />
                                </SectionLayout>
                                <SectionLayout
                                    title="Factors Disqualifying a Research Paper Abstract"
                                    style={{ mt: 4 }}
                                >
                                    <FactorDisqualifyingPaper ref={factorsDisqualifyingPaper} />
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
                                        disabled={modifyLoading}
                                        loading={modifyLoading}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        onClick={submitQuestions}
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

export default DecisionQuestionConfig
