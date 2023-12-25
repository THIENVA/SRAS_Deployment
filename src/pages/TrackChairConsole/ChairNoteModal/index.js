import React, { useEffect, useState } from 'react'

import { Box, CircularProgress, Grid, TextField, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import useChairNote from '~/api/common/chair-note'
import { AppStyles } from '~/constants/colors'
import { isEmpty } from '~/utils/commonFunction'

const ChairNoteModal = ({ open, handleClose, row }) => {
    const { getChairNote, updateChairNote } = useChairNote()
    const [textField, setTextField] = useState('')
    const [isLoading, setLoading] = useState(true)
    const [updateLoading, setUpdateLoading] = useState(false)

    const handleSubmit = () => {
        setUpdateLoading(true)
        const chairNote = {
            submissionId: row.paperId,
            chairNote: textField,
        }
        updateChairNote(chairNote)
            .then(() => {
                handleClose()
            })
            .catch(() => {})
            .finally(() => {
                setUpdateLoading(false)
            })
    }

    const handleTextChange = (event) => {
        setTextField(event.target.value)
    }

    const isDisable = isEmpty(textField)

    useEffect(() => {
        const controller = new AbortController()
        getChairNote(row.paperId, controller.signal)
            .then((response) => {
                const chairNote = response.data.chairNote
                setTextField(chairNote ?? '')
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Chair Note'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable || updateLoading}
            loading={updateLoading}
        >
            <Grid px={2} container spacing={2}>
                <ListItemPopupInfo itemName="Paper ID" value={row?.paperId} itemWidth={3} valueWidth={9} />
                <ListItemPopupInfo itemName="Paper Title" value={row?.title} itemWidth={3} valueWidth={9} />
                <ListItemPopupInfo itemName="Track Name" value={row?.trackName} itemWidth={3} valueWidth={9} />
                <Grid container item>
                    {isLoading ? (
                        <Grid item xs={12}>
                            <Box justifyContent="center" display="flex" mt={2}>
                                <CircularProgress size={30} />
                            </Box>
                        </Grid>
                    ) : (
                        <React.Fragment>
                            <Grid item xs={3}>
                                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                    Chair note
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <TextField
                                    fullWidth={true}
                                    variant="outlined"
                                    value={textField}
                                    name="reason"
                                    onChange={handleTextChange}
                                    size="small"
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </React.Fragment>
                    )}
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default ChairNoteModal
