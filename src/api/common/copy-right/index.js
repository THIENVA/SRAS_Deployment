import { post } from '~/utils/ApiCaller'

const useCopyRight = () => {
    const createCopyRightFiles = (submissionId, file) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${submissionId}/copy-right-file`,
            body: file,
        })

    return { createCopyRightFiles }
}

export default useCopyRight
