import React, { useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Grid, TextField } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useUser } from '~/api/common/user'
import { AppStyles } from '~/constants/colors'

const PaymentProofSearchUser = ({ open, handleClose }) => {
    const { getUserByEmail } = useUser()
    const showSnackbar = useSnackbar()
    const [textField, setTextField] = useState('')
    const history = useHistory()
    const [updateLoading, setUpdateLoading] = useState(false)
    const { conferenceId } = useParams()
    const handleSubmit = () => {
        setUpdateLoading(true)
        getUserByEmail(textField)
            .then((res) => {
                if (res.data) {
                    history.push({
                        pathname: `/conferences/${conferenceId}/submission/${res.data.id}/payment-proof`,
                        state: { userInfo: res.data },
                    })
                } else {
                    showSnackbar({
                        severity: 'error',
                        children: 'User not found.',
                    })
                }
            })
            .catch((error) => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong. Please try again later',
                })
                history.push(`/conferences/${conferenceId}/manuscript`)
            })
            .finally(() => {
                setUpdateLoading(false)
            })
    }

    const handleTextChange = (event) => {
        setTextField(event.target.value)
    }

    // const isDisable = isEmpty(textField)

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Search Proof Submit Author'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="xs"
            submitBtnName="Confirm"
            handleSubmit={handleSubmit}
            enableActions={true}
            isDisable={
                // isDisable ||
                updateLoading
            }
            loading={updateLoading}
        >
            <Grid px={2} container spacing={2}>
                <Grid container item>
                    <React.Fragment>
                        {/* <Grid item xs={3}>
                            <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                Website Link
                            </Typography>
                        </Grid> */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                variant="outlined"
                                value={textField}
                                name="email"
                                onChange={handleTextChange}
                                size="small"
                            />
                        </Grid>
                    </React.Fragment>
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default PaymentProofSearchUser
