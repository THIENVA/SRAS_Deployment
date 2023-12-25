import { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory } from 'react-router-dom'

import { Add } from '@mui/icons-material'
import { Button, Container, Grid, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import InputTrack from './InputTrack'
import Tracks from './Tracks'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { addTrack, updateTrackName } from '~/features/conference'
import { addTrackForChair, updateTrackForChair } from '~/features/track-for-chair'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'
import { isEmpty } from '~/utils/commonFunction'

const TrackConfig = () => {
    const { createTrack, getAllTrack, updateTrack } = useTrack()
    const {
        conference: { conferenceId },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const dispatch = useAppDispatch()
    const history = useHistory()
    const [tracks, setTracks] = useState([])
    const [error, setError] = useState(false)
    const [messageError, setMessageError] = useState('')
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })
    const [track, setTrack] = useState({ isEditing: false, name: '' })
    const [modifyLoading, setModifyLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const showSnackbar = useSnackbar()

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

    const modifyTrackHandler = (value) => {
        const isValid = !isEmpty(value)
        if (!isValid) {
            setError(true)
            setMessageError('Track name must not be empty')
        } else {
            setModifyLoading(true)
            if (isAdd.status) {
                createTrack(conferenceId, value)
                    .then((response) => {
                        const newTrack = response.data
                        setTracks((prev) => [
                            ...prev,
                            { id: newTrack.trackId, name: newTrack.trackName, isEditable: true, isDeletable: true },
                        ])
                        setTrack(() => ({ name: '', isEditing: false }))
                        setIsAdd({ status: false, id: null })
                        dispatch(addTrack({ id: newTrack.trackId, name: newTrack.trackName }))
                        dispatch(addTrackForChair({ id: newTrack.trackId, name: newTrack.trackName }))
                    })
                    .catch((error) => {
                        if (error.response.status === 400) {
                            showSnackbar({ severity: 'error', children: 'The track has already been defined' })
                        } else {
                            showSnackbar({
                                severity: 'error',
                                children: 'Something went wrong, please try again later',
                            })
                        }
                    })
                    .finally(() => {
                        setModifyLoading(false)
                    })
            } else {
                const position = tracks.findIndex((item) => item.id === isAdd.id)
                const getTrack = tracks.find((item) => item.id === isAdd.id)
                updateTrack({ trackId: isAdd.id, conferenceId, trackName: value })
                    .then(() => {
                        const updatedTrack = {
                            id: isAdd.id,
                            name: value,
                            isEditable: getTrack.isEditable,
                            isDeletable: getTrack.isDeletable,
                        }
                        const updateTracks = cloneDeep(tracks)
                        updateTracks[position] = updatedTrack
                        setTracks(updateTracks)
                        setTrack(() => ({ name: '', isEditing: false }))
                        setIsAdd({ status: false, id: null })
                        dispatch(updateTrackName({ trackId: isAdd.id, trackName: value }))
                        dispatch(updateTrackForChair({ trackId: isAdd.id, trackName: value }))
                    })
                    .finally(() => {
                        setModifyLoading(false)
                    })
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        if (conferenceId) {
            if (roleName === ROLES_NAME.CHAIR) {
                getAllTrack(conferenceId, signal)
                    .then((response) => {
                        const data = response.data.tracks
                        if (Array.isArray(data))
                            data.sort((a, b) =>
                                a.isDeletable === b.isDeletable ? a.name.localeCompare(b.name) : a.isDeletable ? 1 : -1
                            )
                        setTracks(cloneDeep(data))
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                setLoading(false)
                history.replace(`/conferences/${conferenceId}/submission/submission-console`)
            }
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Tracks Management ({tracks.length})
                        </Typography>
                        <Button
                            type="button"
                            startIcon={<Add />}
                            variant="contained"
                            sx={{ mt: 1.5 }}
                            onClick={openAddTrack}
                        >
                            Add Track
                        </Button>
                        {openAlertPopup.open && (
                            <AlertPopup
                                open={openAlertPopup.open}
                                handleClose={handleCloseAlertPopup}
                                handleDelete={() => deleteTrack(openAlertPopup.id)}
                            >
                                Are you sure you want to delete this track? Papers in the track will no longer be
                                accessible.
                            </AlertPopup>
                        )}
                        {track.isEditing && (
                            <InputTrack
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
                        {loading ? (
                            <Loading height="70vh" />
                        ) : (
                            tracks.length !== 0 && (
                                <Tracks
                                    tracks={tracks}
                                    handleClickOpenAlertPopup={handleClickOpenAlertPopup}
                                    openEditTrackHandler={openEditTrackHandler}
                                    isAdd={isAdd}
                                />
                            )
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default TrackConfig
