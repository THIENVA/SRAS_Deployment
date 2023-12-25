import { Fragment, useEffect, useState } from 'react'

import moment from 'moment'
import queryString from 'query-string'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import { LocationOn } from '@mui/icons-material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab, Tooltip, Typography, Zoom } from '@mui/material'
import Label from '~/components/Label'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import Participation from './Participation'
import ProgramCommittee from './ProgramCommittee'
import Summary from './Summary'

import { useConference } from '~/api/common/conference'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const TAB_DASHBOARD = {
    first: '0',
    second: '1',
    third: '2',
    fourth: '3',
}

const ConferenceDashboard = () => {
    // const showSnackbar = useSnackbar()
    const {
        trackConference: { trackId },
        roleConference: { roleName },
        conferenceStatus,
    } = useAppSelector((state) => state.conference)
    const { search: query, pathname } = useLocation()
    const history = useHistory()
    const { tab } = queryString.parse(query)
    const [phase, setPhase] = useState(null)

    const currentTab =
        !tab ||
        (tab !== TAB_DASHBOARD.first &&
            tab !== TAB_DASHBOARD.second &&
            tab !== TAB_DASHBOARD.third &&
            tab !== TAB_DASHBOARD.fourth)
            ? TAB_DASHBOARD.first
            : tab
    const [index, setIndex] = useState(currentTab)
    const { conferenceId } = useParams()
    const [dashboardDetails, setDashboardDetails] = useState({})
    const [isLoading, setLoading] = useState(true)
    const { getDashboardSummaryAndPC, getPhase } = useConference()

    const track = roleName === ROLES_NAME.CHAIR ? null : trackId

    const changeIndexHandler = (_, value) => {
        setIndex(value)
    }

    const updateRouteHandler = () => {
        let route = pathname + `?tab=${index}`
        history.push(route)
    }

    useEffect(() => {
        updateRouteHandler()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index])

    useEffect(() => {
        const controller = new AbortController()
        if (conferenceId) {
            getDashboardSummaryAndPC(conferenceId, controller.signal)
                .then((response) => {
                    const data = response.data
                    setDashboardDetails(data)
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, please try again later.',
                    // })
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        const controller = new AbortController()

        if (conferenceId) {
            getPhase(conferenceId, track, controller.signal)
                .then((response) => {
                    const data = response.data

                    if (!track) {
                        let maxFactorItem = null

                        data?.forEach((item) => {
                            if (item.currentPhases && item.currentPhases.length > 0) {
                                const maxFactorPhase = item.currentPhases.reduce((prev, current) => {
                                    return prev.factor > current.factor ? prev : current
                                })

                                if (!maxFactorItem || maxFactorPhase.factor > maxFactorItem.maxFactor) {
                                    maxFactorItem = {
                                        ...item,
                                        maxFactor: maxFactorPhase.factor,
                                    }
                                }
                            }
                        })
                        setPhase(maxFactorItem)
                    } else {
                        setPhase(data[0])
                    }
                })
                .catch(() => {})
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId, track])

    return (
        <ConferenceDetail>
            {isLoading ? (
                <Loading />
            ) : (
                <Fragment>
                    <Box
                        sx={{
                            backgroundColor: AppStyles.colors['#EEF2FF'],
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            pt: 12,
                            zIndex: 1000,
                        }}
                    >
                        <Box width={ScreenSize.ScreenDashboard} m="0 auto" px={1} py={2} pb={1}>
                            <Box display="flex" alignItems="center">
                                <Box
                                    minWidth={140}
                                    minHeight={140}
                                    sx={{
                                        p: 1,
                                        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px',
                                        backgroundColor: 'white',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        width={140}
                                        height={140}
                                        sx={{ aspectRatio: '1 / 1', objectFit: 'contain' }}
                                        src={dashboardDetails.logo}
                                        alt={dashboardDetails.conferenceShortName + ' logo'}
                                    />
                                </Box>
                                <Box ml={4} display="flex">
                                    <Box width={800}>
                                        <Typography
                                            fontWeight={500}
                                            maxWidth={800}
                                            sx={{
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: '2',
                                                textOverflow: 'ellipsis',
                                                color: AppStyles.colors['#1F2328'],
                                                textDecoration: 'none',
                                                fontSize: 24,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {dashboardDetails.conferenceFullName}
                                        </Typography>
                                        <Typography
                                            fontWeight={500}
                                            variant="body1"
                                            sx={{
                                                color: AppStyles.colors['#767680'],
                                                textDecoration: 'none',
                                            }}
                                        >
                                            ({dashboardDetails.conferenceShortName})
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <Tooltip title="Location" TransitionComponent={Zoom} placement="left">
                                                <LocationOn
                                                    fontSize="medium"
                                                    sx={{ color: AppStyles.colors['#656d76'] }}
                                                />
                                            </Tooltip>
                                            <Typography
                                                fontWeight={500}
                                                sx={{
                                                    ml: 1,
                                                    fontSize: 16,
                                                    color: AppStyles.colors['#1F2328'],
                                                }}
                                            >
                                                {dashboardDetails.city}, {dashboardDetails.country}
                                            </Typography>
                                        </Box>

                                        {phase?.currentPhases && (
                                            <Box display="flex" alignItems="center" mt={1}>
                                                <Typography
                                                    fontWeight={600}
                                                    sx={{ mr: 1, fontSize: 16, color: AppStyles.colors['#1F2328'] }}
                                                >
                                                    Current Phase:{' '}
                                                </Typography>
                                                <Typography
                                                    fontWeight={500}
                                                    sx={{
                                                        fontSize: 16,
                                                        color: AppStyles.colors['#0D1B3EB3'],
                                                    }}
                                                >
                                                    <strong>{phase?.currentPhases[0].phase}</strong>:{' '}
                                                    {phase?.currentPhases[0].deadlineName} (
                                                    {new Date(phase?.currentPhases[0].deadline).toLocaleDateString(
                                                        'en-GB'
                                                    )}
                                                    )
                                                </Typography>
                                            </Box>
                                        )}

                                        <Box display="flex" alignItems="center" mt={1}>
                                            <Typography
                                                fontWeight={500}
                                                sx={{
                                                    fontSize: 18,
                                                    color: AppStyles.colors['#002b5d'],
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {moment(dashboardDetails.startDate).format('MMM Do YYYY')} -{' '}
                                                {moment(dashboardDetails.endDate).format('MMM Do YYYY')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box mt={0.5}>
                                        {conferenceStatus === 'Yet to start' ? (
                                            <Label variant="filled" color="default">
                                                Yet to start
                                            </Label>
                                        ) : (
                                            <Label
                                                variant="ghost"
                                                color={
                                                    conferenceStatus === 'Ongoing'
                                                        ? 'warning'
                                                        : conferenceStatus === 'Overdue'
                                                        ? 'error'
                                                        : 'success'
                                                }
                                            >
                                                {conferenceStatus}
                                            </Label>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box width={ScreenSize.ScreenDashboard} m="0 auto" mt={24}>
                        <TabContext value={index}>
                            <TabList
                                onChange={changeIndexHandler}
                                variant="fullWidth"
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tab
                                    label="Summary"
                                    value={TAB_DASHBOARD.first}
                                    sx={{
                                        minWidth: 100,
                                        textTransform: 'none',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        color: AppStyles.colors['#333333'],
                                    }}
                                />
                                <Tab
                                    label="Program Committee"
                                    value={TAB_DASHBOARD.second}
                                    sx={{
                                        minWidth: 100,
                                        textTransform: 'none',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        color: AppStyles.colors['#333333'],
                                    }}
                                />
                                <Tab
                                    label="Participation"
                                    value={TAB_DASHBOARD.third}
                                    sx={{
                                        minWidth: 100,
                                        textTransform: 'none',
                                        fontSize: 16,
                                        fontWeight: 500,
                                        color: AppStyles.colors['#333333'],
                                    }}
                                />
                            </TabList>
                            <TabPanel value={TAB_DASHBOARD.first} sx={{ p: 0 }}>
                                <Summary dashboardDetails={dashboardDetails} />
                            </TabPanel>
                            <TabPanel value={TAB_DASHBOARD.second} sx={{ p: 0 }}>
                                <ProgramCommittee
                                    tableData={dashboardDetails.pcChairs ? dashboardDetails.pcChairs : []}
                                />
                            </TabPanel>
                            <TabPanel value={TAB_DASHBOARD.third} sx={{ p: 0 }}>
                                <Participation />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Fragment>
            )}
        </ConferenceDetail>
    )
}

export default ConferenceDashboard
