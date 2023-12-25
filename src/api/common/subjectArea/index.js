import { get, post, remove } from '~/utils/ApiCaller'

const useSubjectArea = () => {
    const getSubjectAreas = (trackId, signal) =>
        get({
            endpoint: '/subject-areas',
            signal,
            params: {
                trackId: trackId,
            },
        })

    const updateSubjectArea = (id, subjectArea) => post({ endpoint: `/subject-areas/${id}`, body: subjectArea })

    const createSubjectArea = (subjectArea) => post({ endpoint: '/subject-areas', body: subjectArea })

    const reviewerSubjectArea = (subjectArea) => post({ endpoint: '/reviewer-subject-areas', body: subjectArea })

    const removeSubjectArea = (subjectAreaId) => remove({ endpoint: `/subject-areas/${subjectAreaId}` })

    return { getSubjectAreas, createSubjectArea, reviewerSubjectArea, updateSubjectArea, removeSubjectArea }
}

export { useSubjectArea }
