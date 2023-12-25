import { useState } from 'react'

import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { AddCircleOutline, Close, Delete, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from '@mui/material'
import TransitionCompo from '~/components/TransitionCompo'

import InputLayout from '../CreateGeneralProfile/Layout/InputLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { useAppSelector } from '~/hooks/redux-hooks'
import { isEmpty } from '~/utils/commonFunction'

const regex = /[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/

const WebSocialModal = ({ open, handleClose, websiteSocialLinks, profile, setProfile }) => {
    const { userId } = useAppSelector((state) => state.auth)
    const showSnackbar = useSnackbar()
    const { updateWebSocialLinks } = useProfile()
    const [loading, setLoading] = useState(false)
    const [links, setLinks] = useState(websiteSocialLinks)

    const handleAddNewLink = () => {
        const newField = { linkTitle: '', linkUrl: '', messageLinkTitle: '', messageLinkUrl: '', id: uuid() }
        setLinks((prev) => [...prev, newField])
    }

    const handleLinkChange = (event, messageName, index) => {
        const newLinks = [...links]
        const { value, name } = event.target
        newLinks[index][name] = value
        newLinks[index][messageName] = ''
        setLinks(newLinks)
    }

    const handleDelete = (index) => {
        const updatedLinks = cloneDeep(links)
        updatedLinks.splice(index, 1)
        setLinks(updatedLinks)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const isInvalid = links.some(
            (link) => isEmpty(link.linkTitle) || isEmpty(link.linkUrl) || !regex.test(link.linkUrl)
        )
        if (isInvalid) {
            const updatedLinks = links.map((link) => {
                if (isEmpty(link.linkTitle)) {
                    link.messageLinkTitle = 'The link title must not be empty'
                }
                if (isEmpty(link.linkUrl)) {
                    link.messageLinkUrl = 'The link url must not be empty'
                } else if (!regex.test(link.linkUrl)) {
                    link.messageLinkUrl = 'Invalid URL'
                }
                return link
            })
            setLinks(cloneDeep(updatedLinks))
        } else {
            setLoading(true)
            const data = { value: JSON.stringify(links) }
            updateWebSocialLinks(userId, data)
                .then(() => {
                    const cloneProfile = cloneDeep(profile)
                    cloneProfile.websiteAndSocialLinks = JSON.stringify(links)
                    setProfile(cloneProfile)
                    handleClose()
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later.',
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <Dialog
            sx={{ backdropFilter: 'blur(4px)' }}
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={TransitionCompo}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle id="alert-dialog-title">
                    Websites & social links
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle2">
                        Add links to personal websites, department profiles, Wikipedia pages or social media accounts
                    </Typography>
                    {links.map((link, index) => (
                        <Box width="1" display="flex" alignItems="flex-start" key={link.id} mt={index === 0 ? 2 : 5}>
                            <Box width="1" mr={1}>
                                <InputLayout boxStyle={{ mb: 1 }} label="Link title">
                                    <TextField
                                        placeholder="Link Title"
                                        sx={{ mb: 1 }}
                                        name="linkTitle"
                                        size="small"
                                        onChange={(event) => handleLinkChange(event, 'messageLinkTitle', index)}
                                        value={link.linkTitle}
                                        helperText={link.messageLinkTitle ? link.messageLinkTitle : ''}
                                        error={!!link.messageLinkTitle}
                                        fullWidth
                                    />
                                </InputLayout>
                                <InputLayout label="Link URL">
                                    <TextField
                                        placeholder="Link URL"
                                        size="small"
                                        name="linkUrl"
                                        onChange={(event) => handleLinkChange(event, 'messageLinkUrl', index)}
                                        value={link.linkUrl}
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
                        sx={{ mt: 2 }}
                        size="small"
                        startIcon={<AddCircleOutline fontSize="small" />}
                        onClick={handleAddNewLink}
                    >
                        Add another link
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Save />}
                        variant="contained"
                        onClick={handleSubmit}
                    >
                        Save Change
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default WebSocialModal
