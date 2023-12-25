import { get, put } from '~/utils/ApiCaller'

const useNavbar = () => {
    const updateNavbar = (conferenceId, templateId, navbar) =>
        put({ endpoint: `/website/${conferenceId}/${templateId}/update-navbar`, body: navbar })

    const getNavbar = (conference, signal) => get({ endpoint: `/website/get-navbar/${conference}`, signal })

    return { updateNavbar, getNavbar }
}

export default useNavbar
