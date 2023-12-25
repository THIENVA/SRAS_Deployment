import React, { useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import { useHistory, useParams } from 'react-router-dom'

import { Download } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Typography } from '@mui/material'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useWebsite from '~/api/admin/website'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { buildNavBars } from '~/utils/commonFunction'

const ExportWebsite = ({ handleBack, webPageContent, templateHtml, navbars, template }) => {
    const history = useHistory()
    const { conferenceId } = useParams()
    const { id } = template
    const { header, content } = templateHtml
    const [loading, setLoading] = useState(false)
    const { saveFinalWebsite, createWebsite } = useWebsite()
    const showSnackbar = useSnackbar()

    const handleExportWebsite = () => {
        setLoading(true)
        const formattedWebPages = webPageContent.map((page) => {
            const tempContent = page.content
            const navbarHtml = buildNavBars(navbars)
            const finalContent = content
                .replace('{header}', header)
                .replace('{nav}', navbarHtml)
                .replace('{content}', tempContent)
            return {
                fileName: page.fileName,
                tempContent,
                finalContent,
            }
        })

        createWebsite(conferenceId, id, { navbar: navbars })
            .then(() => {
                saveFinalWebsite(conferenceId, formattedWebPages)
                    .then(() => {
                        axios({
                            url: `${APP_API_URL}/website/export-final-website/${conferenceId}`,
                            method: 'GET',
                            responseType: 'blob',
                        })
                            .then((response) => {
                                saveAs(response.data, 'website.zip')
                                history.push('/admin')
                            })
                            .catch(() => {
                                showSnackbar({
                                    severity: 'error',
                                    children: 'Can not download file. Please try again later',
                                })
                            })
                    })
                    .catch(() => {
                        showSnackbar({
                            severity: 'error',
                            children: 'Can not download file. Please try again later',
                        })
                    })
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    mt: 3,
                    px: 2,
                    py: 1,
                    mb: 2,
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                    Export website
                </Typography>
            </Box>
            <Box height="60vh" display="flex" alignItems="center" justifyContent="center">
                <LoadingButton
                    variant="contained"
                    color="success"
                    startIcon={<Download />}
                    loadingPosition="start"
                    loading={loading}
                    onClick={handleExportWebsite}
                >
                    Export webpage files
                </LoadingButton>
            </Box>
            <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
            >
                <Button type="button" onClick={handleBack} sx={{ textTransform: 'none', height: 36, mx: 2 }}>
                    Previous
                </Button>
                <Button
                    type="button"
                    onClick={() => history.replace('/admin')}
                    sx={{ textTransform: 'none', height: 36 }}
                >
                    Finish
                </Button>
            </Box>
        </React.Fragment>
    )
}

export default ExportWebsite
