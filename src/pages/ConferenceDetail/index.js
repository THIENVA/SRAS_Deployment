import React, { useEffect } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import ConferenceHeader from '~/components/Common/ConferenceHeader'
import GuideLineFab from '~/components/GuidelineFab'

import RedirectConferenceDetail from '../RedirectConferenceDetail'

import { useConference } from '~/api/common/conference'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { updateConferenceState } from '~/features/conference'
import { getMessage } from '~/features/message'
import { getSubmittableTracks as actionGetSubmittableTracks, getTracks, trackChange } from '~/features/track-for-chair'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'

const ConferenceDetail = ({ children }) => {
    const {
        conference: { conferenceId: id },
        roleConference: { roleName, roleId },
        trackConference: { trackId },
    } = useAppSelector((state) => state.conference)
    const history = useHistory()
    const { userId } = useAppSelector((state) => state.auth)
    const { unique } = useAppSelector((state) => state.messages)
    const dispatch = useAppDispatch()
    const { isFirstLoading } = useAppSelector((state) => state.trackForChair)
    const { conferenceId } = useParams()
    const { getAllTrack, getSubmittableTrack, getMessageBasedOnRole } = useTrack()
    const { getConferenceStatus } = useConference()

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        if (isFirstLoading) {
            const allTrackGet = getAllTrack(conferenceId, controller.signal)
            const submittableTracksGet = getSubmittableTrack(conferenceId, secondController.signal)
            Promise.all([allTrackGet, submittableTracksGet]).then((response) => {
                const tracks = response[0].data.tracks
                if (Array.isArray(tracks))
                    tracks.sort((a, b) =>
                        a.isDeletable === b.isDeletable ? a.name.localeCompare(b.name) : a.isDeletable ? 1 : -1
                    )
                if (response[1].data) {
                    const formatSubmittableTracks = response[1].data.map((track) => ({
                        id: track.trackId,
                        name: track.trackName,
                        deadline: track.deadline,
                    }))
                    dispatch(actionGetSubmittableTracks(formatSubmittableTracks))
                }
                const { id, name } = tracks[0]
                dispatch(getTracks({ tracks, isFirstLoading: false }))
                dispatch(trackChange({ id, name }))
            })
        }
        return () => {
            controller.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, conferenceId, roleName])

    useEffect(() => {
        const thirdController = new AbortController()
        if (roleName) {
            const getTrackId =
                roleName === ROLES_NAME.AUTHOR || roleName === ROLES_NAME.CHAIR || roleName == ROLES_NAME.REVIEWER
                    ? null
                    : trackId
            getMessageBasedOnRole(conferenceId, getTrackId, roleId, userId, thirdController.signal).then((response) => {
                if (response.data) {
                    dispatch(getMessage(response.data))
                }
            })
        }
        return () => {
            thirdController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, conferenceId, roleName, unique])

    useEffect(() => {
        const controller = new AbortController()
        getConferenceStatus(conferenceId, controller.signal).then((response) => {
            const { conferenceStatus } = response.data
            if (conferenceStatus === 'Finished' || conferenceStatus === 'Overdue') {
                history.replace('/conferences')
            } else {
                dispatch(
                    updateConferenceState({
                        conferenceStatus: conferenceStatus.conferenceStatus,
                        websiteLink: conferenceStatus.websiteLink,
                    })
                )
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            <ConferenceHeader />
            {/* {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && <ProgressFab />} */}
            {(roleName === ROLES_NAME.TRACK_CHAIR || roleName === ROLES_NAME.CHAIR) && <GuideLineFab />}
            {!id && <RedirectConferenceDetail />}
            {conferenceId !== id && <RedirectConferenceDetail />}
            {id && children}
        </React.Fragment>
    )
}

export default ConferenceDetail
