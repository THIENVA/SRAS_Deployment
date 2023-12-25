import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { CloudUpload, DownloadForOfflineOutlined } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

import ConferenceDetail from '../ConferenceDetail'
import TableData from './TableData'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'

const ImportReviewerQuotas = () => {
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState()
    const handleSubmit = () => {
        setLoading(true)
        showSnackbar({
            severity: 'success',
            children: 'Reviewer successfully imported.',
        })
        console.log(files)
    }

    const onInputChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        if (e.target.files[0].size > 2097152) {
            alert('File is too big!')
        } else {
            setFiles(file)
        }
    }

    const removeFile = () => {
        setFiles(null)
    }
    return (
        <ConferenceDetail>
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Typography mb={3} sx={{ fontSize: 28, fontWeight: 600 }}>
                    Import Reviewer Quotas
                </Typography>
                <Typography sx={{ fontSize: 16 }}>
                    If you wish to import reviewer quotas, please download the template and update it as appropriate.
                    Once you are done updating, please come back to this page and upload the template file.
                </Typography>
                <Box
                    sx={{
                        mt: 2,
                        px: 2,
                        py: 1,
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                    }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                        Download Template
                    </Typography>
                </Box>
                <ol>
                    <Typography component="li">
                        Click the <i>Download Template</i> button.
                    </Typography>
                    <Typography component="li">Save the file to your computer.</Typography>
                    <Typography component="li">
                        Update the file with your answers using a text editor (e.g. Notepad).
                    </Typography>
                </ol>
                <Typography sx={{ fontWeight: 'bold' }}>
                    Note: Quota for reviewers that are not part of the file will remain unchanged.
                </Typography>
                <Button variant="outlined" startIcon={<DownloadForOfflineOutlined />} sx={{ mt: 1, height: 36 }}>
                    Download Template
                </Button>
                <Box
                    sx={{
                        mt: 2,
                        px: 2,
                        py: 1,
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                    }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                        Upload Quotas
                    </Typography>
                </Box>
                {!files ? (
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            border: '2px dashed #1475cf',
                            height: 200,
                            cursor: 'pointer',
                            borderRadius: 2,
                            p: 1,
                        }}
                        component="label"
                        id="upload-file"
                    >
                        <input
                            id="upload-file"
                            type="file"
                            accept=".doc, .docx, .pdf"
                            className="input-field"
                            hidden
                            onChange={onInputChange}
                        />
                        <React.Fragment>
                            <CloudUpload fontSize="large" sx={{ color: '#1475cf' }} />
                            <p>Browse Files to upload</p>
                        </React.Fragment>
                    </Box>
                ) : (
                    <TableData removeFile={removeFile} />
                )}

                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 2,
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                    }}
                >
                    <Box ml={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                            sx={{
                                ml: 5,
                                color: AppStyles.colors['#027A9D'],
                                cursor: 'pointer',
                                fontSize: '1.125rem',
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                            onClick={() => history.push('/submission/author')}
                        >
                            Cancel
                        </Typography>
                        <Button
                            sx={{ ml: 5, textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ConferenceDetail>
    )
}

export default ImportReviewerQuotas
