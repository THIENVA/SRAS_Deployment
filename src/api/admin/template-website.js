import { get, post } from '~/utils/ApiCaller'

const useTemplateWebsite = () => {
    // const getTemplatesInfo = (hasContent, signal) => get({ endpoint: `/web-templates/${hasContent}`, signal })

    // const downloadSpecificFile = (templateId) => get({ endpoint: `/web-templates/${templateId}/download-one-template` })

    // const uploadTemplate = (name, description, file) =>
    //     post({
    // headers: {
    //     'Content-Type': 'multipart/form-data',
    // },
    //         endpoint: `/web-templates/web-template-files`,
    //         params: {
    //             name,
    //             description,
    //         },
    //         body: file,
    //     })

    // const getTemplateFiles = (signal) => get({ endpoint: '/web-templates/templateFileInfos', signal })

    const getContent = (conferenceId, signal) =>
        get({ endpoint: `/website/get-content-temp-file/${conferenceId}`, signal })

    // const addContentToWebsite = (fileName, conferenceId, content) =>
    //     post({
    //         endpoint: `/website/add-content-of-website/${conferenceId}/${fileName}`,
    //         body: content,
    //     })

    const getTemplates = (websiteId, signal) =>
        get({
            endpoint: '/web-templates',
            params: {
                websiteId,
            },
            signal,
        })

    const createNewTemplate = (name, description, navbar) =>
        post({
            endpoint: '/web-templates/create-template',
            params: {
                name,
                description,
            },
            body: navbar,
        })

    const uploadNewTemplate = (file) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/web-templates/upload-new-original-template`,
            body: file,
        })

    return {
        // getTemplatesInfo,
        // downloadSpecificFile,
        // uploadTemplate,
        // getTemplateFiles,
        // addContentToWebsite,
        getContent,
        getTemplates,
        createNewTemplate,
        uploadNewTemplate,
    }
}

export default useTemplateWebsite
