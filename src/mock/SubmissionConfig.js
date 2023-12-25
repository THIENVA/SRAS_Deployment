import { v4 as uuid } from 'uuid'

const abstract = [
    {
        name: 'Maximum number of characters for abstract',
        type: 'select',
        values: [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
        value: 5000,
        disable: false,
        id: uuid(),
    },
]

const submissionFile = [
    {
        name: 'Maximum number of file/s allowed',
        type: 'select',
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 3,
        required: false,
        id: uuid(),
    },
    {
        name: 'Minimum number of file/s required',
        type: 'select',
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 1,
        required: false,
        id: uuid(),
        multiple: false,
    },
    {
        name: 'File formats (comma separated)',
        type: 'select',
        values: ['doc', 'docx', 'pdf'],
        value: ['doc', 'docx'],
        required: true,
        id: uuid(),
        multiple: true,
    },
    {
        name: 'Maximum file size not exceed (MB)',
        type: 'select',
        values: [1, 3, 5, 10, 20, 50, 100],
        value: 10,
        required: false,
        id: uuid(),
        multiple: false,
    },
]

const cameraReadyFile = [
    {
        name: 'Maximum number of file/s allowed',
        type: 'select',
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 3,
        required: false,
        id: uuid(),
    },
    {
        name: 'Minimum number of file/s required',
        type: 'select',
        values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 1,
        required: false,
        id: uuid(),
        multiple: false,
    },
    {
        name: 'Maximum file size not exceed (MB)',
        type: 'select',
        values: [1, 3, 5, 10, 20, 50, 100],
        value: 10,
        required: false,
        id: uuid(),
        multiple: false,
    },
]

const copyRightFile = [
    {
        name: 'File formats (comma separated)',
        type: 'select',
        values: ['doc', 'docx', 'pdf'],
        value: ['doc', 'docx'],
        required: true,
        id: uuid(),
        multiple: true,
    },
    {
        name: 'Maximum file size not exceed (MB)',
        type: 'select',
        values: [1, 3, 5, 10, 20, 50, 100],
        value: 10,
        required: false,
        id: uuid(),
        multiple: false,
    },
]

const supplementaryMaterial = [
    {
        name: 'Allow submission of supplementary material',
        type: 'checkbox',
        nameCheckbox: '',
        value: true,
        id: uuid(),
    },
    {
        name: 'Maximum number of file/s allowed',
        type: 'select',
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 3,
        disable: false,
        required: false,
        id: uuid(),
    },
    {
        name: 'Minimum number of file/s required',
        type: 'select',
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 1,
        required: false,
        disable: false,
        id: uuid(),
        multiple: false,
    },
    {
        name: 'Maximum file size not exceed (MB)',
        type: 'select',
        values: [1, 3, 5, 10, 20, 50, 100],
        value: 10,
        disable: false,
        required: false,
        id: uuid(),
        multiple: false,
    },
]

const revisionFile = [
    {
        name: 'File formats (comma separated)',
        type: 'select',
        values: ['doc', 'docx', 'pdf'],
        value: ['doc', 'docx'],
        disable: false,
        required: true,
        id: uuid(),
        multiple: true,
    },
    {
        name: 'Maximum number of file/s allowed',
        type: 'select',
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 3,
        disable: false,
        required: false,
        id: uuid(),
    },
    {
        name: 'Minimum number of file/s required',
        type: 'select',
        values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        value: 1,
        required: false,
        disable: false,
        id: uuid(),
        multiple: false,
    },
    {
        name: 'Maximum file size not exceed (MB)',
        type: 'select',
        values: [1, 3, 5, 10, 20, 50, 100],
        value: 10,
        disable: false,
        required: false,
        id: uuid(),
        multiple: false,
    },
]

const presentationFile = [
    {
        name: 'File formats (comma separated)',
        type: 'select',
        values: ['pdf', 'ppt', 'pptx'],
        value: ['pdf', 'pptx'],
        required: true,
        id: uuid(),
        multiple: true,
    },
    {
        name: 'Maximum file size not exceed (MB)',
        type: 'select',
        values: [1, 3, 5, 10, 20, 50, 100],
        value: 10,
        required: false,
        id: uuid(),
        multiple: false,
    },
]

const other = [
    {
        name: 'Allow only primary contact author to delete paper',
        type: 'checkbox',
        nameCheckbox: '',
        value: true,
        id: uuid(),
    },
    // {
    //     name: 'Do not allow editing authors',
    //     type: 'checkbox',
    //     nameCheckbox: '',
    //     value: true,
    //     id: uuid(),
    // },
    // {
    //     name: 'Do not allow editing submission files',
    //     type: 'checkbox',
    //     nameCheckbox: '',
    //     value: true,
    //     id: uuid(),
    // },
    // {
    //     name: 'Show submission questions in chair console',
    //     type: 'checkbox',
    //     nameCheckbox: '',
    //     value: true,
    //     id: uuid(),
    // },
    // {
    //     name: 'how welcome instruction on both author console and submission form',
    //     type: 'checkbox',
    //     nameCheckbox: '',
    //     value: true,
    //     id: uuid(),
    // },
]

const instruction = `Greetings to all participants,
Join us on an exhilarating journey at the upcoming conference! Your pioneering research and insightful contributions play a crucial role in fostering a lively exchange of knowledge. Embrace this opportunity to be a vital part of an engaging intellectual gathering.
Anticipating your active involvement,
The Conference Team`

export {
    abstract,
    cameraReadyFile,
    copyRightFile,
    instruction,
    other,
    presentationFile,
    revisionFile,
    submissionFile,
    supplementaryMaterial,
}
