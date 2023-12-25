import { useState } from 'react'

import { cloneDeep } from 'lodash'

import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'

const TrackPlanPopup = ({
    open,
    handleClose,
    trackIdSubmitted,
    setDeadlinesActivity,
    setTableLoading,
    setInitialDeadline,
    setFirstTime,
}) => {
    const { postTrackPlan } = useTrack()
    const [textField, setTextField] = useState(0)
    const [isLoading, setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)

        postTrackPlan(trackIdSubmitted, textField)
            .then((res) => {
                const data = res.data
                const modifiedData = data.map((obj) => ({
                    ...obj,
                    error: false,
                    helperText: '',
                }))
                const updatedModifiedData = cloneDeep(modifiedData)
                const lastIndex = updatedModifiedData.length - 1
                updatedModifiedData[0].planDeadline = updatedModifiedData[0].planDeadline.substring(
                    0,
                    updatedModifiedData[0].planDeadline.length - 1
                )
                updatedModifiedData[lastIndex].planDeadline = updatedModifiedData[lastIndex].planDeadline.substring(
                    0,
                    updatedModifiedData[lastIndex].planDeadline.length - 1
                )
                setFirstTime(true)
                setInitialDeadline(updatedModifiedData)
                setDeadlinesActivity(updatedModifiedData)

                handleClose()
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false)
                setTableLoading(false)
            })
    }

    const handleTextChange = (event) => {
        setTextField(event.target.value)
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Number of Revisions'}
            headerStyle={{ fontSize: 24, fontWeight: 'bold', color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            submitBtnName="Create Track Plan"
            handleSubmit={handleSubmit}
            enableActions={true}
            loading={isLoading}
        >
            <Box px={2}>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Box>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Number of Revisions:
                        </Typography>
                    </Box>
                    <Box ml={6} maxWidth={160}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                value={textField}
                                onChange={handleTextChange}
                                displayEmpty
                                size="small"
                                inputProps={{ min: 0, style: { textAlign: 'right' } }}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => (
                                    <MenuItem key={index} value={value}>
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default TrackPlanPopup
