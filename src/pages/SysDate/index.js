import { Fragment, useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import moment from 'moment'
import { v4 as uuid } from 'uuid'

import { Box, Grid, Skeleton, Typography } from '@mui/material'
import EmptyData from '~/components/EmptyData'

import Loading from '../Loading'
import HeaderSysDate from './HeaderSysDate'
import ScriptExecute from './ScriptExecute'
import TimeTable from './TimeTable'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useConference } from '~/api/common/conference'
import useScriptV2 from '~/api/common/script/userScriptV2'
import { useSysDate } from '~/api/common/sysdate'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'

const scriptAmount = [
    {
        title: '17',
        value: '17',
    },
    {
        title: '29',
        value: '29',
    },
    {
        title: '59',
        value: '59',
    },
]

const reviewerAccount = [
    {
        title: '16',
        value: '16',
    },
    {
        title: '27',
        value: '27',
    },
    {
        title: '57',
        value: '57',
    },
]

const subjectAreaAmount = [
    {
        title: '5',
        value: '5',
    },
    {
        title: '10',
        value: '10',
    },
    {
        title: '14',
        value: '14',
    },
]

const submissionQuestionAmount = [
    {
        title: '2',
        value: '2',
    },
    {
        title: '3',
        value: '3',
    },
    {
        title: '4',
        value: '4',
    },
    {
        title: '5',
        value: '5',
    },
]

const SysDate = () => {
    const showSnackbar = useSnackbar()
    const { getConferences } = useConference()
    const { getAllTrack } = useTrack()
    const { changeTime, getSysTime, resetTime, getTrackPlan } = useSysDate()
    const {
        programCommittees,
        subjectAreaScript,
        reviewersScript,
        deskReject,
        conferenceSubmission,
        conference1stReviewAssign,
        conference1stReview,
        conference1stDecision,
        // conference1stRevisionSubmission,
        // conference2ndReview,
        // conference2ndDecision,
        conferenceCameraReady,
        conferenceRegistration,
        conferencePresentation,
        scriptCreateTemplate,
        scriptCreateSubmissionQuestion,
        scriptDeployWebsite,
    } = useScriptV2()
    const [value, setValue] = useState(new Date())
    const [conferences, setConferences] = useState([])
    const [conference, setConference] = useState('')
    const [tracks, setTracks] = useState([])
    const [track, setTrack] = useState('')
    const [loading, setIsLoading] = useState(true)
    const [tableLoading, setTableLoading] = useState(false)
    const [executeMessage, setExecuteMessage] = useState(
        Array.from({ length: 14 }, () => ({
            message: [],
            conclusion: '',
            disable: false,
            loading: false,
            isSuccess: true,
        }))
    )
    const [trackPlan, setTrackPlan] = useState([])
    const [timeLoading, setTimeLoading] = useState({ update: false, reset: false })
    const [scriptLoading, setScriptLoading] = useState(-1)
    const [minDate, setMinDate] = useState(value)
    const shouldLoading = useRef(true)
    const [unique, setUnique] = useState(uuid())
    const [secondUnique, setSecondUnique] = useState(uuid())
    const [values, setValues] = useState(Array.from({ length: 14 }, () => ''))
    const [consoleMessages, setConsoleMessages] = useState(
        Array.from({ length: 14 }, () => ({ message: '', isShown: false }))
    )

    const [getMessage, setGetMessage] = useState([])
    const [currentIndex, setCurrentIndex] = useState({ scriptIndex: -1, messageIndex: -1 })
    const [successMessage, setSuccessMessage] = useState('')
    const [scriptDemos, _] = useState([
        {
            header: '0 Deploy Website',
            scriptFunction: scriptDeployWebsite,
            isAmount: false,
            value: '',
        },
        {
            header: '1. Conference Program Committees Allocation',
            scriptFunction: programCommittees,
            isAmount: false,
            value: '',
        },
        {
            header: '2. Conference Subject Areas Allocation ¹',
            scriptFunction: subjectAreaScript,
            isAmount: true,
            value: '5',
        },
        {
            header: '3. Conference Submission Question Allocation ¹',
            scriptFunction: scriptCreateSubmissionQuestion,
            isAmount: true,
            value: '',
        },
        {
            header: '4. Conference Submissions Allocation ²',
            scriptFunction: conferenceSubmission,
            isAmount: true,
            value: '30',
        },
        {
            header: '5. Conference Reviewers Allocation ¹',
            scriptFunction: reviewersScript,
            isAmount: true,
            value: '30',
        },
        {
            header: '6. Conference Desk Rejection Allocation ²',
            scriptFunction: deskReject,
            isAmount: false,
            value: '',
        },
        {
            header: '7. Conference 1st Review Assignment Allocation ²',
            scriptFunction: conference1stReviewAssign,
            isAmount: true,
            value: '',
        },
        {
            header: '8. Conference 1st Review Allocation ³',
            scriptFunction: conference1stReview,
            isAmount: true,
            value: '',
        },
        {
            header: '9. Conference 1st Decision Allocation ³',
            scriptFunction: conference1stDecision,
            isAmount: true,
            value: '',
        },
        {
            header: '10 Conference Email Templates Allocation ³',
            scriptFunction: scriptCreateTemplate,
            isAmount: false,
            value: '',
        },
        // {
        //     header: '10. Conference 1st Revision Submission Allocation ⁴',
        //     scriptFunction: conference1stRevisionSubmission,
        //     isAmount: true,
        //     value: '',
        // },
        // {
        //     header: '11. Conference 2nd Review Allocation ⁵',
        //     scriptFunction: conference2ndReview,
        //     isAmount: true,
        //     value: '',
        // },
        // {
        //     header: '12. Conference 2nd Decision Allocation ⁵',
        //     scriptFunction: conference2ndDecision,
        //     isAmount: true,
        //     value: '',
        // },
        {
            header: '11. Conference Camera Ready Allocation ⁶',
            scriptFunction: conferenceCameraReady,
            isAmount: false,
            value: '',
        },
        {
            header: '12. Conference Registration Allocation ⁶',
            scriptFunction: conferenceRegistration,
            isAmount: false,
            value: '',
        },
        {
            header: '13. Conference Presentation Allocation ⁷',
            scriptFunction: conferencePresentation,
            isAmount: false,
            value: '',
        },
    ])

    const handleChange = (newValue) => {
        const formatDate = moment(newValue).format()
        const date = formatDate.substring(0, 19)

        setValue(date.toUpperCase() === 'INVALID DATE' ? null : date)
    }

    const handleResetTime = () => {
        setTimeLoading((prev) => ({ ...prev, reset: true }))
        resetTime()
            .then((res) => {
                setValue(res.data)
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Time Has Been Reset to ' + moment(res.data).format('DD/MM/YYYY, h:mm A'),
                // })
            })
            .catch((err) => {
                const error = err.response.data.error.code
                    ? err.response.data.error.code
                    : 'Something went wrong, please try again later'
                showSnackbar({
                    severity: 'error',
                    children: `${error}`,
                })
            })
            .finally(() => {
                setTimeLoading((prev) => ({ ...prev, reset: false }))
            })
    }

    const handleSyncData = () => {
        setSecondUnique(uuid())
    }

    const handleConferenceChange = (event) => {
        setConference(event.target.value)
    }

    const handleTrackChange = (event) => {
        setTrack(event.target.value)
        setTrackPlan([])
        shouldLoading.current = true
    }

    const handleUpdateTime = () => {
        setTimeLoading((prev) => ({ ...prev, update: true }))
        const formattedTimestamp = value.slice(0, 17) + '00'
        changeTime(formattedTimestamp)
            .then((res) => {
                setValue(res.data)
                setUnique(uuid())
                setMinDate(res.data)
                setTableLoading(true)
                showSnackbar({
                    severity: 'success',
                    children: 'Time Has Been Update to ' + moment(value).format('DD/MM/YYYY, h:mm A'),
                })
            })
            .catch((err) => {
                const error = err.response.data.error.code
                    ? err.response.data.error.code
                    : 'Something went wrong, please try again later'
                showSnackbar({
                    severity: 'error',
                    children: `${error}`,
                })
            })
            .finally(() => {
                setTimeLoading((prev) => ({ ...prev, update: false }))
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()

        const getSysDate = getSysTime(controller.signal)
        const getConferenceSysDate = getConferences(null, secondController.signal, 0, 100)

        Promise.all([getConferenceSysDate, getSysDate])
            .then((response) => {
                const conference = response[0].data.items
                const sysDate = response[1].data
                setConferences(conference)
                setValue(sysDate)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please try again later',
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [secondUnique])

    useEffect(() => {
        const controller = new AbortController()
        if (conference) {
            getAllTrack(conference, controller.signal).then((response) => {
                const tracks = response.data.tracks
                setTracks(tracks)
                setTrack('')
                setExecuteMessage(
                    Array.from({ length: 17 }, () => ({ message: '', disable: false, loading: false, isSuccess: true }))
                )
            })
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conference])

    useEffect(() => {
        const controller = new AbortController()
        setTableLoading(true)
        if (track) {
            if (shouldLoading.current) setTableLoading(true)
            const trackPlanSysDate = getTrackPlan(track, controller.signal)
            Promise.all([trackPlanSysDate])
                .then((response) => {
                    const trackInfo = response[0].data
                    setTrackPlan(trackInfo)
                    setTableLoading(false)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, please try again later',
                    })
                })
                .finally(() => {
                    setTableLoading(false)
                    shouldLoading.current = false
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [track, unique])

    useEffect(() => {
        let timeout = -1
        if (getMessage.length > 0) {
            timeout = setTimeout(() => {
                if (currentIndex.messageIndex !== -1 && currentIndex.messageIndex < getMessage.length) {
                    const updatedConsoleMessage = cloneDeep(consoleMessages)
                    updatedConsoleMessage[currentIndex.scriptIndex].message += `${currentIndex.messageIndex + 1}. ${
                        getMessage[currentIndex.messageIndex]
                    }\n`
                    updatedConsoleMessage[currentIndex.scriptIndex].isShown = true
                    setConsoleMessages(updatedConsoleMessage)
                    setCurrentIndex((prev) => ({ ...prev, messageIndex: prev.messageIndex + 1 }))
                } else if (currentIndex.messageIndex !== -1 && currentIndex.messageIndex >= getMessage.length) {
                    if (successMessage) {
                        const updatedExecuteMessage = cloneDeep(executeMessage)
                        updatedExecuteMessage[currentIndex.scriptIndex].message = successMessage
                        setExecuteMessage(updatedExecuteMessage)
                    }
                }
            }, 5)
        } else {
            setCurrentIndex({ scriptIndex: -1, messageIndex: -1 })
        }

        return () => clearTimeout(timeout)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentIndex.messageIndex, getMessage.length])

    return (
        <Box sx={{ backgroundColor: '#eef2ff' }}>
            {loading ? (
                <Loading />
            ) : (
                <Fragment>
                    <HeaderSysDate
                        conference={conference}
                        conferences={conferences}
                        handleChange={handleChange}
                        handleConferenceChange={handleConferenceChange}
                        handleResetTime={handleResetTime}
                        handleTrackChange={handleTrackChange}
                        track={track}
                        tracks={tracks}
                        value={value}
                        handleUpdateTime={handleUpdateTime}
                        timeLoading={timeLoading}
                        minDate={minDate}
                        handleSyncData={handleSyncData}
                    />
                    <Box minHeight="100vh" sx={{ m: '0 auto', pt: 5, pb: 10 }}>
                        <Grid container justifyContent={'center'} columnSpacing={4}>
                            <Grid item xs={4} md={4} lg={4}>
                                <ScriptExecute
                                    conferenceId={conference}
                                    trackId={track}
                                    setScriptLoading={setScriptLoading}
                                    scriptLoading={scriptLoading}
                                    setExecuteMessage={setExecuteMessage}
                                    executeMessage={executeMessage}
                                    scriptDemos={scriptDemos}
                                    scriptAmount={scriptAmount}
                                    subjectAreaAmount={subjectAreaAmount}
                                    setValues={setValues}
                                    values={values}
                                    consoleMessages={consoleMessages}
                                    setGetMessage={setGetMessage}
                                    setCurrentIndex={setCurrentIndex}
                                    setConsoleMessages={setConsoleMessages}
                                    setSuccessMessage={setSuccessMessage}
                                    submissionQuestionAmount={submissionQuestionAmount}
                                    reviewerAccount={reviewerAccount}
                                />
                            </Grid>
                            <Grid item xs={6} md={6} lg={6}>
                                <Box
                                    sx={{
                                        px: 3,
                                        pt: 2,
                                        pb: 4,
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 1000,
                                        boxShadow:
                                            'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
                                        backgroundColor: AppStyles.colors['#FAFBFF'],
                                    }}
                                    borderRadius={2}
                                >
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            sx={{ color: AppStyles.colors['#002b5d'] }}
                                        >
                                            Plan Date
                                        </Typography>
                                        {tableLoading === true ? (
                                            <Box mt={2}>
                                                <Skeleton variant="rounded" height={300} />
                                            </Box>
                                        ) : (
                                            <Fragment>
                                                {trackPlan?.length ? (
                                                    <TimeTable deadlines={trackPlan} currentDate={value} />
                                                ) : (
                                                    <Box m="auto" mt={4}>
                                                        <EmptyData
                                                            textAbove={'No data to display'}
                                                            textBelow={
                                                                'Please select conference and track to display track plan'
                                                            }
                                                        />
                                                    </Box>
                                                )}
                                            </Fragment>
                                        )}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Fragment>
            )}
        </Box>
    )
}

export default SysDate
