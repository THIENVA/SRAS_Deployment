import { useState } from 'react'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { AppStyles } from '~/constants/colors'

const ConfirmPopup = ({
    open,
    handleClose,
    deleteCameraReady,
    row,
    actionType,
    removeRevision,
    supplementary,
    deleteSubmission,
    refresh,
}) => {
    const showSnackbar = useSnackbar()

    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)

        if (isChecked) {
            if (actionType === 'cameraReady') {
                deleteCameraReady(row.submissionId)
                    .then(() => {
                        showSnackbar({
                            severity: 'success',
                            children: 'Delete camera ready successfully.',
                        })
                        // window.location.reload()
                        refresh()
                    })
                    .catch((err) => {
                        const error =
                            err.response.data.error.code === 'Sras:ConferenceManagement:CameraReadyNotFound'
                                ? 'Camera Ready Not Found. Please Create Camera Ready First.'
                                : 'Something went wrong, please try again later.'
                        showSnackbar({
                            severity: 'error',
                            children: `${error}`,
                        })
                    })
                    .finally(() => {
                        handleClose()
                        setLoading(false)
                    })
            } else if (actionType === 'revision') {
                removeRevision(row.submissionId)
                    .then(() => {
                        showSnackbar({
                            severity: 'success',
                            children: 'Delete revision successfully.',
                        })
                        // window.location.reload()
                        refresh()
                    })
                    .catch((err) => {
                        const error =
                            err.response.data.error.code === 'Sras:ConferenceManagement:CameraReadyNotFound'
                                ? 'Camera Ready Not Found. Please Create Camera Ready First.'
                                : 'Something went wrong, please try again later.'
                        showSnackbar({
                            severity: 'error',
                            children: `${error}`,
                        })
                    })
                    .finally(() => {
                        handleClose()
                        setLoading(false)
                    })
            } else if (actionType === 'supplementary') {
                const formData = new FormData()
                supplementary(row.submissionId, formData)
                    .then(() => {
                        showSnackbar({
                            severity: 'success',
                            children: 'Delete Supplementary Materials successfully.',
                        })
                        // window.location.reload()
                        refresh()
                    })
                    .finally(() => {
                        handleClose()
                        setLoading(false)
                    })
            } else if (actionType === 'submission') {
                deleteSubmission(row.submissionId)
                    .then(() => {
                        showSnackbar({
                            severity: 'success',
                            children: 'Delete submission successfully.',
                        })
                        // window.location.reload()
                        refresh()
                    })
                    .finally(() => {
                        handleClose()
                        setLoading(false)
                    })
            }
        }
    }

    const handleCheck = (event) => {
        setCheck(event.target.checked)
        if (event.target.checked === true) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={`Delete ${
                actionType === 'cameraReady'
                    ? 'Camera Ready'
                    : actionType === 'submission'
                    ? 'Submission'
                    : actionType === 'supplementary'
                    ? 'Supplementary'
                    : actionType === 'revision'
                    ? 'Revision'
                    : 'Presentation'
            }`}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={isDisable}
            loading={isLoading}
        >
            <Box display="flex" justifyContent="center">
                <Box>
                    <Box display={'flex'} alignItems={'center'} mb={1}>
                        <Typography sx={{ fontSize: 18, ml: 1 }}>
                            Are you sure want to delete{' '}
                            {actionType === 'cameraReady'
                                ? 'Camera Ready'
                                : actionType === 'submission'
                                ? 'Submission'
                                : actionType === 'supplementary'
                                ? 'Supplementary'
                                : actionType === 'revision'
                                ? 'Revision'
                                : 'Presentation'}{' '}
                            for this paper?
                        </Typography>
                    </Box>
                    <FormControlLabel
                        control={<Checkbox value={isChecked} onChange={handleCheck} />}
                        label="Yes, I understand."
                    />
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default ConfirmPopup
