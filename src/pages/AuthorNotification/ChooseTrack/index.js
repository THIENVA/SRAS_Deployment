import React, { useEffect } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Box, Button, ThemeProvider, Typography, createTheme } from '@mui/material'

import TrackTable from './TrackTable'

import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { AUTHOR_NOTIFICATION } from '~/constants/steps'
import { useAppSelector } from '~/hooks/redux-hooks'
import Loading from '~/pages/Loading'

const theme = createTheme({ typography: { fontSize: 16 } })

const ChooseTrack = ({
    rowSelection,
    setRowSelection,
    handleNext,
    handleBack,
    activeStep,
    rowIndex,
    trackData,
    setLoading,
    loading,
    setTrackDataTable,
    setCurrentTrackSelected,
    currentTrackSelected,
    resetEmailSetting,
}) => {
    const { conferenceId: id } = useParams()
    const { trackSubmission } = loading
    const history = useHistory()
    const {
        conference: { conferenceId },
        trackConference: { trackId },
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { getNumberOfSubmission } = usePaperSubmission()

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        const track = roleName === ROLES_NAME.TRACK_CHAIR ? trackId : null
        if (trackSubmission) {
            getNumberOfSubmission(conferenceId, signal, track)
                .then((response) => {
                    const tracks = response.data
                    setTrackDataTable(tracks)
                })
                .finally(() => {
                    setLoading((prev) => ({ ...prev, trackSubmission: false }))
                })
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return trackSubmission ? (
        <Loading height="70vh" />
    ) : (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    mb: 2,
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 16, color: AppStyles.colors['#464646'] }}>
                    Choose tracks
                </Typography>
            </Box>

            <ThemeProvider theme={theme}>
                <TrackTable tableData={trackData} rowSelection={rowSelection} setRowSelection={setRowSelection} />
            </ThemeProvider>

            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 2,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                }}
            >
                <Box ml={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                        sx={{
                            ml: 5,
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            fontSize: '1.125rem',
                            ':hover': {
                                textDecoration: 'underline',
                            },
                        }}
                        onClick={() => history.push(`/conferences/${id}/submission/submission-console`)}
                    >
                        Cancel
                    </Typography>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                        variant="outlined"
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            if (rowIndex !== currentTrackSelected) {
                                setCurrentTrackSelected(rowIndex)
                                resetEmailSetting()
                                setLoading((prev) => ({ ...prev, emailTemplates: true }))
                            }
                            handleNext()
                        }}
                        variant="contained"
                        disabled={!rowIndex}
                        sx={{ ml: 5, textTransform: 'none', height: 36 }}
                    >
                        {activeStep === AUTHOR_NOTIFICATION.length - 1 ? 'Send' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default ChooseTrack
