import { useState } from 'react'

import { useParams } from 'react-router-dom'

import { Box, TextField } from '@mui/material'
import InputField from '~/components/InputField'
import ModalInfo from '~/components/ModalInfo'
import SupportPlaceholder from '~/components/SupportPlaceholder'

import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const CreateTemplateModal = ({ open, handleClose, createNewTemplate }) => {
    const [loading, setLoading] = useState(false)
    const {
        trackConference: { trackId },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId } = useParams()
    const [templateField, setTemplateField] = useState({
        name: '',
        subject: '',
        body: '',
    })

    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTemplateField((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = () => {
        setLoading(true)
        const id = roleName === ROLES_NAME.CHAIR ? null : trackId
        const newObject = {
            templateName: templateField.name,
            subject: templateField.subject,
            body: templateField.body,
            conferenceId,
            trackId: id,
        }

        createNewTemplate(newObject, handleClose, setLoading)
    }

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Create New Template'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="md"
            handleSubmit={handleSubmit}
            enableActions={true}
            submitBtnName="Create Template"
            loading={loading}
        >
            <Box>
                <InputField
                    text="Name"
                    isRequire={true}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}
                    textBoxStyle={{ width: 120 }}
                >
                    <Box minWidth={600}>
                        <TextField
                            fullWidth={true}
                            placeholder="Name"
                            variant="outlined"
                            value={templateField.name}
                            name="name"
                            onChange={handleTextChange}
                            size="small"
                        />
                    </Box>
                </InputField>
                <InputField
                    text="Subject"
                    isRequire={true}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}
                    textBoxStyle={{ width: 120 }}
                >
                    <Box minWidth={600}>
                        <TextField
                            fullWidth={true}
                            placeholder="Subject"
                            variant="outlined"
                            value={templateField.subject}
                            name="subject"
                            onChange={handleTextChange}
                            size="small"
                        />
                    </Box>
                </InputField>
                <InputField
                    text="Body"
                    isRequire={true}
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', justifyContent: 'center' }}
                    textBoxStyle={{ width: 120 }}
                >
                    <Box minWidth={600}>
                        <TextField
                            fullWidth={true}
                            variant="outlined"
                            value={templateField.body}
                            name="body"
                            onChange={handleTextChange}
                            size="small"
                            multiline
                            rows={8}
                        />
                    </Box>
                </InputField>
                <Box mt={3}>
                    <SupportPlaceholder />
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default CreateTemplateModal
