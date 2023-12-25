import React, { forwardRef, useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useHistory, useParams } from 'react-router-dom'

import { CheckCircleOutline, ContentCopy, ExpandLess, ExpandMore, Html } from '@mui/icons-material'
import {
    Box,
    Button,
    Collapse,
    Divider,
    Grid,
    IconButton,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material'
import AlertPopup from '~/components/AlertPopup'
import SunTextEditor from '~/components/SunTextEditor'

import useTemplateWebsite from '~/api/admin/template-website'
import { APP_ROOT_URL } from '~/config'
import { AppStyles } from '~/constants/colors'

const EditWebsite = forwardRef(
    (
        {
            navbars,
            opens,
            handleExpandClick,
            setWebPageContent,
            setSelectNav,
            webPageContent,
            selectNav,
            handleNext,
            handleBack,
            templateHtml,
            isHasWebsite,
            loading,
            setLoading,
            sunEditorProps,
            subNavbarSelected,
        },
        ref
    ) => {
        const { getContent } = useTemplateWebsite()
        const { conferenceId } = useParams()
        const history = useHistory()
        const [openGoBack, setOpenGoBack] = useState(false)
        const [isCopy, setCopy] = useState(false)
        const { addingPage } = loading

        const formattedNavbars = navbars.flatMap((item) => {
            const result = []
            const cloneItem = cloneDeep(item)
            result.push({ fileName: cloneItem.href, label: cloneItem.parentLabel })
            if (cloneItem.childs && cloneItem.childs.length > 0) {
                cloneItem.childs.forEach((childItem) => {
                    result.push({ fileName: childItem.href, label: childItem.childLabel })
                })
            }
            return cloneDeep(result)
        })

        const copyClipBoardHandler = () => {
            setCopy(true)

            setTimeout(() => {
                setCopy(false)
            }, 2000)
        }
        const previousHandler = () => {
            setSelectNav((prev) => ({ ...prev, content: ref.current }))
            handleBack()
        }

        const nextHandler = () => {
            setSelectNav((prev) => ({ ...prev, content: ref.current }))
            handleNext()
        }

        const handleSelecting = (href) => {
            const cloneWebContent = cloneDeep(webPageContent)
            const selectedFile = cloneWebContent.find((item) => item.fileName === href)
            if (selectedFile) {
                const content = cloneDeep(selectedFile.content)
                setSelectNav({ href, content: content })
                ref.current = content
            } else {
                setSelectNav({ href, content: '' })
            }
        }

        useEffect(() => {
            const controller = new AbortController()
            if (addingPage) {
                if (isHasWebsite) {
                    getContent(conferenceId, controller.signal)
                        .then((response) => {
                            const content = response.data
                            const formatContent = []
                            formattedNavbars.forEach((item) => {
                                const cloneNavbarItem = cloneDeep(item)
                                let shouldSkip = false
                                let count = 0
                                content.forEach((getContent) => {
                                    const cloneContent = cloneDeep(getContent)
                                    if (!shouldSkip) {
                                        if (cloneContent.fileName === cloneNavbarItem.fileName) {
                                            formatContent.push({
                                                fileName: cloneNavbarItem.fileName,
                                                content: cloneContent.content,
                                            })
                                            shouldSkip = true
                                        }
                                    }
                                    count = count + 1
                                })
                                if (count === content.length && !shouldSkip) {
                                    formatContent.push({
                                        fileName: cloneNavbarItem.fileName,
                                        content: `<div>Hello ${cloneNavbarItem.label}</div>`,
                                    })
                                }
                            })

                            const cloneFormatted = cloneDeep(formatContent)
                            setWebPageContent(cloneFormatted)
                        })
                        .finally(() => {
                            setLoading((prev) => ({ ...prev, addingPage: false }))
                        })
                } else {
                    const formattedContent = []
                    formattedNavbars.forEach((item) => {
                        const cloneItem = cloneDeep(item)
                        formattedContent.push({
                            fileName: cloneItem.fileName,
                            content: `<div>Hello ${cloneItem.label}</div>`,
                        })
                    })
                    const cloneFormatted = cloneDeep(formattedContent)
                    setLoading((prev) => ({ ...prev, addingPage: false }))
                    setWebPageContent(cloneFormatted)
                }
            }

            return () => {
                controller.abort()
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        useEffect(() => {
            if (!addingPage) {
                const newFileContent = []
                const formatFileName = webPageContent.map((file) => file.fileName)
                formattedNavbars.forEach((nav) => {
                    if (formatFileName.includes(nav.fileName)) {
                        const getFile = webPageContent.find((item) => item.fileName === nav.fileName)
                        const cloneFile = cloneDeep(getFile)
                        newFileContent.push({ fileName: cloneFile.fileName, content: cloneFile.content })
                    } else {
                        const cloneNav = cloneDeep(nav)
                        newFileContent.push({ fileName: cloneNav.fileName, content: `<div>Hello ${nav.label}</div>` })
                    }
                })
                setWebPageContent(cloneDeep(newFileContent))
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [addingPage, JSON.stringify(navbars), JSON.stringify(subNavbarSelected)])

        console.log(navbars)

        return (
            <React.Fragment>
                <AlertPopup
                    open={openGoBack}
                    handleClose={() => setOpenGoBack(false)}
                    handleDelete={() => history.replace('/admin')}
                >
                    Are you sure you want to exit? All of content you have created will be gone.
                </AlertPopup>
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
                        Modify Web Content
                    </Typography>
                    <Box
                        sx={{
                            borderRadius: 2,
                            p: 3,
                            my: 1,
                            mb: 3,
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            border: '0.5px solid #cecdcd',
                        }}
                    >
                        <Typography mb={1} sx={{ fontSize: 16 }}>
                            <strong>Effortless Linking with Our Text Editor: A Handy Guide</strong>
                        </Typography>

                        <Typography variant="body1">
                            • <strong>Internal Page Links:</strong> For linking between navigation pages within
                            generated site, use{' '}
                            <strong>
                                <code>{`{{navbarName:message}}`}</code>
                            </strong>
                            . Example:{' '}
                            <strong>
                                <code>{`{{About:Go to About}}`}</code>
                            </strong>
                            .
                        </Typography>
                        <Box mt={1} display="flex" alignItems={'center'}>
                            <Typography variant="body1">
                                • <strong>External Links:</strong> Click the &quot;Link&quot;
                            </Typography>
                            <Box ml={0.5} display="flex" width={16} height={16}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.74 15.72">
                                    <g>
                                        <path
                                            d="M13.05,13.63a.24.24,0,0,1,.15.22L13.42,16a.19.19,0,0,1-.08.18l-2.12,2.14a4.08,4.08,0,0,1-1.29.85A4,4,0,0,1,4.71,17a3.92,3.92,0,0,1-.3-1.52A4,4,0,0,1,4.71,14a3.91,3.91,0,0,1,.87-1.3L7.7,10.56a.25.25,0,0,1,.2-.06l2.17.22a.21.21,0,0,1,.19.15.24.24,0,0,1,0,.25L7.12,14.23a1.81,1.81,0,0,0,0,2.58,1.78,1.78,0,0,0,1.29.52,1.74,1.74,0,0,0,1.28-.52L12.8,13.7a.24.24,0,0,1,.25-.07ZM19,4.92a4,4,0,0,1,0,5.66L16.86,12.7a.25.25,0,0,1-.17.08l-2.2-.23a.21.21,0,0,1-.19-.15.22.22,0,0,1,0-.25L17.44,9a1.81,1.81,0,0,0,0-2.58,1.78,1.78,0,0,0-1.29-.52,1.74,1.74,0,0,0-1.28.52L11.76,9.57a.21.21,0,0,1-.25,0,.24.24,0,0,1-.16-.21l-.22-2.17a.19.19,0,0,1,.08-.18l2.12-2.14a4.08,4.08,0,0,1,1.29-.85,4.05,4.05,0,0,1,3.06,0,3.85,3.85,0,0,1,1.3.85ZM5.84,9.82a.25.25,0,0,1-.18-.08.19.19,0,0,1-.07-.19l.11-.77a.2.2,0,0,1,.11-.17.24.24,0,0,1,.2,0l2.5.72a.25.25,0,0,1,.15.27.22.22,0,0,1-.23.21l-2.59,0Zm4.12-2-.73-2.5a.27.27,0,0,1,0-.2A.21.21,0,0,1,9.41,5L10.19,5a.25.25,0,0,1,.19,0,.23.23,0,0,1,.08.18l-.05,2.61a.2.2,0,0,1-.19.23h0A.22.22,0,0,1,10,7.85Zm8.76,5.58a.25.25,0,0,1,.18.08.23.23,0,0,1,.06.2l-.11.77a.25.25,0,0,1-.11.17.21.21,0,0,1-.12,0l-.08,0L16,14a.25.25,0,0,1-.15-.27.22.22,0,0,1,.22-.21l1.29,0,1.33,0Zm-4.12,2,.74,2.51a.28.28,0,0,1,0,.2.23.23,0,0,1-.18.11l-.8.11a.23.23,0,0,1-.17-.07.25.25,0,0,1-.08-.18l0-2.61a.22.22,0,0,1,.22-.22.21.21,0,0,1,.26.15Z"
                                            transform="translate(-4.41 -3.77)"
                                        ></path>
                                    </g>
                                </svg>
                            </Box>
                            <Typography ml={1}>button in the editor to attach external web addresses.</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box my={1}>
                    <Typography variant="h6" sx={{ fontSize: '.75rem', letterSpacing: '.0625rem', fontWeight: 'bold' }}>
                        SUBMIT SUBMISSION LINK
                    </Typography>
                    <Box display="flex" alignItems={'center'}>
                        <Box mr={1} sx={{ width: 240 }}>
                            <InputBase
                                fullWidth
                                sx={{ padding: 1, height: 36, border: '.125rem solid #1976d2' }}
                                inputProps={{ 'aria-label': 'link' }}
                                value={`${APP_ROOT_URL}/conferences/${conferenceId}/submission/author`}
                            />
                        </Box>
                        <CopyToClipboard
                            text={`${APP_ROOT_URL}/conferences/${conferenceId}/submission/author`}
                            onCopy={copyClipBoardHandler}
                        >
                            <Tooltip title={isCopy ? 'Copied' : 'Click to copy'} placement="top">
                                <IconButton>{isCopy ? <CheckCircleOutline /> : <ContentCopy />}</IconButton>
                            </Tooltip>
                        </CopyToClipboard>
                    </Box>
                </Box>
                <Grid container columnSpacing={4}>
                    <Grid item md={2.5}>
                        <Box sx={{ bgcolor: 'background.paper' }}>
                            <List
                                component="nav"
                                sx={{
                                    borderRight: '0.5px solid rgba(0, 0, 0, 0.12)',
                                    py: 0,
                                    borderLeft: '0.5px solid rgba(0, 0, 0, 0.12)',
                                }}
                            >
                                {navbars.map((nav, index) => (
                                    <React.Fragment key={index}>
                                        <Divider />
                                        <Tooltip title={nav.href}>
                                            <ListItem
                                                onClick={() => handleExpandClick(index)}
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete">
                                                        {opens[index] ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                }
                                                disablePadding
                                            >
                                                <ListItemButton
                                                    selected={nav.href === selectNav.href}
                                                    onClick={() => handleSelecting(nav.href)}
                                                >
                                                    <ListItemIcon>
                                                        <Html />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        sx={{ fontSize: '14px !important' }}
                                                        primary={nav.parentLabel}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </Tooltip>
                                        <Collapse in={opens[index]} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {nav.childs.map((child, childIndex) => (
                                                    <React.Fragment key={childIndex}>
                                                        <ListItemButton
                                                            sx={{ pl: 4 }}
                                                            onClick={() => handleSelecting(child.href)}
                                                            selected={child.href === selectNav.href}
                                                        >
                                                            <ListItemIcon>
                                                                <Html />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                sx={{ fontSize: '14px !important' }}
                                                                primary={child.childLabel}
                                                            />
                                                        </ListItemButton>
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Collapse>
                                    </React.Fragment>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                    <Grid item md={9.5}>
                        <SunTextEditor
                            value={selectNav.content}
                            href={selectNav.href}
                            templateContent={templateHtml}
                            setWebPageContent={setWebPageContent}
                            webPageContent={webPageContent}
                            ref={ref}
                            navbars={navbars}
                            setSelectNav={setSelectNav}
                            sunEditorProps={sunEditorProps}
                        />
                    </Grid>
                </Grid>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                >
                    <Button
                        type="button"
                        onClick={() => {
                            setOpenGoBack(true)
                        }}
                        sx={{ textTransform: 'none', height: 36 }}
                    >
                        Back to Dashboard
                    </Button>
                    <Button type="button" onClick={previousHandler} sx={{ textTransform: 'none', height: 36, mx: 2 }}>
                        Previous
                    </Button>
                    <Button type="button" onClick={nextHandler} sx={{ textTransform: 'none', height: 36 }}>
                        Next
                    </Button>
                </Box>
            </React.Fragment>
        )
    }
)

export default EditWebsite
