import { Fragment, useEffect, useState } from 'react'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, Grid, Typography } from '@mui/material'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import PresentationFile from './PresentationFile'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import { presentationFile } from '~/mock/SubmissionConfig'

const PresentationConfig = () => {
    const { trackId } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
        trackConference: { trackId: id },
    } = useAppSelector((state) => state.conference)
    const { getPresentationSetting, updatePresentationSetting } = useTrack()
    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : trackId
    const showSnackbar = useSnackbar()
    const [statePresentation, setStatePresentation] = useState([])
    const [isDisable, setDisable] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleSaveConflictSetting = () => {
        setDisable(true)
        const conflictSettings = {
            presentationFileSettings: statePresentation,
        }
        updatePresentationSetting(trackIdSubmitted, conflictSettings)
            .then(() => {
                showSnackbar({
                    severity: 'success',
                    children: 'Save Submission Settings Successfully.',
                })
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later',
                // })
            })
            .finally(() => {
                setDisable(false)
            })
    }

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)

        if (trackIdSubmitted) {
            getPresentationSetting(trackIdSubmitted, controller.signal)
                .then((response) => {
                    const presentationSetting = response.data
                    if (presentationSetting) {
                        setStatePresentation(presentationSetting.result.presentationFileSettings)
                    } else {
                        setStatePresentation(presentationFile)
                    }
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
    }, [trackIdSubmitted])
    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700}>
                            Presentations
                        </Typography>
                        {loading ? (
                            <Loading height={600} />
                        ) : (
                            <Fragment>
                                <PresentationFile
                                    presentationFile={statePresentation}
                                    setStatePresentationFile={setStatePresentation}
                                />
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: 36 }}
                                        disabled={isDisable}
                                        loading={isDisable}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        onClick={() => handleSaveConflictSetting()}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </Fragment>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default PresentationConfig
