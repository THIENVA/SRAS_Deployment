import { get, post } from '~/utils/ApiCaller'

const useSysDate = () => {
    const changeTime = (time) => post({ endpoint: '/time/now', params: { now: time } })

    const getSysTime = (signal) =>
        get({
            endpoint: '/time/now',
            signal,
        })

    const resetTime = () =>
        post({
            endpoint: '/time/now/reset',
        })

    const getTrackPlan = (trackId, signal) =>
        get({
            endpoint: `/demos/activity-timelines`,
            params: {
                trackId: trackId,
            },
            signal,
        })

    return { changeTime, getSysTime, resetTime, getTrackPlan }
}

export { useSysDate }
