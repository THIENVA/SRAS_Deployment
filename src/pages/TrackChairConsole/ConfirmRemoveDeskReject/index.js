import { useEffect, useState } from 'react'

import { v4 as uuid } from 'uuid'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useEditStatusMutation } from '~/api/common/RTKQuery/TrackChairConsole'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'

const ConfirmRemoveDeskReject = ({ open, handleClose, row, setSync }) => {
    const [isChecked, setCheck] = useState(false)
    const [isDisable, setDisable] = useState(true)
    const [isLoading, setLoading] = useState(false)
    const [editStatus] = useEditStatusMutation()
    const { getPaperStatuses } = usePaperSubmission()
    const [awaitingID, setPaperStatus] = useState('')

    const handleSubmit = () => {
        setLoading(true)

        if (isChecked) {
            editStatus({ paperId: row.paperId, paperStatusId: awaitingID, checklist: [] })
                .then(() => {})
                .catch(() => {})
                .finally(() => {
                    setSync(uuid())
                    handleClose()
                    setLoading(false)
                })
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
    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const signal = controller.signal

        getPaperStatuses(null, signal)
            .then((response) => {
                const deskRejectStatus = response?.data?.find((status) => status.statusName === 'Awaiting Decision')
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
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Remove Desk Reject'}
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
                            Are you sure want to remove{' '}
                            <Typography component="span" sx={{ fontSize: 18, fontWeight: 'bold', color: '#FF0000' }}>
                                Desk Reject
                            </Typography>{' '}
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

export default ConfirmRemoveDeskReject
