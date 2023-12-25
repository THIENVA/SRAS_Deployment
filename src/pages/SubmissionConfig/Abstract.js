import { memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControl, FormControlLabel, MenuItem, Select, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const AbstractSection = ({ abstract, setStateAbstract }) => {
    const handleAbstractChange = (event, index, type) => {
        const updatedAbstractState = cloneDeep(abstract)
        if (type === 'checkbox') updatedAbstractState[index].value = event.target.checked
        else if (type === 'select') updatedAbstractState[index].value = event.target.value
        setStateAbstract(updatedAbstractState)
    }
    return (
        <SectionLayout title="ABSTRACT">
            {abstract.map((itemAbstract, index) => {
                const { type } = itemAbstract
                return (
                    <Box key={itemAbstract.id} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography minWidth={500} align="right">
                            {itemAbstract.name}
                        </Typography>
                        {type === 'checkbox' ? (
                            <FormControlLabel
                                key={itemAbstract.id}
                                control={
                                    <Checkbox
                                        size="small"
                                        sx={{ p: 0, mr: 0.5 }}
                                        name={itemAbstract.name}
                                        checked={itemAbstract.value}
                                    />
                                }
                                // disabled={originalArray[0].value === false && originalArray[0].id !== itemAbstract.id}
                                label={itemAbstract.checkboxName}
                                sx={{ ml: 1.5 }}
                                onChange={(event) => handleAbstractChange(event, index, itemAbstract.type)}
                            />
                        ) : (
                            <FormControl
                                key={itemAbstract.id}
                                sx={{ m: 1, minWidth: 150 }}
                                // disabled={originalArray[0].value === false && originalArray[0].id !== itemAbstract.id}
                            >
                                <Select
                                    size="small"
                                    value={itemAbstract.value}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    onChange={(event) => handleAbstractChange(event, index, itemAbstract.type)}
                                >
                                    {itemAbstract.values.map((item, index) => (
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

export default memo(AbstractSection)
