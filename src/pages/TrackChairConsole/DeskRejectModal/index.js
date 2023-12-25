import { Fragment, useEffect, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Box, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import SubmissionInfo from '../SubmissionInfo'

import { useEditStatusMutation } from '~/api/common/RTKQuery/TrackChairConsole'
import useChairNote from '~/api/common/chair-note'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const DeskRejectModal = ({ open, handleClose, row, setSync }) => {
    const { firstName, lastName, middleName } = useAppSelector((state) => state.auth)

    const { updateChairNote } = useChairNote()
    const [textField, setTextField] = useState('')
    const [isChecked, setCheck] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [editStatus] = useEditStatusMutation()
    const [deskRejectID, setPaperStatus] = useState('')
    const { getPaperStatuses } = usePaperSubmission()
    const [openPaperModal, setOpenPaperModal] = useState(false)

    const handleOpenModal = () => {
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setOpenPaperModal(false)
    }

    const handleCheck = (event) => {
        setCheck(event.target.checked)
    }
    const handleSubmit = () => {
        setUpdateLoading(true)
        const chairNote = {
            submissionId: row.paperId,
            chairNote: textField,
        }

        updateChairNote(chairNote)
            .then(() => {
                editStatus({ paperId: row.paperId, paperStatusId: deskRejectID, checklist: [] })
                    .then(() => {})
                    .catch(() => {})
                    .finally(() => {})
            })
            .catch(() => {})
            .finally(() => {
                setSync(uuid())
                handleClose()
                setUpdateLoading(false)
            })
    }

    const handleTextChange = (event) => {
        setTextField(event.target.value)
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const signal = controller.signal

        getPaperStatuses(null, signal)
            .then((response) => {
                const deskRejectStatus = response?.data?.find((status) => status.statusName === 'Desk Reject')
                setPaperStatus(deskRejectStatus?.statusId)
            })
            .catch(() => {})

        return () => {
            controller.abort()
            secondController.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Fragment>
            {openPaperModal && <SubmissionInfo open={openPaperModal} handleClose={handleCloseModal} row={row} />}
            <ModalInfo
                open={open}
                handleClose={handleClose}
                header={'Submit Decision'}
                headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
                maxWidth="sm"
                submitBtnName="Submit Desk Reject"
                handleSubmit={handleSubmit}
                enableActions={true}
                isDisable={updateLoading || !isChecked}
                loading={updateLoading}
            >
                <Grid px={2} container spacing={2}>
                    <ListItemForID itemName="Paper ID" itemWidth={3} valueWidth={9}>
                        <IDField id={row?.paperId} showButton={true} />
                    </ListItemForID>
                    <ListItemPopupInfo itemName="Paper title" value={row?.title} itemWidth={3} valueWidth={9} />
                    <ListItemPopupInfo itemName="Track name" value={row?.trackName} itemWidth={3} valueWidth={9} />
                    <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }} pb={2}>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent={'space-between'}>
                                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                    Chair note
                                </Typography>
                                <Typography
                                    sx={{
                                        color: AppStyles.colors['#027A9D'],
                                        ':hover': {
                                            textDecoration: 'underline',
                                        },
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    onClick={() => handleOpenModal()}
                                >
                                    View Submission
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
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
                    </Grid>
                    <Grid mt={2} item xs={12} display="flex" justifyContent="center">
                        <Box display={'flex'} alignItems={'center'}>
                            {/* <Box display={'flex'} alignItems={'center'} mb={1}>
                        <WarningAmber color="warning" />
                        <Typography sx={{ fontSize: 18, ml: 1 }}>
                            <strong>Caution: </strong>Once submitted, this decision is irreversible.
                        </Typography>
                    </Box> */}
                            <FormControlLabel control={<Checkbox value={isChecked} onChange={handleCheck} />} />
                            <Typography>
                                I,{' '}
                                <strong>
                                    {firstName} {middleName && middleName} {lastName}
                                </strong>
                                , confirm that I have view submission content and decide to change this submission to{' '}
                                <Typography component="span" sx={{ fontWeight: 'bold', color: '#FF0000' }}>
                                    Desk Reject
                                </Typography>
                                .
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </ModalInfo>
        </Fragment>
    )
}

export default DeskRejectModal
