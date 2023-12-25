import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'

import { Container, Grid, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import InputPaperStatus from './InputPaperStatus'
import PaperStatuses from './PaperStatuses'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import usePaperStatus from '~/api/common/paper-status'

const PaperStatus = () => {
    const { getPaperStatuses } = usePaperStatus()
    const { conferenceId } = useParams()
    const { createPaperStatus } = usePaperStatus()
    const [statuses, setStatuses] = useState([])
    const [loading, setLoading] = useState(true)
    const showSnackbar = useSnackbar()
    const [status, setStatus] = useState({ isEditing: false, text: '', visibleToAuthor: true })
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })

    const handleClickOpenAlertPopup = (id) => {
        setOpenAlertPopup({ open: true, id })
    }

    const handleCloseAlertPopup = () => {
        setOpenAlertPopup({ open: false, id: null })
    }

    const cancelEditingHandler = () => {
        setStatus({ false: false, text: '', visibleToAuthor: true })
        setIsAdd({ status: true, id: null })
    }

    const openEditPaperStatusHandler = (id) => {
        const paperStatusItem = statuses.find((item) => item.id === id)
        setStatus({ isEditing: true, text: paperStatusItem.text, visibleToAuthor: paperStatusItem.visibleToAuthor })
        setIsAdd({ status: false, id })
    }

    const deletePaperStatus = (id) => {
        if (status.isEditing) setStatus(() => ({ text: '', isEditing: false, visibleToAuthor: true }))
        const updatedPaperStatuses = statuses.filter((item) => item.id !== id)
        setStatuses(updatedPaperStatuses)
        setOpenAlertPopup(false)
    }

    const modifySubjectAreaHandler = (value) => {
        if (isAdd.status) {
            const paperStatus = { text: value.text, visibleToAuthor: value.visibleToAuthor, conferenceId }
            createPaperStatus(paperStatus).then((response) => {
                const newPaper = response.data
                setStatuses((prev) => [...prev, { ...newPaper }])
            })
        } else {
            const position = statuses.findIndex((item) => item.id === isAdd.id)
            const updatedStatus = { id: isAdd.id, text: value.text, visibleToAuthor: value.visibleToAuthor }
            const updatedStatuses = cloneDeep(statuses)
            updatedStatuses[position] = updatedStatus
            setStatuses(updatedStatuses)
        }
        setStatus(() => ({ text: '', isEditing: false, visibleToAuthor: true }))
    }

    useEffect(() => {
        const controller = new AbortController()
        getPaperStatuses(conferenceId, controller.signal)
            .then((response) => {
                setStatuses(response.data)
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong. Please try again later',
                // })
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
                        {loading ? (
                            <Loading height="70vh" />
                        ) : (
                            <React.Fragment>
                                <Typography variant="h5" fontWeight={700}>
                                    Paper Status
                                </Typography>
                                {status.isEditing && (
                                    <InputPaperStatus
                                        cancelEditingHandler={cancelEditingHandler}
                                        status={status}
                                        modifySubjectAreaHandler={modifySubjectAreaHandler}
                                    />
                                )}
                                {openAlertPopup.open && (
                                    <AlertPopup
                                        open={openAlertPopup.open}
                                        handleClose={handleCloseAlertPopup}
                                        handleDelete={() => deletePaperStatus(openAlertPopup.id)}
                                    >
                                        Are you sure you want to delete the status?
                                    </AlertPopup>
                                )}
                                <PaperStatuses
                                    openEditPaperStatusHandler={openEditPaperStatusHandler}
                                    statuses={statuses}
                                    handleClickOpenAlertPopup={handleClickOpenAlertPopup}
                                />
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default PaperStatus
