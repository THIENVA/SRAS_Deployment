import { useState } from 'react'

import SunEditor from 'suneditor-react'

import { Box } from '@mui/material'

import 'suneditor/dist/css/suneditor.min.css'

const defaultFonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Impact', 'Georgia', 'Tahoma', 'Trebuchet MS', 'Verdana']
const SunTextEditor = () => {
    const [value, setValue] = useState('')
    const sortedFontOptions = [
        'Logical',
        'Salesforce Sans',
        'Garamond',
        'Sans-Serif',
        'Serif',
        'Times New Roman',
        'Helvetica',
        ...defaultFonts,
    ].sort()

    const handleImageUploadBefore = (files, _, __, uploadHandler) => {
        const response = {
            result: [
                {
                    url: `https://firebasestorage.googleapis.com/v0/b/react-native-course-41a03.appspot.com/o/Section.jpg?alt=media&token=3da717f2-a87e-4cc4-b043-983fa32ba167`,
                    name: files[0].name,
                    size: files[0].size,
                },
            ],
        }
        uploadHandler(response)
    }

    return (
        <Box maxWidth="xl" m="0 auto">
            <SunEditor
                onImageUploadBefore={handleImageUploadBefore}
                setContents={value}
                onChange={setValue}
                setOptions={{
                    stickyToolbar: true,
                    mode: 'classic',
                    paragraphStyles: ['spaced', 'bordered'],
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                        ['fontColor', 'hiliteColor'],
                        ['align', 'list', 'lineHeight'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['table', 'horizontalRule', 'link', 'image', 'video'],
                        ['preview', 'codeView', 'showBlocks'],
                        [
                            '%992',
                            [
                                ['undo', 'redo'],
                                [
                                    ':p-More Paragraph-default.more_paragraph',
                                    'font',
                                    'fontSize',
                                    'formatBlock',
                                    'paragraphStyle',
                                    'blockquote',
                                ],
                                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                                [':t-More Text-default.more_text', 'fontColor', 'hiliteColor'],
                                ['removeFormat'],
                                ['outdent', 'indent'],
                                ['align', 'list', 'lineHeight'],
                                ['-right', ':i-More Misc-default.more_vertical', 'showBlocks', 'codeView', 'preview'],
                                [
                                    '-right',
                                    ':r-More Rich-default.more_plus',
                                    'table',
                                    'horizontalRule',
                                    'link',
                                    'image',
                                    'video',
                                ],
                            ],
                        ],
                        // (min-width: 767)
                        [
                            '%767',
                            [
                                ['undo', 'redo'],
                                [
                                    ':p-More Paragraph-default.more_paragraph',
                                    'font',
                                    'fontSize',
                                    'formatBlock',
                                    'paragraphStyle',
                                    'blockquote',
                                ],
                                [
                                    ':t-More Text-default.more_text',
                                    'bold',
                                    'underline',
                                    'italic',
                                    'strike',
                                    'subscript',
                                    'superscript',
                                    'fontColor',
                                    'hiliteColor',
                                ],
                                ['removeFormat'],
                                ['outdent', 'indent'],
                                [
                                    ':e-More Line-default.more_horizontal',
                                    'align',
                                    'horizontalRule',
                                    'list',
                                    'lineHeight',
                                ],
                                [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video'],
                                ['-right', ':i-More Misc-default.more_vertical', 'showBlocks', 'codeView', 'preview'],
                            ],
                        ],
                        // (min-width: 480)
                        [
                            '%480',
                            [
                                ['undo', 'redo'],
                                [
                                    ':p-More Paragraph-default.more_paragraph',
                                    'font',
                                    'fontSize',
                                    'formatBlock',
                                    'paragraphStyle',
                                    'blockquote',
                                ],
                                [
                                    ':t-More Text-default.more_text',
                                    'bold',
                                    'underline',
                                    'italic',
                                    'strike',
                                    'subscript',
                                    'superscript',
                                    'fontColor',
                                    'hiliteColor',
                                    'removeFormat',
                                ],
                                [
                                    ':e-More Line-default.more_horizontal',
                                    'outdent',
                                    'indent',
                                    'align',
                                    'horizontalRule',
                                    'list',
                                    'lineHeight',
                                ],
                                [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video'],
                                ['-right', ':i-More Misc-default.more_vertical', 'showBlocks', 'codeView', 'preview'],
                            ],
                        ],
                    ],
                    defaultTag: 'div',
                    minHeight: '700px',
                    showPathLabel: false,
                    font: sortedFontOptions,
                }}
            />
            <hr />
            {/* <textarea
                disabled
                value={JSON.stringify(value, null, 2)}
                style={{ width: '100%', resize: 'none', height: '600px' }}
            >
                {value}
            </textarea> */}
            <pre style={{ maxWidth: 100, resize: 'none', height: '600px' }}>
                <code>{value}</code>
            </pre>
        </Box>
    )
}

export default SunTextEditor
