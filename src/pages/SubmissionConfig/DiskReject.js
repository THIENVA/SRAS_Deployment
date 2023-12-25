import { memo } from 'react'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const DiskReject = ({ stateDiskReject, setStateDiskReject }) => {
    const handleDiskReject = (event) => {
        setStateDiskReject((prev) => ({ ...prev, value: event.target.checked }))
    }
    return (
        <SectionLayout title={'DESK REJECT'}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography maxWidth={500} align="right">
                    {stateDiskReject.name}
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            sx={{ p: 0, mr: 0.5 }}
                            name={stateDiskReject.name}
                            checked={stateDiskReject.value}
                        />
                    }
                    label={stateDiskReject.checkboxName}
                    sx={{ ml: 1.5 }}
                    onChange={(event) => handleDiskReject(event)}
                />
            </Box>
        </SectionLayout>
    )
}

export default memo(DiskReject)
