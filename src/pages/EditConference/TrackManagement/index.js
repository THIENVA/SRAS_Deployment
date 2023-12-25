import { useState } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Add } from '@mui/icons-material'
import { Box, Button, FormHelperText } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'

import TitleSection from '../TitleSection'
import InputTrack from './InputTrack'
import Tracks from './Tracks'

const TrackManagement = ({ tracks, setTracks, error, messageError, setMessageError, setError }) => {
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })
    const [track, setTrack] = useState({ isEditing: false, text: '' })

    const handleClickOpenAlertPopup = (id) => {
        setOpenAlertPopup({ open: true, id })
    }

    const handleCloseAlertPopup = () => {
        setOpenAlertPopup({ open: false, id: null })
    }

    const openAddTrack = () => {
        setTrack({ text: '', isEditing: true })
        setIsAdd({ status: true, id: null })
        setMessageError((prev) => ({ ...prev, ['tracks']: '' }))
        setError((prev) => ({ ...prev, ['tracks']: false }))
    }

    const cancelEditingHandler = () => {
        setTrack(() => ({ text: '', isEditing: false }))
        setIsAdd({ status: true, id: null })
    }

    const deleteTrack = (id) => {
        if (track.isEditing) {
            isAdd.id === id && setTrack(() => ({ text: '', isEditing: false }))
        }
        const updatedTracks = tracks.filter((item) => item.id !== id)
        setTracks(updatedTracks)
        setOpenAlertPopup(false)
        setMessageError((prev) => ({ ...prev, ['tracks']: '' }))
        setError((prev) => ({ ...prev, ['tracks']: false }))
    }

    const openEditTrackHandler = (id) => {
        const subjectAreaItem = tracks.find((item) => item.id === id)
        setTrack({ isEditing: true, text: subjectAreaItem.text })
        setIsAdd({ status: false, id })
        setMessageError((prev) => ({ ...prev, ['tracks']: '' }))
        setError((prev) => ({ ...prev, ['tracks']: false }))
    }

    const modifyTrackHandler = (value) => {
        if (isAdd.status) setTracks((prev) => [...prev, { text: value, id: uuid() }])
        else {
            const position = tracks.findIndex((item) => item.id === isAdd.id)
            const updatedTrack = { id: isAdd.id, text: value }
            const updateTracks = cloneDeep(tracks)
            updateTracks[position] = updatedTrack
            setTracks(updateTracks)
        }
        setTrack(() => ({ text: '', isEditing: false }))
        setIsAdd({ status: false, id: null })
    }

    return (
        <Box my={3}>
            <TitleSection>TRACKS MANAGEMENT</TitleSection>
            <Button type="button" startIcon={<Add />} variant="contained" onClick={openAddTrack}>
                Add Track
            </Button>
            {error.tracks && <FormHelperText error={error.tracks}>{messageError.tracks}</FormHelperText>}
            {openAlertPopup.open && (
                <AlertPopup
                    open={openAlertPopup.open}
                    handleClose={handleCloseAlertPopup}
                    handleDelete={() => deleteTrack(openAlertPopup.id)}
                >
                    Are you sure you want to delete this subject area? Papers in the track will no longer be accessible.
                </AlertPopup>
            )}
            {track.isEditing && (
                <InputTrack
                    cancelEditingHandler={cancelEditingHandler}
                    modifyTrackHandler={modifyTrackHandler}
                    track={track}
                />
            )}
            {tracks.length !== 0 && (
                <Tracks
                    tracks={tracks}
                    handleClickOpenAlertPopup={handleClickOpenAlertPopup}
                    openEditTrackHandler={openEditTrackHandler}
                    isAdd={isAdd}
                />
            )}
        </Box>
    )
}

export default TrackManagement
