import React, { forwardRef, useEffect, useState } from 'react'

import parse from 'html-react-parser'
import { cloneDeep } from 'lodash'
import ReactDOMServer from 'react-dom/server'
import { useHistory, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Preview } from '@mui/icons-material'
import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
    Skeleton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import AlertPopup from '~/components/AlertPopup'

import TableRowsLoader from '../TemplateSkeleton'
import CreateTemplate from './CreateTemplate'
import Navbars from './Navbars'
import SubNavbars from './SubNavbars'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useNavbar from '~/api/admin/navbar'
import useTemplateWebsite from '~/api/admin/template-website'
import { useConference } from '~/api/common/conference'
import { AppStyles } from '~/constants/colors'
import { buildNavBarsPreview, generateConferenceHeader } from '~/utils/commonFunction'

const ChooseTemplate = forwardRef(
    (
        {
            handleSelectingTemplate,
            template,
            templates,
            handleNext,
            loading,
            setTemplates,
            setLoading,
            setNavbars,
            navbars,
            navbar,
            setNavbar,
            isAdd,
            setIsAdd,
            subNavbarSelected,
            setSubNavbarSelected,
            selectedNavbar,
            setSelectedNavbar,
            setTemplateHtml,
            templateHtml,
            isHasWebsite,
            setTemplate,
        },
        ref
    ) => {
        const { chooseTemplate } = loading
        const showSnackbar = useSnackbar()
        const { conferenceId } = useParams()
        const { id } = template
        const history = useHistory()
        const { getTemplates, createNewTemplate } = useTemplateWebsite()
        const { getConferenceDetail } = useConference()
        const { getNavbar } = useNavbar()
        const [open, setOpen] = useState(false)
        const [openGoBack, setOpenGoBack] = useState(false)

        const handleOpenNewTemplate = () => setOpen(true)

        const handleCloseNewTemplate = () => setOpen(false)

        const handlePreviewPage = () => {
            const openNewWindow = window.open('', '_blank')
            const navbarHtml = buildNavBarsPreview(navbars)
            const { content, header } = templateHtml
            const fullContent = content.replace('{header}', header).replace('{nav}', navbarHtml)
            const htmlDom = parse(fullContent)
            openNewWindow.document.write(ReactDOMServer.renderToStaticMarkup(htmlDom))
        }

        const handleSelectNav = (parentId, parentName) => {
            const getNav = navbars.find((nav) => nav.parentId === parentId)
            const childs = cloneDeep(getNav).childs
            setSubNavbarSelected(childs)
            setSelectedNavbar({ id: parentId, name: parentName })
        }

        const cancelEditingHandler = () => {
            setNavbar(() => ({ name: '', isEditing: false }))
            setIsAdd({ status: true, id: null })
        }

        const createWebSiteHandler = () => {
            if (!isHasWebsite) {
                const submittedNavbars = cloneDeep(navbars)
                submittedNavbars.forEach((parentNav) => {
                    const parentHref = parentNav.parentLabel.trim().replace(/\s/g, '').toLowerCase()
                    parentNav.href = `${parentHref}.html`
                    parentNav.childs.forEach((subNav) => {
                        const subNavHref = subNav.childLabel.trim().replace(/\s/g, '').toLowerCase()
                        subNav.href = `${parentHref}_${subNavHref}.html`
                    })
                })
                setNavbars(submittedNavbars)
                handleNext()
            } else {
                const submittedNavbars = cloneDeep(navbars)
                submittedNavbars.forEach((parentNav) => {
                    const parentLabel = parentNav.parentLabel.trim().replace(/\s/g, '').toLowerCase()
                    const parentHref = parentLabel
                    if (!parentNav.href.trim()) parentNav.href = `${parentHref}.html`
                    parentNav.childs.forEach((subNav) => {
                        const subNavHref = subNav.childLabel.trim().replace(/\s/g, '').toLowerCase()
                        if (!subNav.href.trim()) subNav.href = `${parentLabel}_${subNavHref}.html`
                    })
                })
                setNavbars(submittedNavbars)
                handleNext()
            }
        }

        const modifyNavbarHandler = (value) => {
            if (isAdd.status) {
                const newNavbar = {
                    parentId: uuid(),
                    parentLabel: value.trim(),
                    href: '',
                    childs: [],
                }
                setNavbars((prev) => [...prev, newNavbar])
            } else {
                const position = navbars.findIndex((item) => item.parentId === isAdd.id)
                const updatedNavbars = cloneDeep(navbars)
                updatedNavbars[position].parentLabel = value
                setNavbars(updatedNavbars)
            }
            setNavbar(() => ({ name: '', isEditing: false }))
            setIsAdd({ status: true, id: null })
        }

        const openEditNavbarHandler = (id) => {
            const navbarItem = navbars.find((item) => item.parentId === id)
            setNavbar({ isEditing: true, name: navbarItem.parentLabel })
            setIsAdd({ status: false, id })
        }

        const modifySubNavHandler = (value, parentId, isAdd) => {
            const parentIndex = navbars.findIndex((item) => item.parentId === parentId)

            if (isAdd.status) {
                const childId = uuid()
                const updatedNavbars = cloneDeep(navbars)
                const newSubNav = {
                    childId: childId,
                    childLabel: value.trim(),
                    href: '',
                }
                updatedNavbars[parentIndex].childs.push(newSubNav)
                setSubNavbarSelected(updatedNavbars[parentIndex].childs)
                setNavbars(updatedNavbars)
            } else {
                const updatedNavbars = cloneDeep(navbars)
                const position = navbars[parentIndex].childs.findIndex((child) => child.childId === isAdd.id)
                updatedNavbars[parentIndex].childs[position].childLabel = value
                setSubNavbarSelected(updatedNavbars[parentIndex].childs)
                setNavbars(updatedNavbars)
            }
        }

        const deleteNavbar = (id, closeAlert) => {
            if (navbar.isEditing) {
                isAdd.id === id && setNavbar(() => ({ name: '', isEditing: false }))
            }
            const updatedNavbars = navbars.filter((item) => item.parentId !== id)
            setNavbars(updatedNavbars)
            setSelectedNavbar('')
            setSubNavbarSelected([])
            closeAlert()
        }

        const deleteSubNav = (subNavId, closeAlert) => {
            const updatedNavbars = cloneDeep(navbars)
            const parentIndex = updatedNavbars.findIndex((item) => item.parentId === selectedNavbar.id)
            const childIndex = updatedNavbars[parentIndex].childs.findIndex((item) => item.childId === subNavId)
            updatedNavbars[parentIndex].childs.splice(childIndex, 1)
            if (updatedNavbars[parentIndex].childs.length === 0) updatedNavbars[parentIndex].href = ''
            setNavbars(updatedNavbars)
            setSubNavbarSelected(updatedNavbars[parentIndex].childs)
            closeAlert()
        }

        const handleSwapNavbar = (index, action) => {
            const navbar = cloneDeep(navbars.at(index))
            const nextNavbar = cloneDeep(navbars.at(index + 1))
            const prevNavbar = cloneDeep(navbars.at(index - 1))
            const updatedNavbars = cloneDeep(navbars)
            if (action === 'down') {
                updatedNavbars[index] = nextNavbar
                updatedNavbars[index + 1] = navbar
            } else if (action === 'up') {
                updatedNavbars[index] = prevNavbar
                updatedNavbars[index - 1] = navbar
            }
            setNavbars(updatedNavbars)
        }

        const handleSwapSubNavbar = (parentId, childIndex, action) => {
            const updatedNavbars = cloneDeep(navbars)
            const updatedSelectedSubNav = cloneDeep(subNavbarSelected)
            const parentIndex = navbars.findIndex((nav) => nav.parentId === parentId)
            const navbar = cloneDeep(updatedSelectedSubNav.at(childIndex))
            const nextNavbar = cloneDeep(updatedSelectedSubNav.at(childIndex + 1))
            const prevNavbar = cloneDeep(updatedSelectedSubNav.at(childIndex - 1))
            if (action === 'down') {
                updatedSelectedSubNav[childIndex] = nextNavbar
                updatedSelectedSubNav[childIndex + 1] = navbar
            } else if (action === 'up') {
                updatedSelectedSubNav[childIndex] = prevNavbar
                updatedSelectedSubNav[childIndex - 1] = navbar
            }
            updatedNavbars[parentIndex].childs = updatedSelectedSubNav
            setNavbars(updatedNavbars)
            setSubNavbarSelected(updatedSelectedSubNav)
        }

        const handleCreateTemplate = (name, description, callback) => {
            createNewTemplate(name, description, { navbar: navbars })
                .then((response) => {
                    const updatedTemplate = cloneDeep(templates)
                    const formatResponse = {
                        ...response.data,
                        conferenceHasUsed: response.data.conferenceUsed,
                        navbars: response.data.navbar,
                    }
                    updatedTemplate.push(cloneDeep(formatResponse))
                    setTemplates(updatedTemplate)
                    handleCloseNewTemplate()
                    showSnackbar({
                        severity: 'success',
                        children: 'Create new template successfully',
                    })
                })
                .finally(() => {
                    callback(false)
                })
        }

        useEffect(() => {
            const secondController = new AbortController()
            const secondSignal = secondController.signal
            const thirdController = new AbortController()
            const thirdSignal = thirdController.signal
            const fourthController = new AbortController()
            const fourthSignal = fourthController.signal

            if (chooseTemplate) {
                const conferenceDetailGet = getConferenceDetail(conferenceId, thirdSignal)
                const websiteId = isHasWebsite ? conferenceId : null
                const templatesGet = getTemplates(websiteId, fourthSignal)

                if (isHasWebsite) {
                    const navbarsGet = getNavbar(conferenceId, secondSignal)
                    Promise.all([conferenceDetailGet, templatesGet, navbarsGet])
                        .then((response) => {
                            const conferenceInfo = response[0].data
                            const templatesInfo = response[1].data
                            const navbarsInfo = response[2].data
                            const conferenceHeader = generateConferenceHeader(conferenceInfo)
                            ref.current = templatesInfo.selectedTemplate
                            setNavbars(navbarsInfo.navbar)
                            setTemplate({ id: templatesInfo.selectedTemplate, content: templatesInfo.content })
                            setTemplateHtml({ header: conferenceHeader, content: templatesInfo.content })
                            setTemplates(templatesInfo.templates)
                        })
                        .finally(() => {
                            setLoading((prev) => ({ ...prev, chooseTemplate: false }))
                        })
                } else {
                    Promise.all([conferenceDetailGet, templatesGet])
                        .then((response) => {
                            const conferenceInfo = response[0].data
                            const templatesInfo = response[1].data
                            const conferenceHeader = generateConferenceHeader(conferenceInfo)
                            setTemplateHtml({ header: conferenceHeader, content: templatesInfo.content })
                            setTemplates(templatesInfo.templates)
                        })
                        .finally(() => {
                            setLoading((prev) => ({ ...prev, chooseTemplate: false }))
                        })
                }
            }

            return () => {
                secondController.abort()
                thirdController.abort()
                fourthController.abort()
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
            <React.Fragment>
                {openGoBack && (
                    <AlertPopup
                        open={openGoBack}
                        handleClose={() => setOpenGoBack(false)}
                        handleDelete={() => history.replace('/admin')}
                    >
                        Are you sure you want to exit? All of content you have created will be gone.
                    </AlertPopup>
                )}
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
                        SELECT YOUR TEMPLATE
                    </Typography>
                </Box>
                <RadioGroup>
                    <TableContainer sx={{ my: 2 }} component={Paper}>
                        <Table
                            sx={{
                                width: '100%',
                                overflow: 'hidden',
                            }}
                        >
                            <TableHead>
                                <TableRow
                                    sx={{
                                        'td, th': {
                                            borderRight: '1px solid #cecdcd',
                                            py: 1,
                                            px: 2,
                                        },
                                    }}
                                >
                                    <TableCell>Choose</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Conference has used</TableCell>
                                    <TableCell align="left">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ backgroundColor: AppStyles.colors['#F5F5F5'] }}>
                                {chooseTemplate ? (
                                    <TableRowsLoader rowsNum={4} />
                                ) : (
                                    templates.map((template) => (
                                        <TableRow
                                            hover
                                            sx={{
                                                'td, th': {
                                                    borderRight: '1px solid #cecdcd',
                                                    py: 1,
                                                    px: 2,
                                                },
                                            }}
                                            key={template.id}
                                        >
                                            <TableCell align="left">
                                                <FormControlLabel
                                                    onChange={handleSelectingTemplate}
                                                    control={<Radio />}
                                                    disabled={!!ref.current}
                                                    value={template.id}
                                                    checked={template.id === id}
                                                />
                                            </TableCell>
                                            <TableCell>{template.name}</TableCell>
                                            <TableCell>{template.description}</TableCell>
                                            <TableCell align="left">
                                                {template.conferenceHasUsed.map((conference, index) => (
                                                    <Typography gutterBottom key={index}>
                                                        {conference}
                                                    </Typography>
                                                ))}
                                            </TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handlePreviewPage()}>
                                                    <Preview fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </RadioGroup>
                <Box
                    sx={{
                        my: 2,
                        px: 2,
                        py: 1,
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                    }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                        CUSTOM NAVBAR
                    </Typography>
                </Box>
                <Grid container columnSpacing={3} mt={4}>
                    <React.Fragment>
                        <Grid item lg={6}>
                            {chooseTemplate ? (
                                <Stack spacing={1}>
                                    <Skeleton height={40} width="1" variant="rectangular" />
                                    <Skeleton height={40} width="1" variant="rectangular" />
                                    <Skeleton height={400} width="1" variant="rectangular" />
                                </Stack>
                            ) : (
                                <Navbars
                                    template={template}
                                    navbars={navbars}
                                    handleSelectNav={handleSelectNav}
                                    selectedNavbar={selectedNavbar}
                                    openEditNavbarHandler={openEditNavbarHandler}
                                    cancelEditingHandler={cancelEditingHandler}
                                    navbar={navbar}
                                    isAdd={isAdd}
                                    modifyNavbarHandler={modifyNavbarHandler}
                                    deleteNavbar={deleteNavbar}
                                    handleSwapNavbar={handleSwapNavbar}
                                />
                            )}
                        </Grid>
                        <Grid item lg={6}>
                            {chooseTemplate ? (
                                <Stack spacing={1}>
                                    <Skeleton height={40} width="1" variant="rectangular" />
                                    <Skeleton height={40} width="1" variant="rectangular" />
                                    <Skeleton height={400} width="1" variant="rectangular" />
                                </Stack>
                            ) : (
                                <SubNavbars
                                    subNavbarSelected={subNavbarSelected}
                                    selectedNavbar={selectedNavbar}
                                    modifySubNavHandler={modifySubNavHandler}
                                    deleteSubNav={deleteSubNav}
                                    handleSwapSubNavbar={handleSwapSubNavbar}
                                />
                            )}
                        </Grid>
                    </React.Fragment>
                </Grid>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                >
                    <Button onClick={handleOpenNewTemplate} variant="outlined" color="info">
                        Create new template
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setOpenGoBack(true)}
                        sx={{ textTransform: 'none', height: 36, ml: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        type="button"
                        onClick={createWebSiteHandler}
                        disabled={!id || navbars.length === 0}
                        sx={{ textTransform: 'none', height: 36, ml: 2 }}
                    >
                        Next
                    </Button>
                </Box>
                {open && (
                    <CreateTemplate
                        open={open}
                        handleClose={handleCloseNewTemplate}
                        handleNewTemplate={handleCreateTemplate}
                    />
                )}
            </React.Fragment>
        )
    }
)

export default ChooseTemplate
