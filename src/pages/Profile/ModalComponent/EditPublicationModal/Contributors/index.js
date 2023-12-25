import React, { memo } from 'react'

import { cloneDeep } from 'lodash'

import { AddCircleOutline, Delete } from '@mui/icons-material'
import { Box, Button, Divider, FormHelperText, IconButton, TextField, Typography } from '@mui/material'

import InputLayout from '../../InputLayout'

const ContributorNames = ({ contributors, setContributors, contributorError, setContributorError }) => {
    const { error, messageError } = contributorError
    const handleAddName = () => {
        const newField = ''
        setContributors((prev) => [...prev, newField])
        setContributorError({ error: false, messageError: '' })
    }

    const handleNameChange = (event, index) => {
        const NewNames = [...contributors]
        const { value } = event.target
        NewNames[index] = value
        setContributors(NewNames)
    }

    const handleDelete = (index) => {
        const updatedNames = cloneDeep(contributors)
        updatedNames.splice(index, 1)
        setContributors(updatedNames)
    }

    return (
        <React.Fragment>
            <Divider sx={{ mt: 0.5, mb: 2 }} />
            <Typography variant="h6">
                Contributor names <span style={{ color: 'red' }}>*</span>
            </Typography>
            {contributors.map((item, index) => (
                <Box display="flex" alignItems="flex-start" key={item.id} mt={2}>
                    <InputLayout boxStyle={{ width: '1' }} label="Contributor name">
                        <TextField
                            sx={{ mb: 1 }}
                            name="name"
                            size="small"
                            onChange={(event) => handleNameChange(event, index)}
                            value={item}
                            fullWidth
                        />
                    </InputLayout>
                    <IconButton onClick={() => handleDelete(index)} sx={{ ml: 1 }}>
                        <Delete />
                    </IconButton>
                </Box>
            ))}
            {error && <FormHelperText error={error}>{messageError}</FormHelperText>}
            <Button
                onClick={handleAddName}
                sx={{ mt: 2 }}
                size="small"
                startIcon={<AddCircleOutline fontSize="small" />}
            >
                Add contributor name
            </Button>
        </React.Fragment>
    )
}

export default memo(ContributorNames)
