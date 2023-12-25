import { get, post, put } from '~/utils/ApiCaller'

const useWebsite = () => {
    const createWebsite = (conferenceId, templateId, navbar) =>
        put({ endpoint: `/website/${conferenceId}/${templateId}/update-navbar`, body: navbar })

    const saveFinalWebsite = (webId, content) =>
        post({ endpoint: `/website/save-final-website/${webId}`, body: content })

    const checkHasWebsite = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/has-website-yet`, signal })

    return { createWebsite, saveFinalWebsite, checkHasWebsite }
}

export default useWebsite
