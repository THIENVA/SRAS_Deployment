import React, { useState } from 'react'

import { cloneDeep } from 'lodash'

import { Grid, TextField } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useConference } from '~/api/common/conference'
import { AppStyles } from '~/constants/colors'

const UpdateWebLink = ({ open, handleClose, row, updateIndex, conferences, setConferences }) => {
    const { updateWebLink } = useConference()
    const [textField, setTextField] = useState(row?.websiteLink ? row?.websiteLink : '')
    // const [isLoading, setLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)

    const handleSubmit = () => {
        setUpdateLoading(true)
        const cloneConference = cloneDeep(conferences)
        updateWebLink(row?.id, textField)
            .then(() => {
                cloneConference[updateIndex].websiteLink = textField
                setConferences(cloneConference)
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

    // const isDisable = isEmpty(textField)

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Website Link'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Save Changes"
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
                                name="reason"
                                onChange={handleTextChange}
                                size="small"
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </React.Fragment>
                </Grid>
            </Grid>
        </ModalInfo>
    )
}

export default UpdateWebLink
