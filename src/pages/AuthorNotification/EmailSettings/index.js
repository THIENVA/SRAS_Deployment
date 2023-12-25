import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useHistory, useParams } from 'react-router-dom'

import { Add, Subject } from '@mui/icons-material'
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material'

import CapstoneProjectTable from './CapstoneProjectTable'
import CreateTemplateModal from './CreateTemplateModal'
import UpdateTemplateModal from './UpdateTemplateModal'

import useEmailTemplate from '~/api/common/emailTemplate'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import Loading from '~/pages/Loading'

const theme = createTheme({ typography: { fontSize: 16 } })

const EmailSettings = ({
    rowSelection,
    setRowSelection,
    handleNext,
    handleBack,
    activeStep,
    step,
    handleChangeRadio,
    radioCheck,
    tableData,
    handleSaveCell,
    templateData,
    createNewTemplate,
    updateTemplate,
    trackName,
    rowIndex,
    loading,
    setLoading,
    setTemplateData,
    setTableData,
    trackId: getTrackId,
    setStatusSelect,
}) => {
    const { conferenceId: id } = useParams()
    // const showSnackbar = useSnackbar()
    const { emailTemplates } = loading
    const {
        conference: { conferenceId },
        trackConference: { trackId },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const history = useHistory()
    const { getEmailTemplates } = useEmailTemplate()
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true)
    }

    const handleOpenUpdateModal = () => {
        setOpenUpdateModal(true)
    }

    const handleClosePaperModal = () => setOpenCreateModal(false)
    const handleCloseUpdateModal = () => setOpenUpdateModal(false)

    useEffect(() => {
        const controller = new AbortController()
        const track = roleName === ROLES_NAME.TRACK_CHAIR ? trackId : getTrackId
        if (emailTemplates) {
            getEmailTemplates(conferenceId, controller.signal, track)
                .then((response) => {
                    const statuses = response.data.statuses
                    const templates = response.data.templates
                    const formatTemplate = response.data.templates.filter((item) => item.templateName !== 'Empty')
                    const cloneTemplates = cloneDeep(templates)
                    const templatesLength = cloneTemplates.length
                    const formatStatuses = statuses.map((status) => {
                        let templateId = ''
                        if (templatesLength > 0) {
                            const getTemplate = cloneTemplates.find((template) =>
                                template.templateName.includes(status.name)
                            )
                            if (getTemplate) {
                                templateId = getTemplate.templateId
                            }
                        }
                        return {
                            ...status,
                            templateId: templateId,
                        }
                    })
                    setTableData(formatStatuses)
                    setTemplateData(formatTemplate)
                    const selection = {}
                    for (let i = 0; i < statuses.length; i++) {
                        selection[i] = true
                    }
                    setStatusSelect(selection)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong. Please try again later',
                    // })
                })
                .finally(() => {
                    setLoading((prev) => ({ ...prev, emailTemplates: false }))
                })
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return emailTemplates ? (
        <Loading height="70vh" />
    ) : (
        <React.Fragment>
            {openCreateModal && (
                <CreateTemplateModal
                    open={openCreateModal}
                    handleClose={handleClosePaperModal}
                    createNewTemplate={createNewTemplate}
                />
            )}
            {openUpdateModal && (
                <UpdateTemplateModal
                    open={openUpdateModal}
                    handleClose={handleCloseUpdateModal}
                    templateData={templateData}
                    updateTemplate={updateTemplate}
                />
            )}
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    mb: 2,
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                    Email settings
                </Typography>
            </Box>
            <ThemeProvider theme={theme}>
                <Box mb={1}>
                    <Typography sx={{ fontSize: 20, fontWeight: 'bold', mb: 1 }}>Recipients</Typography>
                    <Typography sx={{ fontSize: 16, mb: 1 }}>Please select the recipients below.</Typography>
                    <FormControl>
                        <RadioGroup value={radioCheck} onChange={handleChangeRadio}>
                            <FormControlLabel
                                value={false}
                                control={<Radio size="small" />}
                                label="Primary Contact Authors Only"
                            />
                            <FormControlLabel
                                value={true}
                                control={<Radio size="small" />}
                                label="All Authors With Registered Account"
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
                <Box>
                    <Box mb={1} display="flex" alignItems={'center'}>
                        <Typography mr={1} sx={{ fontSize: 20, fontWeight: 'bold' }}>
                            Email templates
                        </Typography>
                        <Button
                            variant="text"
                            sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none' }}
                            startIcon={<Add />}
                            onClick={() => handleOpenCreateModal()}
                        >
                            Create New Template
                        </Button>
                        {templateData.length !== 0 && (
                            <Button
                                variant="text"
                                sx={{ color: AppStyles.colors['#027A9D'], textTransform: 'none', ml: 2 }}
                                startIcon={<Subject />}
                                onClick={() => handleOpenUpdateModal()}
                            >
                                Edit Template
                            </Button>
                        )}
                    </Box>
                    <Typography sx={{ fontSize: 16, mb: 1 }}>
                        Select the templates that will be used to generate the emails sent to authors of papers with
                        corresponding paper statuses.
                    </Typography>
                    <CapstoneProjectTable
                        tableData={tableData}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        handleSaveCell={handleSaveCell}
                        handleOpenCreateModal={handleOpenCreateModal}
                        handleOpenUpdateModal={handleOpenUpdateModal}
                        templateData={templateData}
                        trackName={trackName}
                    />
                </Box>
            </ThemeProvider>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 2,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                }}
            >
                <Container maxWidth="lg">
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
                            onClick={() => history.push(`/conferences/${id}/submission/submission-console`)}
                        >
                            Cancel
                        </Typography>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ ml: 5, textTransform: 'none', height: 36 }}
                            variant="outlined"
                        >
                            Previous
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleNext}
                            variant="contained"
                            disabled={rowIndex.length === 0}
                            sx={{ ml: 5, textTransform: 'none', height: 36 }}
                        >
                            {activeStep === step.length - 1 ? 'Send' : 'Next'}
                        </Button>
                    </Box>
                </Container>
            </Box>
        </React.Fragment>
    )
}

export default React.memo(EmailSettings)
