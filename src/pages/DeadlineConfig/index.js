import { Fragment, useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'

import { Box, Container, Grid, Typography } from '@mui/material'
import EmptyData from '~/components/EmptyData'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import ConfirmPopup from './ConfirmPopup'
import DeadlineDatePopup from './DeadlineDatePopup'
import TimeTable from './TimeTable'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const Deadline = () => {
    const { conferenceId } = useParams()
    const { getActivityTimeline } = useTrack()
    const showSnackbar = useSnackbar()
    const [deadlinesActivity, setDeadlinesActivity] = useState([])

    const { trackId } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
        trackConference: { trackId: id },
    } = useAppSelector((state) => state.conference)
    const [tableLoading, setTableLoading] = useState(true)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [openDateModal, setOpenDateModal] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [currentIndexDate, setCurrentIndexDate] = useState(null)

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : trackId

    const handleDeadlineStatus = (index) => {
        setCurrentIndex(index)
        handleOpenConfirmModal()
    }

    const handleDeadlineTime = (index) => {
        setCurrentIndexDate(index)
        handleOpenDateModal()
    }

    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false)
    }

    const handleOpenDateModal = () => {
        setOpenDateModal(true)
    }

    const handleCloseDateModal = () => {
        setOpenDateModal(false)
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        if (trackIdSubmitted) {
            getActivityTimeline(trackIdSubmitted, signal)
                .then((response) => {
                    const data = response.data

                    setDeadlinesActivity(data)
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
                    setTableLoading(false)
                })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackIdSubmitted])
    return (
        <ConferenceDetail>
            {openConfirmModal && (
                <ConfirmPopup
                    open={openConfirmModal}
                    handleClose={handleCloseConfirmModal}
                    trackIdSubmitted={trackIdSubmitted}
                    deadlinesActivity={deadlinesActivity}
                    currentIndex={currentIndex}
                    setDeadlinesActivity={setDeadlinesActivity}
                />
            )}
            {openDateModal && (
                <DeadlineDatePopup
                    open={openDateModal}
                    handleClose={handleCloseDateModal}
                    trackIdSubmitted={trackIdSubmitted}
                    deadlinesActivity={deadlinesActivity}
                    currentIndexDate={currentIndexDate}
                    setDeadlinesActivity={setDeadlinesActivity}
                />
            )}
            <Container maxWidth="lg">
                <Grid container>
                    <Grid lg={3} item>
                        <SettingCompo />
                    </Grid>
                    <Grid lg={9} item>
                        <Typography variant="h5" fontWeight={700}>
                            Deadlines
                        </Typography>
                        {tableLoading ? (
                            <Loading height={600} />
                        ) : (
                            <Fragment>
                                {deadlinesActivity?.length ? (
                                    <Fragment>
                                        <TimeTable
                                            deadlines={deadlinesActivity}
                                            handleDeadlineStatus={handleDeadlineStatus}
                                            handleDeadlineTime={handleDeadlineTime}
                                        />
                                    </Fragment>
                                ) : (
                                    <Box m="auto" mt={4}>
                                        <EmptyData
                                            textAbove={'No data to display'}
                                            textBelow={'Please create track plan before do this setting'}
                                            content="Go to Track Plan"
                                            path={`/conferences/${conferenceId}/settings/track-plan`}
                                        />
                                    </Box>
                                )}
                            </Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default Deadline
