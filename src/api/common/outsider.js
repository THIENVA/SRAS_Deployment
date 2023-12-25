const { post, put, get } = require('~/utils/ApiCaller')

const useOutsider = () => {
    const searchParticipantByEmail = (email) => get({ endpoint: `/outsiders/searchParticipantByEmail/${email}` })
    const createOutsider = (info) => post({ endpoint: '/outsiders', body: info })
    const updateOutsider = (info) => put({ endpoint: '/outsiders', body: info })
    return { createOutsider, updateOutsider, searchParticipantByEmail }
}

export { useOutsider }
