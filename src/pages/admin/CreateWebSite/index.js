import { Fragment, useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'

import { Box, Container, Typography } from '@mui/material'
import HorizontalLinearStepper from '~/components/StepperCompo'

import AdminPage from '../AdminPage'
import ChooseTemplate from './ChooseTemplate'
import EditWebsite from './EditWebsite'
import ExportWebsite from './ExportWebsite'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useWebsite from '~/api/admin/website'
import sunEditorOption from '~/constants/SunEditorProps'
import { CREATE_WEBSITE } from '~/constants/steps'
import Loading from '~/pages/Loading'

const CreateWebsite = () => {
    const { checkHasWebsite } = useWebsite()
    const { conferenceId } = useParams()
    const showSnackbar = useSnackbar()
    const [activeStep, setActiveStep] = useState(0)
    const [template, setTemplate] = useState({ id: '', content: '' })
    const [templates, setTemplates] = useState([])
    const [templateHtml, setTemplateHtml] = useState({ header: '', content: '' })
    const [navbars, setNavbars] = useState([])
    const [navbar, setNavbar] = useState({ isEditing: false, name: '' })
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [subNavbarSelected, setSubNavbarSelected] = useState([])
    const [selectedNavbar, setSelectedNavbar] = useState({ id: '', name: '' })
    const [opens, setOpens] = useState([])
    const [webPageContent, setWebPageContent] = useState([])
    const [selectNav, setSelectNav] = useState({ content: '', href: '' })
    const contentRef = useRef('')
    const hasWebsiteYet = useRef(false)
    const [isHasWebsite, setIsHasWebsite] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [sunEditorProps, _] = useState({ ...sunEditorOption })

    const [loading, setLoading] = useState({
        chooseTemplate: true,
        addingPage: true,
    })

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }

    const handleSelectingTemplate = (event) => {
        const templateId = event.target.value
        const getTemplate = templates.find((item) => item.id === templateId)
        const getNavbars = cloneDeep(getTemplate.navbars)
        const opens = getNavbars.map((_, index) => index === -1)
        setNavbars(getNavbars)
        setOpens(opens)
        setTemplate((prev) => ({ ...prev, id: templateId }))
    }

    const handleExpandClick = (index) => {
        const newOpen = [...opens]
        newOpen[index] = !newOpen[index]
        setOpens(newOpen)
    }

    useEffect(() => {
        const controller = new AbortController()
        checkHasWebsite(conferenceId, controller.signal)
            .then((response) => {
                setIsHasWebsite(response.data)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later',
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <AdminPage>
            <Container maxWidth="xl">
                <Box mb={4} display="flex" justifyContent="space-between">
                    <Typography mb={1} sx={{ fontSize: 24, fontWeight: 600 }}>
                        Create Website
                    </Typography>
                </Box>
                <HorizontalLinearStepper alternativeLabel={false} steps={CREATE_WEBSITE} activeStep={activeStep} />
                {isLoading ? (
                    <Loading height="80vh" />
                ) : (
                    <Fragment>
                        {(() => {
                            switch (activeStep) {
                                case 0:
                                    return (
                                        <ChooseTemplate
                                            handleSelectingTemplate={handleSelectingTemplate}
                                            handleNext={handleNext}
                                            template={template}
                                            loading={loading}
                                            setTemplates={setTemplates}
                                            templates={templates}
                                            setLoading={setLoading}
                                            activeStep={activeStep}
                                            setNavbars={setNavbars}
                                            navbars={navbars}
                                            setOpens={setOpens}
                                            navbar={navbar}
                                            setNavbar={setNavbar}
                                            isAdd={isAdd}
                                            setIsAdd={setIsAdd}
                                            subNavbarSelected={subNavbarSelected}
                                            setSubNavbarSelected={setSubNavbarSelected}
                                            selectedNavbar={selectedNavbar}
                                            setSelectedNavbar={setSelectedNavbar}
                                            templateHtml={templateHtml}
                                            setTemplateHtml={setTemplateHtml}
                                            isHasWebsite={isHasWebsite}
                                            ref={hasWebsiteYet}
                                            setTemplate={setTemplate}
                                        />
                                    )
                                case 1:
                                    return (
                                        <EditWebsite
                                            handleBack={handleBack}
                                            navbars={navbars}
                                            opens={opens}
                                            handleExpandClick={handleExpandClick}
                                            loading={loading}
                                            setLoading={setLoading}
                                            setWebPageContent={setWebPageContent}
                                            setSelectNav={setSelectNav}
                                            webPageContent={webPageContent}
                                            selectNav={selectNav}
                                            template={template}
                                            templateHtml={templateHtml}
                                            handleNext={handleNext}
                                            isHasWebsite={isHasWebsite}
                                            ref={contentRef}
                                            sunEditorProps={sunEditorProps}
                                            subNavbarSelected={subNavbarSelected}
                                        />
                                    )
                                case 2:
                                    return (
                                        <ExportWebsite
                                            handleBack={handleBack}
                                            webPageContent={webPageContent}
                                            templateHtml={templateHtml}
                                            navbars={navbars}
                                            template={template}
                                        />
                                    )
                            }
                        })()}
                    </Fragment>
                )}
            </Container>
        </AdminPage>
    )
}

export default CreateWebsite
