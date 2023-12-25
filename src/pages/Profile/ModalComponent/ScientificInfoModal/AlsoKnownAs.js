import React, { memo } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { AddCircleOutline, Delete } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'

const AlsoKnownAs = ({ alsoKnownAs, setAlsoKnownAs }) => {
    const handleAddName = () => {
        const newField = { name: '', messageName: '', id: uuid() }
        setAlsoKnownAs((prev) => [...prev, newField])
    }

    const handleNameChange = (event, messageName, index) => {
        const NewNames = [...alsoKnownAs]
        const { value, name } = event.target
        NewNames[index][name] = value
        NewNames[index][messageName] = ''
        setAlsoKnownAs(NewNames)
    }

    const handleDelete = (index) => {
        const updatedNames = cloneDeep(alsoKnownAs)
        updatedNames.splice(index, 1)
        setAlsoKnownAs(updatedNames)
    }

    return (
        <React.Fragment>
            <Typography variant="h6">Also known as</Typography>
            <Divider sx={{ mt: 0.5 }} />
            {alsoKnownAs.map((item, index) => (
                <Box display="flex" alignItems="flex-start" key={item.id} mt={2}>
                    <TextField
                        placeholder="Other Name"
                        sx={{ mb: 1 }}
                        name="name"
                        size="small"
                        onChange={(event) => handleNameChange(event, 'messageName', index)}
                        value={item.name}
                        helperText={item.messageName ? item.messageName : ''}
                        error={!!item.messageName}
                        fullWidth
                    />
                    <IconButton onClick={() => handleDelete(index)} sx={{ ml: 1 }}>
                        <Delete />
                    </IconButton>
                </Box>
            ))}
            <Button
                onClick={handleAddName}
                sx={{ mt: 2 }}
                size="small"
                startIcon={<AddCircleOutline fontSize="small" />}
            >
                Add another name
            </Button>
        </React.Fragment>
    )
}

export default memo(AlsoKnownAs)
