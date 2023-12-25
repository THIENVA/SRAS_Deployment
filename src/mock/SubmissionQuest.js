const TYPE_OF_QUESTIONS = ['Agreement', 'Comment', 'Options']

const TYPE_OF_QUESTIONS_NOTE = ['Comment', 'Options']

const maxLength = [125, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000]

const options = [
    {
        name: 'List with single choice',
        value: 'radio',
        multiple: false,
    },
    {
        name: 'List with multiple choice',
        value: 'checkbox',
        multiple: true,
    },
    {
        name: 'Drop down list with single choice',
        value: 'select',
        multiple: false,
    },
    {
        name: 'Drop down list with multiple choice',
        value: 'selectMultiple',
        multiple: true,
    },
]

export { TYPE_OF_QUESTIONS, TYPE_OF_QUESTIONS_NOTE, maxLength, options }
