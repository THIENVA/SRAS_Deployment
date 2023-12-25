import { get } from '~/utils/ApiCaller'

const useConferenceRole = () => {
    const getAllRoles = (signal) => get({ endpoint: '/conference-roles', signal })

    return { getAllRoles }
}

export { useConferenceRole }
