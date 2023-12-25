import React, { memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const SubjectAreaFile = ({ stateSubjectArea, setStateSubjectArea }) => {
    const handleSubjectArea = (event, index, type, subType, miniIndex) => {
        const updatedStateSubjectArea = cloneDeep(stateSubjectArea)
        if (type === 'checkbox') updatedStateSubjectArea[index].value = event.target.checked
        if (type === 'mix') {
            if (subType === 'checkbox') {
                updatedStateSubjectArea[index].input[miniIndex].value = event.target.checked
            } else if (subType === 'select') {
                updatedStateSubjectArea[index].input[miniIndex].value = event.target.value
            }
        }
        setStateSubjectArea(updatedStateSubjectArea)
    }
    return (
        <SectionLayout title="SUBJECT AREA">
            {stateSubjectArea.map((subjectArea, index, originalArray) => {
                const { type } = subjectArea
                return (
                    <Box key={subjectArea.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography minWidth={500} align="right">
                            {subjectArea.name}
                        </Typography>
                        {type === 'checkbox' ? (
                            <FormControlLabel
                                key={subjectArea.id}
                                control={
                                    <Checkbox
                                        size="small"
                                        sx={{ p: 0, mr: 0.5 }}
                                        name={subjectArea.name}
                                        checked={subjectArea.value}
                                    />
                                }
                                label={subjectArea.checkboxName}
                                sx={{ ml: 1.5 }}
                                onChange={(event) => handleSubjectArea(event, index, type, undefined, undefined)}
                            />
                        ) : (
                            subjectArea.input.map((subjectAreaItem, miniIndex) => {
                                const { subType } = subjectAreaItem
                                if (subType === 'checkbox')
                                    return (
                                        <FormControlLabel
                                            key={subjectAreaItem.id}
                                            control={
                                                <Checkbox
                                                    size="small"
                                                    sx={{ p: 0, mr: 0.5 }}
                                                    name={subjectAreaItem.checkboxName}
                                                    checked={subjectAreaItem.value}
                                                />
                                            }
                                            label={subjectAreaItem.checkboxName}
                                            sx={{ ml: 1.5 }}
                                            onChange={(event) =>
                                                handleSubjectArea(event, index, type, subType, miniIndex)
                                            }
                                            disabled={originalArray[0].value === false && index === 1}
                                        />
                                    )
                                else if (subType === 'select') {
                                    return (
                                        <React.Fragment key={subjectAreaItem.id}>
                                            <Typography sx={{ mr: 1 }}>to</Typography>
                                            <FormControl
                                                sx={{ m: 1, minWidth: 150 }}
                                                disabled={
                                                    (originalArray[0].value === false && index === 1) ||
                                                    originalArray[1].input[0].value === false
                                                }
                                            >
                                                <Select
                                                    size="small"
                                                    value={subjectAreaItem.value}
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    onChange={(event) =>
                                                        handleSubjectArea(event, index, type, subType, miniIndex)
                                                    }
                                                >
                                                    {subjectAreaItem.values.map((item, index) => (
                                                        <MenuItem key={index} value={item}>
                                                            {item}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </React.Fragment>
                                    )
                                }
                            })
                        )}
                    </Box>
                )
            })}
        </SectionLayout>
    )
}

export default memo(SubjectAreaFile)
