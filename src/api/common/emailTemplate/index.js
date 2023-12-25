import { get, patch, post, put } from '~/utils/ApiCaller'

const useEmailTemplate = () => {
    const getEmailTemplates = (conferenceId, signal, trackId = null) =>
        get({
            endpoint: `/email-templates/conference/${conferenceId}/${trackId}`,
            signal,
        })

    const getPlaceHolder = (signal) => get({ endpoint: '/place-holder-groups', signal })

    const createTemplate = (template) => post({ endpoint: '/email-templates', body: template })

    const editTemplate = (template) => put({ endpoint: '/email-templates', body: template })

    const sendEmail = (template) => post({ endpoint: `/emails/send-email-each-status-in-submission`, body: template })

    const getCallPaperTemplate = (conferenceId, signal) =>
        get({
            endpoint: `/email-templates/get-email-template-call-for-paper`,
            params: {
                conferenceId,
            },
            signal,
        })

    const getCreateCameraReadyTemplate = (conferenceId, signal) =>
        get({
            endpoint: `/email-templates/get-email-template-request-camera-ready`,
            params: {
                conferenceId,
            },
            signal,
        })

    const updateCallPaperTemplate = (templateId, body, subject) =>
        patch({
            endpoint: '/email-templates/edit-email-template-call-for-paper',
            body: {
                templateId,
                body,
                subject,
            },
        })

    const updateCameraTemplate = (templateId, body, subject) =>
        patch({
            endpoint: '/email-templates/edit-email-template-request-camera-ready',
            body: {
                templateId,
                body,
                subject,
            },
        })

    const sendAllNewMember = (data) => post({ endpoint: '/emails/send-invite-for-all-new-member', body: data })

    return {
        getEmailTemplates,
        getPlaceHolder,
        createTemplate,
        editTemplate,
        sendEmail,
        getCallPaperTemplate,
        getCreateCameraReadyTemplate,
        updateCallPaperTemplate,
        updateCameraTemplate,
        sendAllNewMember,
    }
}

export default useEmailTemplate
