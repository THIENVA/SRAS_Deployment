const defaultFonts = [
    'Arial',
    'Comic Sans MS',
    'Courier New',
    'Impact',
    'Georgia',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
    // 'Sans-Serif',
]
const sortedFontOptions = [
    // 'Logical',
    // 'Salesforce Sans',
    // 'Garamond',
    // 'Serif',
    // 'Times New Roman',
    // 'Helvetica',
    ...defaultFonts,
].sort()

const sunEditorOption = {
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
                ['-right', ':r-More Rich-default.more_plus', 'table', 'horizontalRule', 'link', 'image', 'video'],
            ],
        ],
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
                [':e-More Line-default.more_horizontal', 'align', 'horizontalRule', 'list', 'lineHeight'],
                [':r-More Rich-default.more_plus', 'table', 'link', 'image', 'video'],
                ['-right', ':i-More Misc-default.more_vertical', 'showBlocks', 'codeView', 'preview'],
            ],
        ],
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
}

export default sunEditorOption
