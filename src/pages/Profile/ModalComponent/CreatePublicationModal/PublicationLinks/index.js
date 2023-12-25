import React, { memo } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { AddCircleOutline, Delete } from '@mui/icons-material'
import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'

import InputLayout from '../../InputLayout'

const PublicationLinks = ({ publicationLinks, setPublicationLinks }) => {
    const handleAddNewLink = () => {
        const newField = { label: '', link: '', messageLinkTitle: '', messageLinkUrl: '', id: uuid() }
        setPublicationLinks((prev) => [...prev, newField])
    }

    const handleLinkChange = (event, messageName, index) => {
        const newLinks = [...publicationLinks]
        const { value, name } = event.target
        newLinks[index][name] = value
        newLinks[index][messageName] = ''
        setPublicationLinks(newLinks)
    }

    const handleDelete = (index) => {
        const updatedNames = cloneDeep(publicationLinks)
        updatedNames.splice(index, 1)
        setPublicationLinks(updatedNames)
    }

    return (
        <React.Fragment>
            <Divider sx={{ my: 0.5 }} />
            <Typography mt={2} variant="h6">
                Other publication links
            </Typography>
            {publicationLinks.map((link, index) => (
                <Box width="1" display="flex" alignItems="flex-start" key={link.id} mt={index === 0 ? 2 : 5}>
                    <Box width="1" mr={1}>
                        <InputLayout boxStyle={{ width: '1' }} label="Link title">
                            <TextField
                                placeholder="Link Title"
                                sx={{ mb: 1 }}
                                name="label"
                                size="small"
                                onChange={(event) => handleLinkChange(event, 'messageLinkTitle', index)}
                                value={link.label}
                                helperText={link.messageLinkTitle ? link.messageLinkTitle : ''}
                                error={!!link.messageLinkTitle}
                                fullWidth
                            />
                        </InputLayout>
                        <InputLayout label="Link URL">
                            <TextField
                                placeholder="Link URL"
                                size="small"
                                name="link"
                                onChange={(event) => handleLinkChange(event, 'messageLinkUrl', index)}
                                value={link.link}
                                helperText={link.messageLinkUrl ? link.messageLinkUrl : ''}
                                error={!!link.messageLinkUrl}
                                fullWidth
                            />
                        </InputLayout>
                    </Box>
                    <IconButton onClick={() => handleDelete(index)} sx={{ ml: 1 }}>
                        <Delete />
                    </IconButton>
                </Box>
            ))}
            <Button
                onClick={handleAddNewLink}
                sx={{ mt: 2 }}
                size="small"
                startIcon={<AddCircleOutline fontSize="small" />}
            >
                Add another link
            </Button>
        </React.Fragment>
    )
}

export default memo(PublicationLinks)
