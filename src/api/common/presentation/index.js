import { post } from '~/utils/ApiCaller'

const usePresentation = () => {
    const createPresentationFiles = (submissionId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${submissionId}/presentation-files`,
            body: files,
        })

    return { createPresentationFiles }
}

export default usePresentation
