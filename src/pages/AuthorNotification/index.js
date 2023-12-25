import { useState } from 'react'

import { cloneDeep } from 'lodash'

import { Box, ThemeProvider, Typography, createTheme } from '@mui/material'
import HorizontalLinearStepper from '~/components/StepperCompo'

import ConferenceDetail from '../ConferenceDetail'
import ChooseTrack from './ChooseTrack'
import EmailSettings from './EmailSettings'
import PreviewNotification from './PreviewNotification'
import ReviewNotification from './ReviewNotification'
import SendInvite from './SendInvite'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useEmailTemplate from '~/api/common/emailTemplate'
import { ScreenSize } from '~/constants/Sizes'
import { AUTHOR_NOTIFICATION } from '~/constants/steps'
import { useAppSelector } from '~/hooks/redux-hooks'

const theme = createTheme({ typography: { fontSize: 18 } })

const AuthorNotification = () => {
    const { userId } = useAppSelector((state) => state.auth)
    const {
        roleConference: { roleId },
    } = useAppSelector((state) => state.conference)
    const { createTemplate, editTemplate } = useEmailTemplate()
    const showSnackbar = useSnackbar()
    const [activeStep, setActiveStep] = useState(0)
    const [trackSelect, setTrackSelect] = useState({})
    const [statusSelect, setStatusSelect] = useState({})
    const [currentTrackSelected, setCurrentTrackSelected] = useState('-1')
    const [radioCheck, setRadioCheck] = useState('false')
    const [trackDataTable, setTrackDataTable] = useState([])
    const [tableData, setTableData] = useState([])
    const [templateData, setTemplateData] = useState([])
    const [trackRowSelect] = Object.keys(trackSelect)
    const [statuses, setStatuses] = useState([])
    const [submissionIds, setSubmissionIds] = useState([])
    const [loading, setLoading] = useState({
        trackSubmission: true,
        emailTemplates: true,
        reviewNotification: true,
        previewNotification: true,
    })
    const [emailsSent, setEmailsSent] = useState([])
    const [collectEmailSent, setCollectEmailSent] = useState([])

    const statusRowSelectIndex = Object.keys(statusSelect)
    const selectedStatusRows = statusRowSelectIndex.map((index) => tableData[Number(index)])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleChangeRadio = (event) => {
        setRadioCheck(event.target.value)
    }

    const handleSaveCell = (cell, value) => {
        const updatedTableData = cloneDeep(tableData)
        updatedTableData[cell.row.index][cell.column.id] = value
        setTableData(updatedTableData)
    }

    const resetEmailSetting = () => {
        setRadioCheck('false')
        setStatusSelect({})
    }

    const createNewTemplate = (template, handleClose, setLoading) => {
        createTemplate(template)
            .then((response) => {
                const getTemplate = response.data
                setTemplateData((prev) => [...prev, getTemplate])
                handleClose()
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Create template successfully',
                // })
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, cannot upload question image.',
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const updateTemplate = (template, handleClose, setLoading) => {
        editTemplate(template)
            .then((response) => {
                const newTemplate = response.data
                const updatedTemplateData = cloneDeep(templateData)
                const index = updatedTemplateData.findIndex((item) => item.templateId === newTemplate.templateId)
                if (index !== -1) {
                    updatedTemplateData.splice(index, 1, newTemplate)
                }
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Update template successfully',
                // })
                setTemplateData(updatedTemplateData)
                handleClose()
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, cannot upload question image.',
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <ConferenceDetail>
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Box mb={4} display="flex" justifyContent="space-between">
                    <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Author Notification Wizard
                    </Typography>
                </Box>
                <ThemeProvider theme={theme}>
                    <HorizontalLinearStepper
                        alternativeLabel={false}
                        steps={AUTHOR_NOTIFICATION}
                        activeStep={activeStep}
                    />
                    {(() => {
                        switch (activeStep) {
                            case 0:
                                return (
                                    <ChooseTrack
                                        rowSelection={trackSelect}
                                        setRowSelection={setTrackSelect}
                                        handleNext={handleNext}
                                        handleBack={handleBack}
                                        activeStep={activeStep}
                                        step={AUTHOR_NOTIFICATION}
                                        rowIndex={trackRowSelect}
                                        trackData={trackDataTable}
                                        setLoading={setLoading}
                                        loading={loading}
                                        setTrackDataTable={setTrackDataTable}
                                        currentTrackSelected={currentTrackSelected}
                                        setCurrentTrackSelected={setCurrentTrackSelected}
                                        resetEmailSetting={resetEmailSetting}
                                    />
                                )
                            case 1:
                                return (
                                    <EmailSettings
                                        rowSelection={statusSelect}
                                        setRowSelection={setStatusSelect}
                                        handleNext={handleNext}
                                        handleBack={handleBack}
                                        activeStep={activeStep}
                                        step={AUTHOR_NOTIFICATION}
                                        handleChangeRadio={handleChangeRadio}
                                        radioCheck={radioCheck}
                                        tableData={tableData}
                                        handleSaveCell={handleSaveCell}
                                        templateData={templateData}
                                        createNewTemplate={createNewTemplate}
                                        updateTemplate={updateTemplate}
                                        trackName={trackDataTable[trackRowSelect].trackName}
                                        trackId={trackDataTable[trackRowSelect].trackId}
                                        rowIndex={statusRowSelectIndex}
                                        loading={loading}
                                        setLoading={setLoading}
                                        setTemplateData={setTemplateData}
                                        setTableData={setTableData}
                                        setStatusSelect={setStatusSelect}
                                    />
                                )
                            case 2:
                                return (
                                    <ReviewNotification
                                        handleNext={handleNext}
                                        handleBack={handleBack}
                                        activeStep={activeStep}
                                        step={AUTHOR_NOTIFICATION}
                                        trackName={trackDataTable[trackRowSelect].trackName}
                                        trackId={trackDataTable[trackRowSelect].trackId}
                                        selectedStatusRows={selectedStatusRows}
                                        isAllAuthor={radioCheck}
                                        statuses={statuses}
                                        setStatuses={setStatuses}
                                        loading={loading}
                                        setLoading={setLoading}
                                    />
                                )
                            case 3:
                                return (
                                    <PreviewNotification
                                        handleNext={handleNext}
                                        handleBack={handleBack}
                                        activeStep={activeStep}
                                        step={AUTHOR_NOTIFICATION}
                                        trackName={trackDataTable[trackRowSelect].trackName}
                                        selectedStatusRows={selectedStatusRows}
                                        trackId={trackDataTable[trackRowSelect].trackId}
                                        emailsSent={emailsSent}
                                        isAllAuthor={radioCheck}
                                        setEmailsSent={setEmailsSent}
                                        loading={loading}
                                        setLoading={setLoading}
                                        setCollectEmailSent={setCollectEmailSent}
                                        setSubmissionIds={setSubmissionIds}
                                    />
                                )
                            case 4:
                                return (
                                    <SendInvite
                                        trackName={trackDataTable[trackRowSelect].trackName}
                                        selectedStatusRows={selectedStatusRows}
                                        trackId={trackDataTable[trackRowSelect].trackId}
                                        userId={userId}
                                        conferenceRoleId={roleId}
                                        allAuthors={radioCheck}
                                        collectEmailSent={collectEmailSent}
                                        submissionIds={submissionIds}
                                    />
                                )
                        }
                    })()}
                </ThemeProvider>
            </Box>
        </ConferenceDetail>
    )
}

export default AuthorNotification
