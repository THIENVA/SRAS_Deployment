import { get, post } from '~/utils/ApiCaller'

const usePaperStatus = () => {
    const createPaperStatus = (paperStatus) => post({ endpoint: '/paper-statuses', body: paperStatus })

    const getPaperStatuses = (conferenceId, signal) =>
        get({
            endpoint: '/paper-statuses',
            params: {
                conferenceId,
            },
            signal,
        })

    return { createPaperStatus, getPaperStatuses }
}

export default usePaperStatus
