import { get, patch } from '~/utils/ApiCaller'

const useChairNote = () => {
    const getChairNote = (submissionId, signal) =>
        get({ endpoint: `/submissions/get-chair-note/${submissionId}`, signal })

    const updateChairNote = (chairNote) => patch({ endpoint: '/submissions/update-chair-note', body: chairNote })

    return { getChairNote, updateChairNote }
}

export default useChairNote
