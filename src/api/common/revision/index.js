import { post, put, remove } from '~/utils/ApiCaller'

const useRevision = () => {
    const uploadRevision = (submissionId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${submissionId}/revisions`,
            body: files,
        })

    const updateRevision = (submissionId, files) =>
        put({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${submissionId}/revisions`,
            body: files,
        })

    const removeRevision = (submissionId) =>
        remove({
            endpoint: `/submissions/${submissionId}/revisions`,
        })

    return { uploadRevision, updateRevision, removeRevision }
}

export default useRevision
