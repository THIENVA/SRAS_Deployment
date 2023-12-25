import React, { useState } from 'react'

import { Grid, TextField, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const ForgotPassword = ({ open, handleClose }) => {
    const [textField, setTextField] = useState('')
    // const [isLoading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)

    const handleSubmit = () => {}

    const handleTextChange = (event) => {
        setTextField(event.target.value)
    }

    // const isDisable = isEmpty(textField)

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Forgot Password'}
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
                        <Grid item xs={12}>
                            <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>Email</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                placeholder="Enter your email"
                                fullWidth={true}
                                variant="outlined"
                                value={textField}
                                name="reason"
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

export default ForgotPassword
