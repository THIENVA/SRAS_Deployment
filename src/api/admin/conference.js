import { get } from '~/utils/ApiCaller'

const useConference = () => {
    const getConferences = (signal) =>
        get({
            endpoint: '/conferences/ConferencesWithNavbarStatus',
            signal,
        })

    return { getConferences }
}

export default useConference
