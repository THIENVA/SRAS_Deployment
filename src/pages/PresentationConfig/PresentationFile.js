import { memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const PresentationFile = ({ presentationFile, setStatePresentationFile }) => {
    const handleSubmissionFile = (event, index, isMultiple) => {
        const updatedStateSubmissionFile = cloneDeep(presentationFile)
        if (isMultiple) {
            const {
                target: { value },
            } = event

            const newValue = typeof value === 'string' ? value.split(',') : value

            updatedStateSubmissionFile[index].value = newValue
        } else updatedStateSubmissionFile[index].value = event.target.value
        setStatePresentationFile(updatedStateSubmissionFile)
    }
    return (
        <SectionLayout title={'PRESENTATION FILE'}>
            {presentationFile.map((submissionFile, index) => {
                const { required, multiple } = submissionFile
                return (
                    <Box key={submissionFile.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography minWidth={500} align="right">
                            {required && <span style={{ color: 'red', paddingRight: 4 }}>*</span>}
                            {submissionFile.name}
                        </Typography>
                        <FormControl key={submissionFile.id} sx={{ m: 1, minWidth: 150 }} required={required}>
                            <Select
                                size="small"
                                value={submissionFile.value}
                                inputProps={{ 'aria-label': 'Without label' }}
                                multiple={multiple}
                                onChange={(event) => handleSubmissionFile(event, index, multiple)}
                            >
                                {submissionFile.values.map((item, index) => (
                                    <MenuItem key={index} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )
            })}
        </SectionLayout>
    )
}

export default memo(PresentationFile)
