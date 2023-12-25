import { memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const RevisionFile = ({ stateRevisionFile, setStateRevisionFile }) => {
    const handleRevisionFile = (event, index, type, isMultiple) => {
        const updatedStateRevisionFile = cloneDeep(stateRevisionFile)
        if (type === 'checkbox') updatedStateRevisionFile[index].value = event.target.checked
        else if (type === 'select') {
            if (isMultiple) {
                const {
                    target: { value },
                } = event

                const newValue = typeof value === 'string' ? value.split(',') : value

                updatedStateRevisionFile[index].value = newValue
            } else updatedStateRevisionFile[index].value = event.target.value
        }
        setStateRevisionFile(updatedStateRevisionFile)
    }
    return (
        <SectionLayout title="REVISION FILE">
            {stateRevisionFile.map((revisionFile, index) => {
                const { type, required } = revisionFile
                return (
                    <Box key={revisionFile.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography minWidth={500} align="right">
                            {required && <span style={{ color: 'red', paddingRight: 4 }}>*</span>}
                            {revisionFile.name}
                        </Typography>
                        {type === 'checkbox' ? (
                            <FormControlLabel
                                key={revisionFile.id}
                                control={
                                    <Checkbox
                                        size="small"
                                        sx={{ p: 0, mr: 0.5 }}
                                        name={revisionFile.name}
                                        checked={revisionFile.value}
                                    />
                                }
                                label={revisionFile.checkboxName}
                                sx={{ ml: 1.5 }}
                                onChange={(event) => handleRevisionFile(event, index, revisionFile.type, undefined)}
                            />
                        ) : (
                            <FormControl key={revisionFile.id} sx={{ m: 1, minWidth: 150 }}>
                                <Select
                                    size="small"
                                    value={revisionFile.value}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    multiple={revisionFile.multiple}
                                    onChange={(event) =>
                                        handleRevisionFile(event, index, revisionFile.type, revisionFile.multiple)
                                    }
                                >
                                    {revisionFile.values.map((item, index) => (
                                        <MenuItem key={index} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                )
            })}
        </SectionLayout>
    )
}

export default memo(RevisionFile)
