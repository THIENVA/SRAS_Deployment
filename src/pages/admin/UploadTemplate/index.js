import { useEffect, useState } from 'react'

import axios from 'axios'
import JSZip from 'jszip'
import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Close } from '@mui/icons-material'
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
} from '@mui/material'
import TransitionCompo from '~/components/TransitionCompo'

import FilesTemplate from './Files'
import InputFile from './InputFile'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useTemplateWebsite from '~/api/admin/template-website'
import { APP_API_URL } from '~/config'

const UploadTemplate = ({ handleClose, open }) => {
    const { uploadNewTemplate } = useTemplateWebsite()
    const [filesInfo, setFilesInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const showSnackbar = useSnackbar()

    const handleUploadFile = (file, callback) => {
        const formData = new FormData()
        formData.append('file', file)
        uploadNewTemplate(formData)
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Upload template successfully',
                })
                callback()
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not Upload file. Please try again later',
                })
            })
    }

    useEffect(() => {
        axios({
            url: `${APP_API_URL}/web-templates/download-original-template`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                if (response.data.size) {
                    const zip = new JSZip()
                    return zip.loadAsync(response.data).then((zip) => {
                        const filesPromises = []
                        Object.keys(zip.files).forEach((filename) => {
                            const filePromise = zip.files[filename]
                                .async('blob')
                                .then((fileData) => {
                                    const newBlob = new Blob([fileData], { type: 'application/octet-stream' })
                                    return new File([newBlob], filename, { type: 'application/octet-stream' })
                                })
                                .catch(() => {
                                    return null
                                })
                            filesPromises.push(filePromise)
                        })

                        return Promise.all(filesPromises).then((files) => {
                            const formatFiles = files.map((file) => ({
                                name: file.name,
                                size: (file.size / 1024).toFixed(2),
                                id: uuid(),
                            }))
                            setFilesInfo(cloneDeep(formatFiles))
                            return files
                        })
                    })
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong. please try again later.',
                })
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={TransitionCompo}
            sx={{ backdropFilter: 'blur(4px)' }}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle id="alert-dialog-title">
                    <Typography>Upload Template</Typography>
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
                    <Paper p={3} sx={{ mb: 2 }}>
                        <Alert severity="warning">The system only accept website template as .html file</Alert>
                    </Paper>
                    <InputFile setFilesInfo={setFilesInfo} uploadTemplate={handleUploadFile} />
                    <FilesTemplate isLoading={loading} filesAttached={filesInfo} />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default UploadTemplate
