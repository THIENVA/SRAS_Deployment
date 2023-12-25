import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Add } from '@mui/icons-material'
import { Box, Button, Container, Grid, Skeleton, Stack, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SettingCompo from '~/components/SettingCompo'
import SyncComponent from '~/components/SyncComponent'

import ConferenceDetail from '../ConferenceDetail'
import InputSubjectArea from './InputSubjectArea'
import SubjectAreas from './SubjectAreas'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useSubjectArea } from '~/api/common/subjectArea'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import { isEmpty } from '~/utils/commonFunction'

const SubjectArea = () => {
    const showSnackbar = useSnackbar()
    const { getSubjectAreas, createSubjectArea, updateSubjectArea, removeSubjectArea } = useSubjectArea()
    const {
        trackConference: { trackId },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { trackId: getTrackId } = useAppSelector((state) => state.trackForChair)
    const [subjectAreas, setSubjectAreas] = useState([])
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })
    const [subjectArea, setSubjectArea] = useState({ isEditing: false, name: '' })
    const [loading, setLoading] = useState(true)
    const [modifyLoading, setModifyLoading] = useState(false)
    const [error, setError] = useState(false)
    const [messageError, setMessageError] = useState('')
    const [sync, setSync] = useState(uuid())
    // const [subjectStatis, setSubjectStatis] = useState([])
    // const [tableLoading, setTableLoading] = useState(true)
    const handleClickOpenAlertPopup = (id) => {
        setOpenAlertPopup({ open: true, id })
    }

    const handleCloseAlertPopup = () => {
        setOpenAlertPopup({ open: false, id: null })
    }

    const openAddSubjectArea = () => {
        setSubjectArea({ name: '', isEditing: true })
        setIsAdd({ status: true, id: null })
    }

    const cancelEditingHandler = () => {
        setSubjectArea(() => ({ name: '', isEditing: false }))
        setIsAdd({ status: true, id: null })
    }

    const deleteSubjectArea = (id) => {
        if (subjectArea.isEditing) {
            isAdd.id === id && setSubjectArea(() => ({ name: '', isEditing: false }))
        }
        removeSubjectArea(id)
            .then(() => {
                const updatedSubjectAreas = subjectAreas.filter((item) => item.id !== id)
                setSubjectAreas(updatedSubjectAreas)
            })
            .finally(() => {
                setOpenAlertPopup(false)
            })
    }

    const openEditSubjectAreaHandler = (id) => {
        const subjectAreaItem = subjectAreas.find((item) => item.id === id)
        setSubjectArea({ isEditing: true, name: subjectAreaItem.name })
        setIsAdd({ status: false, id })
    }

    const modifySubjectAreaHandler = (value) => {
        const isValid = !isEmpty(value)
        if (!isValid) {
            setError(true)
            setMessageError('Subject area must not be empty')
        } else {
            const id = roleName === ROLES_NAME.TRACK_CHAIR ? trackId : getTrackId
            setModifyLoading(true)
            if (isAdd.status) {
                createSubjectArea({ trackId: id, subjectAreaName: value, isEditable: true, isDeletable: true })
                    .then((res) => {
                        const newSubjectArea = res.data
                        setSubjectAreas((prev) => [...prev, { ...newSubjectArea, isEditable: true, isDeletable: true }])
                    })
                    .catch((err) => {
                        const error =
                            err.response.status === 403
                                ? 'Subject area already existed.'
                                : 'Something went wrong, please try again later'
                        showSnackbar({
                            severity: 'error',
                            children: `${error}`,
                        })
                    })
                    .finally(() => {
                        setModifyLoading(false)
                        setSubjectArea(() => ({ name: '', isEditing: false }))
                        setIsAdd({ status: false, id: null })
                    })
            } else {
                const position = subjectAreas.findIndex((item) => item.id === isAdd.id)
                const getSubjectArea = subjectAreas.find((item) => item.id === isAdd.id)
                updateSubjectArea(isAdd.id, { trackId: id, subjectAreaName: value })
                    .then(() => {
                        const updatedSubjectArea = {
                            id: isAdd.id,
                            name: value,
                            isEditable: getSubjectArea.isEditable,
                            isDeletable: getSubjectArea.isDeletable,
                        }
                        const updatedSubjectAreas = cloneDeep(subjectAreas)
                        updatedSubjectAreas[position] = updatedSubjectArea
                        setSubjectAreas(updatedSubjectAreas)
                    })
                    .catch((err) => {
                        const error =
                            err.response.status === 403
                                ? 'Subject area already exist.'
                                : 'Something went wrong, please try again later'
                        showSnackbar({
                            severity: 'error',
                            children: `${error}`,
                        })
                    })
                    .finally(() => {
                        setModifyLoading(false)
                        setSubjectArea(() => ({ name: '', isEditing: false }))
                        setIsAdd({ status: false, id: null })
                    })
            }
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        setLoading(true)

        if (roleName === ROLES_NAME.TRACK_CHAIR) {
            trackId &&
                getSubjectAreas(trackId, signal)
                    .then((res) => {
                        const data = res.data
                        setSubjectAreas(data)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
        } else if (roleName === ROLES_NAME.CHAIR) {
            getTrackId &&
                getSubjectAreas(getTrackId, signal)
                    .then((res) => {
                        const data = res.data
                        setSubjectAreas(data)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackId, getTrackId, sync])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Subject Area ({subjectAreas?.length})
                        </Typography>
                        <Box sx={{ mt: 1.5, display: 'flex' }}>
                            <Button type="button" startIcon={<Add />} variant="contained" onClick={openAddSubjectArea}>
                                Add Subject Area
                            </Button>
                            <SyncComponent setSync={() => setSync(uuid())} />
                        </Box>
                        <Grid container item columnSpacing={4}>
                            <Grid item xs={12}>
                                {loading ? (
                                    <React.Fragment>
                                        <Box mt={2}>
                                            <Stack spacing={1}>
                                                <Skeleton variant="rounded" width="1" height={60} />
                                                <Skeleton variant="rounded" width="1" height={60} />
                                                <Skeleton variant="rounded" width="1" height={60} />
                                                <Skeleton variant="rounded" width="1" height={60} />
                                                <Skeleton variant="rounded" width="1" height={60} />
                                            </Stack>
                                        </Box>
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        {openAlertPopup.open && (
                                            <AlertPopup
                                                open={openAlertPopup.open}
                                                handleClose={handleCloseAlertPopup}
                                                handleDelete={() => deleteSubjectArea(openAlertPopup.id)}
                                            >
                                                Are you sure you want to delete this subject area? Papers in the track
                                                will no longer be accessible.
                                            </AlertPopup>
                                        )}
                                        {subjectArea.isEditing && (
                                            <InputSubjectArea
                                                cancelEditingHandler={cancelEditingHandler}
                                                modifySubjectAreaHandler={modifySubjectAreaHandler}
                                                subjectArea={subjectArea}
                                                modifyLoading={modifyLoading}
                                                error={error}
                                                messageError={messageError}
                                                setMessageError={setMessageError}
                                                setError={setError}
                                            />
                                        )}
                                        {subjectAreas.length !== 0 && (
                                            <SubjectAreas
                                                subjectAreas={subjectAreas}
                                                handleClickOpenAlertPopup={handleClickOpenAlertPopup}
                                                openEditSubjectAreaHandler={openEditSubjectAreaHandler}
                                                isAdd={isAdd}
                                            />
                                        )}
                                    </React.Fragment>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default SubjectArea
