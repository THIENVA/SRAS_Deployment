import { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import { Box, FormControl, MenuItem, Select, TextField } from '@mui/material'
import InputField from '~/components/InputField'
import ModalInfo from '~/components/ModalInfo'
import SupportPlaceholder from '~/components/SupportPlaceholder'

import { AppStyles } from '~/constants/colors'

const UpdateTemplateModal = ({ open, handleClose, templateData, updateTemplate }) => {
    const cloneUpdateTemplate = cloneDeep(templateData)
    const [loading, setLoading] = useState(false)
    const [templateField, setTemplateField] = useState({
        id: '',
        name: '',
        subject: '',
        body: '',
    })
    const handleSubmit = () => {
        setLoading(true)
        const newObject = {
            templateId: templateField.id,
            templateName: templateField.name,
            subject: templateField.subject,
            body: templateField.body,
        }

        updateTemplate(newObject, handleClose, setLoading)
    }
    const [templateIdChoose, setChooseTemplate] = useState(cloneUpdateTemplate[0].templateId)

    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTemplateField((prev) => ({ ...prev, [name]: value }))
    }
    const handleChooseTemplate = (event) => {
        setChooseTemplate(event.target.value)
        const chosenTemplate = cloneUpdateTemplate.find((item) => item.templateId === event.target.value)
        templateField.id = chosenTemplate.templateId
        templateField.name = chosenTemplate.templateName
        templateField.subject = chosenTemplate.subject
        templateField.body = chosenTemplate.body
    }

    useEffect(() => {
        const { templateId: id, templateName: name, subject, body } = cloneUpdateTemplate[0]
        setTemplateField({ id, name, subject, body })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Edit Template'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="md"
            handleSubmit={handleSubmit}
            enableActions={true}
            submitBtnName="Update Template"
            loading={loading}
        >
            <Box>
                <InputField
                    text="Template"
                    textStyle={{ fontSize: 18 }}
                    boxStyle={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}
                    textBoxStyle={{ width: 120 }}
                >
                    <Box minWidth={600}>
                        <FormControl fullWidth>
                            <Select size="small" value={templateIdChoose} onChange={handleChooseTemplate}>
                                {templateData.map((option) => (
                                    <MenuItem key={option.templateId} value={option.templateId}>
                                        {option.templateName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </InputField>
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

export default UpdateTemplateModal
