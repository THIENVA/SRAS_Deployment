import { get } from '~/utils/ApiCaller'

const useQuestionGroup = () => {
    const getQuestionSubmission = (signal) => get({ endpoint: '/question-group/submission-question', signal })

    const getQuestionDecision = (signal) => get({ endpoint: '/question-group/decision-checklist', signal })

    const getQuestionCameraReady = (signal) => get({ endpoint: '/question-group/camera-ready-checklist', signal })

    return { getQuestionSubmission, getQuestionDecision, getQuestionCameraReady }
}

export default useQuestionGroup
