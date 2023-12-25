import { v4 as uuid } from 'uuid'

const callingForPapersPlaceHolder = [
    {
        placeHolderGroupId: uuid(),
        placeHolderGroupName: 'Conference',
        supportedPlaceholders: [
            {
                id: uuid(),
                encode: '{Conference.Name}',
                description: 'Name of the conference',
            },
            {
                id: uuid(),
                encode: '{Conference.ShortName}',
                description: 'Short name of the conference',
            },
        ],
    },
    {
        placeHolderGroupId: uuid(),
        placeHolderGroupName: 'Recipient',
        supportedPlaceholders: [
            {
                id: uuid(),
                encode: '{Recipient.FirstName}}',
                description: 'Recipient first name',
            },
            {
                id: uuid(),
                encode: '{Recipient.MiddleName}}',
                description: 'Recipient middle name',
            },
            {
                id: uuid(),
                encode: '{Recipient.LastName}',
                description: '{Recipient.LastName}',
            },
        ],
    },
]

export default callingForPapersPlaceHolder
