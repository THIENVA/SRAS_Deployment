import { Fragment, useEffect, useState } from 'react'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, Divider, Grid, Typography } from '@mui/material'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import AbstractSection from './Abstract'
import RevisionFile from './RevisionFile'
import RevisionInstruction from './RevisionInstruction'
import SubmissionFile from './SubmissionFile'
import SubmissionInstruction from './SubmissionInstruction'
import SupplementaryMaterial from './SupplementaryMaterial'
import Other from './other'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import {
    abstract,
    instruction,
    other,
    revisionFile,
    submissionFile,
    supplementaryMaterial,
} from '~/mock/SubmissionConfig'

const SubmissionConfig = () => {
    const showSnackbar = useSnackbar()
    const { postSubmissionSettings, getSubmissionSettings, getInstructionSettings } = useTrack()
    const [stateAbstract, setStateAbstract] = useState([])
    const [stateSubmissionFile, setStateSubmissionFile] = useState([])
    const [stateSupplementaryMaterial, setStateSupplementaryMaterial] = useState([])
    const [stateRevisionFile, setStateRevisionFile] = useState([])
    const [stateOther, setStateOther] = useState([])
    const [submissionInstruction, setSubmissionInstruction] = useState('')
    const [revisionInstruction, setRevisionInstruction] = useState('')
    const [isDisable, setDisable] = useState(false)
    const [loading, setLoading] = useState(true)
    const { trackId } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
        trackConference: { trackId: id },
    } = useAppSelector((state) => state.conference)

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : trackId

    const handleSaveConflictSetting = () => {
        setDisable(true)
        const conflictSettings = {
            abstractSettings: stateAbstract,
            submissionFileSettings: stateSubmissionFile,
            supplementaryMaterialSettings: stateSupplementaryMaterial,
            revisionSettings: stateRevisionFile,
            otherSettings: stateOther,
            revisionInstruction: revisionInstruction,
        }
        postSubmissionSettings(trackIdSubmitted, JSON.stringify(conflictSettings), submissionInstruction)
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
        const signal = controller.signal
        setLoading(true)

        if (trackIdSubmitted) {
            const instructionSettings = getInstructionSettings(trackIdSubmitted, signal)
            const submissionSettings = getSubmissionSettings(trackIdSubmitted, signal)

            Promise.all([instructionSettings, submissionSettings])
                .then((response) => {
                    const instructionData = response[0].data
                    const submissiondata = response[1].data
                    if (instructionData) {
                        setSubmissionInstruction(instructionData)
                    } else {
                        setSubmissionInstruction(instruction)
                    }
                    // if (submissiondata) {
                    //     setStateAbstract(submissiondata.abstractSettings)
                    //     setStateSubmissionFile(submissiondata.submissionFileSettings)
                    //     setStateSupplementaryMaterial(submissiondata.supplementaryMaterialSettings)
                    //     setStateRevisionFile(submissiondata.revisionSettings)
                    //     setStateOther(submissiondata.otherSettings)
                    // } else {
                    //     setStateAbstract(abstract)
                    //     setStateSubmissionFile(submissionFile)
                    //     setStateSupplementaryMaterial(supplementaryMaterial)
                    //     setStateRevisionFile(revisionFile)
                    //     setStateOther(other)
                    // }
                    setStateAbstract(abstract)
                    setStateSubmissionFile(submissionFile)
                    setStateSupplementaryMaterial(supplementaryMaterial)
                    setStateRevisionFile(revisionFile)
                    setStateOther(other)
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
                            Submission
                        </Typography>
                        {loading ? (
                            <Loading height={600} />
                        ) : (
                            <Fragment>
                                <SubmissionInstruction
                                    submissionInstruction={submissionInstruction}
                                    setSubmissionInstruction={setSubmissionInstruction}
                                />
                                <AbstractSection abstract={stateAbstract} setStateAbstract={setStateAbstract} />
                                <SubmissionFile
                                    stateSubmissionFile={stateSubmissionFile}
                                    setStateSubmissionFile={setStateSubmissionFile}
                                />
                                <Divider
                                    sx={{
                                        width: '100%',
                                        height: 2,
                                        my: 2,
                                    }}
                                />
                                <Typography variant="h5" fontWeight={700}>
                                    Supplementary
                                </Typography>
                                <SupplementaryMaterial
                                    stateSupplementaryMaterial={stateSupplementaryMaterial}
                                    setStateSupplementaryMaterial={setStateSupplementaryMaterial}
                                />
                                <Divider
                                    sx={{
                                        width: '100%',
                                        height: 2,
                                        my: 2,
                                    }}
                                />
                                <Typography variant="h5" fontWeight={700}>
                                    Revision
                                </Typography>
                                <RevisionInstruction
                                    revisionInstruction={revisionInstruction}
                                    setRevisionInstruction={setRevisionInstruction}
                                />
                                <RevisionFile
                                    stateRevisionFile={stateRevisionFile}
                                    setStateRevisionFile={setStateRevisionFile}
                                />
                                <Divider
                                    sx={{
                                        width: '100%',
                                        height: 2,
                                        my: 2,
                                    }}
                                />
                                <Typography variant="h5" fontWeight={700}>
                                    Other
                                </Typography>
                                <Other stateOther={stateOther} setStateOther={setStateOther} />
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

export default SubmissionConfig
