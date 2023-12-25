import { memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const SupplementaryMaterial = ({ stateSupplementaryMaterial, setStateSupplementaryMaterial }) => {
    const handleSupplementary = (event, index, type, isMultiple) => {
        const updatedStateRevisionFile = cloneDeep(stateSupplementaryMaterial)
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
        setStateSupplementaryMaterial(updatedStateRevisionFile)
    }
    return (
        <SectionLayout title="SUPPLEMENTARY MATERIAL">
            {stateSupplementaryMaterial.map((supplementary, index, originalArray) => {
                const { type, required } = supplementary
                return (
                    <Box key={supplementary.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography minWidth={500} align="right">
                            {required && <span style={{ color: 'red', paddingRight: 4 }}>*</span>}
                            {supplementary.name}
                        </Typography>
                        {type === 'checkbox' ? (
                            <FormControlLabel
                                key={supplementary.id}
                                control={
                                    <Checkbox
                                        size="small"
                                        sx={{ p: 0, mr: 0.5 }}
                                        name={supplementary.name}
                                        checked={supplementary.value}
                                    />
                                }
                                disabled={originalArray[0].value === false && originalArray[0].id !== supplementary.id}
                                label={supplementary.checkboxName}
                                sx={{ ml: 1.5 }}
                                onChange={(event) => handleSupplementary(event, index, supplementary.type, undefined)}
                            />
                        ) : (
                            <FormControl
                                key={supplementary.id}
                                sx={{ m: 1, minWidth: 150 }}
                                disabled={originalArray[0].value === false && originalArray[0].id !== supplementary.id}
                            >
                                <Select
                                    size="small"
                                    value={supplementary.value}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    multiple={supplementary.multiple}
                                    onChange={(event) =>
                                        handleSupplementary(event, index, supplementary.type, supplementary.multiple)
                                    }
                                >
                                    {supplementary.values.map((item, index) => (
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

export default memo(SupplementaryMaterial)
