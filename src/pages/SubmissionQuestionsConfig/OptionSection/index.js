import React, { memo } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Add, Clear } from '@mui/icons-material'
import { Box, Button, FormControl, IconButton, MenuItem, Select, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'

import { SHOW_AS } from '~/constants/SubmissionQuestionsConstant'
import { options } from '~/mock/SubmissionQuest'

const OptionSection = ({ showAs, setShowAs }) => {
    const { result } = showAs

    const handleSelectedOption = (event) => {
        const { value } = event.target
        const updatedShowAs = cloneDeep(showAs)
        if (value === SHOW_AS.RADIO || value === SHOW_AS.SELECT_ONE) {
            updatedShowAs.result.multiple = false
            updatedShowAs.result.valueInput = ''
            updatedShowAs.result.valueInputType = 'string'
        } else if (value === SHOW_AS.CHECKBOX || value === SHOW_AS.SELECT_MULTIPLE) {
            updatedShowAs.result.multiple = true
            updatedShowAs.result.valueInput = new Array()
            updatedShowAs.result.valueInputType = 'array'
        }
        updatedShowAs.result.render = value
        setShowAs(updatedShowAs)
    }

    const handleAddingMoreChoice = () => {
        const newChoice = { id: uuid(), value: '' }
        const updatedShowAs = cloneDeep(showAs)
        updatedShowAs.result.value = [...updatedShowAs.result.value, { ...newChoice }]
        setShowAs(updatedShowAs)
    }

    const handleTextChange = (event, index) => {
        const updatedShowAs = cloneDeep(showAs)
        updatedShowAs.result.value[index].value = event.target.value
        setShowAs(updatedShowAs)
    }

    const handleDeletingChoice = (id) => {
        const updatedShowAs = cloneDeep(showAs)
        updatedShowAs.result.value = showAs.result.value.filter((choice) => choice.id !== id)
        setShowAs(updatedShowAs)
    }

    return (
        <React.Fragment>
            <InputField
                boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                text="Show as"
                textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
            >
                <FormControl size="small" sx={{ maxWidth: 250 }} fullWidth>
                    <Select
                        size="small"
                        MenuProps={{
                            transformOrigin: { horizontal: 'left', vertical: 'top' },
                            anchorOrigin: { horizontal: 'right', vertical: 'top' },
                        }}
                        value={result.render}
                        onChange={handleSelectedOption}
                    >
                        {options.map((option, index) => (
                            <MenuItem key={index} value={option.value} multiple={option.multiple}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </InputField>
            <InputField
                boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
                text="Choices"
                textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
            >
                <Button size="small" variant="contained" startIcon={<Add />} onClick={handleAddingMoreChoice}>
                    Add New Choice
                </Button>
            </InputField>
            {result.value.map((choice, index) => (
                <Box key={choice.id} display="flex" alignItems="center" mt={2}>
                    <Typography sx={{ minWidth: 150, mr: 2 }}></Typography>
                    <TextField
                        size="small"
                        value={choice.value}
                        placeholder="Text"
                        variant="outlined"
                        sx={{ mr: 1.5 }}
                        onChange={(event) => handleTextChange(event, index)}
                    />
                    <IconButton onClick={() => handleDeletingChoice(choice.id)}>
                        <Clear />
                    </IconButton>
                </Box>
            ))}
        </React.Fragment>
    )
}

export default memo(OptionSection)
