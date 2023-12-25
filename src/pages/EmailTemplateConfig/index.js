import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, Grid, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'
import SettingCompo from '~/components/SettingCompo'
import SupportPlaceholder from '~/components/SupportPlaceholder'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import CallPaperPlaceHolder from './CallPaperPlaceHolder'
import SectionLayout from './SectionLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useEmailTemplate from '~/api/common/emailTemplate'
import { AppStyles } from '~/constants/colors'
import { isEmpty } from '~/utils/commonFunction'

const EmailTemplateConfig = () => {
    const { getCallPaperTemplate, getCreateCameraReadyTemplate, updateCameraTemplate, updateCallPaperTemplate } =
        useEmailTemplate()
    const [buttonLoading, setButtonLoading] = useState(false)
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(true)
    const { conferenceId } = useParams()
    const [templateField, setTemplateField] = useState({
        id: '',
        subject: '',
        body: '',
    })
    const [cameraReadyTemplateField, setCameraReadyTemplateField] = useState({
        id: '',
        subject: '',
        body: '',
    })

    const handleCallPaper = (event) => {
        const { name, value } = event.target
        setTemplateField((prev) => ({ ...prev, [name]: value }))
    }

    const handleOpenCameraReady = (event) => {
        const { name, value } = event.target
        setCameraReadyTemplateField((prev) => ({ ...prev, [name]: value }))
    }

    const saveTemplate = () => {
        setButtonLoading(true)
        const { id, subject, body } = templateField
        const { id: cameraId, subject: cameraSubject, body: cameraBody } = cameraReadyTemplateField
        const saveCallPaperTemplate = updateCallPaperTemplate(id, body, subject)
        const saveCameraReadyTemplate = updateCameraTemplate(cameraId, cameraBody, cameraSubject)
        Promise.all([saveCallPaperTemplate, saveCameraReadyTemplate])
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Save email template successfully.',
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const callPaperGet = getCallPaperTemplate(conferenceId, controller.signal)
        const cameraReadyGet = getCreateCameraReadyTemplate(conferenceId, secondController.signal)
        Promise.all([callPaperGet, cameraReadyGet])
            .then((response) => {
                const callPaper = response[0].data
                const cameraReady = response[1].data
                if (callPaper) {
                    setTemplateField({ id: callPaper.id, body: callPaper.body, subject: callPaper.subject })
                }
                if (cameraReady) {
                    setCameraReadyTemplateField({
                        id: cameraReady.id,
                        body: cameraReady.body,
                        subject: cameraReady.subject,
                    })
                }
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { body } = templateField

    const isValid = !isEmpty(body) && !isEmpty(cameraReadyTemplateField.body)

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Email Template
                        </Typography>
                        {loading ? (
                            <Loading height="80vh" />
                        ) : (
                            <React.Fragment>
                                <SectionLayout style={{ mb: 4 }} title="CALLING FOR PAPER TEMPLATE">
                                    <InputField
                                        text="Subject"
                                        isRequire={true}
                                        textStyle={{ fontSize: 18 }}
                                        boxStyle={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            justifyContent: 'center',
                                        }}
                                        textBoxStyle={{ width: 120 }}
                                    >
                                        <Box minWidth={600}>
                                            <TextField
                                                fullWidth={true}
                                                placeholder="Subject"
                                                variant="outlined"
                                                value={templateField.subject}
                                                name="subject"
                                                onChange={handleCallPaper}
                                                size="small"
                                            />
                                        </Box>
                                    </InputField>
                                    <InputField
                                        text="Body"
                                        isRequire={true}
                                        textStyle={{ fontSize: 18 }}
                                        boxStyle={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                                        textBoxStyle={{ width: 120 }}
                                    >
                                        <Box minWidth={600}>
                                            <TextField
                                                fullWidth={true}
                                                variant="outlined"
                                                value={templateField.body}
                                                name="body"
                                                onChange={handleCallPaper}
                                                size="small"
                                                multiline
                                                rows={8}
                                            />
                                        </Box>
                                    </InputField>
                                    <SupportPlaceholder />
                                </SectionLayout>
                                <SectionLayout title="OPEN FOR CAMERA READY SUBMISSION TEMPLATE">
                                    <InputField
                                        text="Subject"
                                        isRequire={true}
                                        textStyle={{ fontSize: 18 }}
                                        boxStyle={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            justifyContent: 'center',
                                        }}
                                        textBoxStyle={{ width: 120 }}
                                    >
                                        <Box minWidth={600}>
                                            <TextField
                                                fullWidth={true}
                                                placeholder="Subject"
                                                variant="outlined"
                                                value={cameraReadyTemplateField.subject}
                                                name="subject"
                                                onChange={handleOpenCameraReady}
                                                size="small"
                                            />
                                        </Box>
                                    </InputField>
                                    <InputField
                                        text="Body"
                                        isRequire={true}
                                        textStyle={{ fontSize: 18 }}
                                        boxStyle={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                                        textBoxStyle={{ width: 120 }}
                                    >
                                        <Box minWidth={600}>
                                            <TextField
                                                fullWidth={true}
                                                variant="outlined"
                                                value={cameraReadyTemplateField.body}
                                                name="body"
                                                onChange={handleOpenCameraReady}
                                                size="small"
                                                multiline
                                                rows={8}
                                            />
                                        </Box>
                                    </InputField>
                                    <CallPaperPlaceHolder />
                                </SectionLayout>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: 36 }}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        loading={buttonLoading}
                                        disabled={buttonLoading || !isValid}
                                        onClick={saveTemplate}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </React.Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default EmailTemplateConfig
