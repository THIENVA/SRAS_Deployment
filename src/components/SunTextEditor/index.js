import React, { forwardRef, useEffect, useRef, useState } from 'react'

import { getDownloadURL, ref as getStorageRef, uploadBytesResumable } from 'firebase/storage'
import parse from 'html-react-parser'
import { cloneDeep } from 'lodash'
import ReactDOMServer from 'react-dom/server'
import SunEditor from 'suneditor-react'
import { v4 as uuid } from 'uuid'

import { Box, Button } from '@mui/material'

import 'suneditor/dist/css/suneditor.min.css'
import { useSnackbar } from '~/HOCs/SnackbarContext'
import { storage } from '~/utils/Firebase'
import { buildNavBarsPreview } from '~/utils/commonFunction'

const SunTextEditor = forwardRef(
    ({ value = '', href = '', templateContent, setWebPageContent, webPageContent, navbars, sunEditorProps }, ref) => {
        const [content, setContent] = useState(value)
        const prevContent = useRef('')
        const showSnackbar = useSnackbar()
        const currentHref = useRef('')

        const handlePreviewPage = () => {
            const openNewWindow = window.open('', '_blank')
            const { header, content: fullContent } = templateContent
            const navbarHtml = buildNavBarsPreview(navbars)
            const templateWithContent = fullContent
                .replace('{header}', header)
                .replace('{nav}', navbarHtml)
                .replace('{content}', content)
            const htmlDom = parse(templateWithContent)
            openNewWindow.document.write(ReactDOMServer.renderToStaticMarkup(htmlDom))
        }

        const handleImageUploadBefore = (files, _, __, uploadHandler) => {
            const file = files

            let fileType = file[0].type.replace('image/', '')
            const storageRef = getStorageRef(storage, `images/${file[0].name + uuid()}.${fileType}`)
            const uploadTask = uploadBytesResumable(storageRef, file[0])

            uploadTask.on(
                'state_changed',
                () => {},
                () => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, cannot upload event poster.',
                    })
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const response = {
                            result: [
                                {
                                    url: downloadURL,
                                    name: file[0].name,
                                    size: file[0].size,
                                },
                            ],
                        }
                        uploadHandler(response)
                    })
                }
            )
        }

        useEffect(() => {
            setContent(value)
            if (href !== '') {
                const selectedFile = webPageContent.find((item) => item.fileName === href)
                const index = webPageContent.findIndex((item) => item.fileName === currentHref.current)
                if (!selectedFile) {
                    const updatedWebContent = cloneDeep(webPageContent)
                    if (index !== -1) {
                        updatedWebContent[index].content = prevContent.current
                    }
                    setWebPageContent(updatedWebContent)
                } else {
                    const index = webPageContent.findIndex((item) => item.fileName === currentHref.current)
                    if (index !== -1) {
                        const updatedWebContent = cloneDeep(webPageContent)
                        updatedWebContent[index].content = prevContent.current
                        setWebPageContent(updatedWebContent)
                    }
                }
            }
            currentHref.current = href
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [href])

        return (
            <React.Fragment>
                <SunEditor
                    onImageUploadBefore={handleImageUploadBefore}
                    setContents={content}
                    onChange={(value) => {
                        ref.current = value
                        prevContent.current = value
                        setContent(value)
                    }}
                    setOptions={{
                        ...sunEditorProps,
                    }}
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                        onClick={handlePreviewPage}
                        type="button"
                        variant="outlined"
                        disabled={!href}
                        sx={{ textTransform: 'none', height: 36 }}
                        color="info"
                    >
                        Preview
                    </Button>
                </Box>
            </React.Fragment>
        )
    }
)

export default SunTextEditor
