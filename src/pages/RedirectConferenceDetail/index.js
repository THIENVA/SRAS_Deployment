import { Fragment, useEffect, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import { Redirect, useLocation, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import ConferenceHeader from '~/components/Common/ConferenceHeader'

import Loading from '../Loading'

import { useConference } from '~/api/common/conference'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { getConference } from '~/features/conference'
import { useAppDispatch, useAppSelector } from '~/hooks/redux-hooks'
import LocalStorageUtils from '~/utils/LocalStorageUtils'

const RedirectConferenceDetail = () => {
    const { getTracksRolesRelevant } = useTrack()
    const location = useLocation()
    const { getDetail } = useConference()
    const {
        conference: { conferenceId: id },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { userId } = useAppSelector((state) => state.auth)
    const [isLoading, setIsLoading] = useState(true)
    const [roleConferenceName, setRoleConferenceName] = useState('/')
    const { conferenceId } = useParams()
    const conferenceRoleName = useRef('')
    const dispatch = useAppDispatch()

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const roleConference = LocalStorageUtils.getRoleConference()
        if (roleConference && roleConference.conference.conferenceId === conferenceId) {
            let foundData = roleConference.roleConference
            const hasSameRole = location.state.conferenceRole.some((item) => {
                const matchingItem = roleConference.rolesTrack.find((data) => data.name === item)
                if (matchingItem) {
                    foundData = cloneDeep(matchingItem)
                    return true
                }
            })
            if (hasSameRole) {
                roleConference.roleConference.roleName = foundData.name
                roleConference.roleConference.roleId = foundData.id
            }
            if (
                roleConference.roleConference.roleName === ROLES_NAME.CHAIR ||
                roleConference.roleConference.roleName === ROLES_NAME.TRACK_CHAIR
            ) {
                setRoleConferenceName(`/conferences/${conferenceId}/dashboard`)
            } else if (roleConference.roleConference.roleName === ROLES_NAME.REVIEWER) {
                setRoleConferenceName(`/conferences/${conferenceId}/submission/reviewer`)
            } else if (roleConference.roleConference.roleName === ROLES_NAME.AUTHOR) {
                setRoleConferenceName(`/conferences/${conferenceId}/submission/author`)
            }
            LocalStorageUtils.setRoleConference(roleConference)
            dispatch(getConference(roleConference))
            setIsLoading(false)
        } else {
            if (!roleName) {
                let foundData = { roleName: 'Author', roleId: uuid() }
                const conferenceGet = getDetail(conferenceId, secondController.signal)
                const getRoles = getTracksRolesRelevant(userId, conferenceId, controller.signal)
                Promise.all([getRoles, conferenceGet])
                    .then((response) => {
                        const info = response[0].data
                        const conferenceDetail = response[1].data
                        const formatInfo = cloneDeep(info)
                        location.state.conferenceRole.some((item) => {
                            const matchingItem = formatInfo.roles[0].subRoles.find((data) => data.name === item)
                            if (matchingItem) {
                                foundData = cloneDeep(matchingItem)
                                return true
                            }
                        })
                        const conferenceInfo = {
                            rolesTrack: formatInfo.roles[0].subRoles,
                            roleConference: {
                                roleName: foundData.name,
                                roleId: foundData.id,
                            },
                            tracksConference: formatInfo.tracks,
                            trackConference: {
                                trackId: formatInfo.tracks.length === 0 ? '' : formatInfo.tracks[0].id,
                                trackName: formatInfo.tracks.length === 0 ? '' : formatInfo.tracks[0].name,
                            },
                            conferences: formatInfo.myConferences,
                            conference: {
                                conferenceId: conferenceId,
                                conferenceName: conferenceDetail.shortName,
                                conferenceFullName: conferenceDetail.fullName,
                            },
                            isSingleTracks: formatInfo.isSingleTrack,
                            conferenceStatus: formatInfo.conferenceStatus.conferenceStatus,
                        }
                        conferenceRoleName.current = foundData.name
                        if (
                            conferenceRoleName.current === ROLES_NAME.CHAIR ||
                            conferenceRoleName.current === ROLES_NAME.TRACK_CHAIR
                        ) {
                            setRoleConferenceName(`/conferences/${conferenceId}/dashboard`)
                        } else if (conferenceRoleName.current === ROLES_NAME.REVIEWER) {
                            setRoleConferenceName(`/conferences/${conferenceId}/submission/reviewer`)
                        } else if (conferenceRoleName.current === ROLES_NAME.AUTHOR) {
                            setRoleConferenceName(`/conferences/${conferenceId}/submission/author`)
                        }
                        LocalStorageUtils.setRoleConference(conferenceInfo)
                        dispatch(getConference(conferenceInfo))
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }
        }

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, roleName])

    return isLoading ? (
        <Fragment>
            <ConferenceHeader />
            <Loading />
        </Fragment>
    ) : (
        <Redirect to={roleConferenceName} />
    )
}

export default RedirectConferenceDetail
