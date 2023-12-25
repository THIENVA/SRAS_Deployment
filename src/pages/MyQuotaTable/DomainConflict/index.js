import React, { useState } from 'react'

import { Grid, TextField } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useReviewer } from '~/api/common/reviewer'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const DomainConflict = ({ open, handleClose, domainConflict, setDomainConflict }) => {
    const { userId } = useAppSelector((state) => state.auth)
    const { updateDomainConflict } = useReviewer()
    const [textField, setTextField] = useState(domainConflict ? domainConflict : '')
    const [updateLoading, setUpdateLoading] = useState(false)

    const handleSubmit = () => {
        setUpdateLoading(true)
        const params = {
            accountId: userId,
            domainConflict: textField,
        }
        updateDomainConflict(params)
            .then(() => {
                setDomainConflict(textField)
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

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Domain Conflict'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="xs"
            submitBtnName="Save Changes"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={updateLoading}
            loading={updateLoading}
        >
            <Grid px={2} container spacing={2}>
                <Grid container item>
                    <React.Fragment>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                variant="outlined"
                                value={textField}
                                name="reason"
                                onChange={handleTextChange}
                                size="small"
                                placeholder="Enter domain conflict"
                            />
                        </Grid>
                    </React.Fragment>
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default DomainConflict
