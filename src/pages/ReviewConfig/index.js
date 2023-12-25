import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Container, FormHelperText, Grid, Typography } from '@mui/material'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import CriteriaList from './CriteriaList'
import NewOption from './NewOption'
import SectionLayout from './SectionLayout'
import UpdateOption from './UpdateOption'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const ReviewConfig = () => {
    const { trackId } = useAppSelector((state) => state.trackForChair)
    const { conferenceId } = useParams()
    const {
        roleConference: { roleName },
        trackConference: { trackId: id },
    } = useAppSelector((state) => state.conference)

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : trackId
    const { updateReviewCriteriaSetting, getReviewCriteriaSetting } = useTrack()
    const showSnackbar = useSnackbar()
    const [criteria, setCriteria] = useState([])
    const [criterion, setCriterion] = useState(null)
    const [openNewCriterion, setOpenNewCriterion] = useState(false)
    const [openUpdateCriterion, setOpenUpdateCriterion] = useState(false)
    const [loading, setLoading] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [error, setError] = useState({
        criteria: false,
    })
    const [messageError, setMessageError] = useState({
        criteria: '',
    })

    const handleOpen = () => setOpenNewCriterion(true)

    const handleClose = () => setOpenNewCriterion(false)

    const handleAddCriterion = (criterion) => {
        setCriteria((prev) => [...prev, { ...criterion }])
    }

    const handleOpenUpdateCriterion = (id) => {
        const getCriterion = criteria.find((item) => item.id === id)
        setCriterion(cloneDeep(getCriterion))
        setOpenUpdateCriterion(true)
    }

    const handleCloseUpdateCriterion = () => setOpenUpdateCriterion(false)

    const handleUpdateCriterion = (criterionUpdated) => {
        const updatedCriteria = cloneDeep(criteria)
        const index = updatedCriteria.findIndex((item) => item.id === criterionUpdated.id)
        updatedCriteria[index] = criterionUpdated
        setCriteria(updatedCriteria)
    }

    const deleteCriterion = (id) => {
        const updatedCriteria = criteria.filter((item) => item.id !== id)
        setCriteria(updatedCriteria)
    }

    const handleMove = (index, action) => {
        const quest = cloneDeep(criteria.at(index))
        const nextQuest = cloneDeep(criteria.at(index + 1))
        const prevQuest = cloneDeep(criteria.at(index - 1))
        const updatedQuestions = cloneDeep(criteria)
        if (action === 'down') {
            updatedQuestions[index] = nextQuest
            updatedQuestions[index + 1] = quest
        } else if (action === 'up') {
            updatedQuestions[index] = prevQuest
            updatedQuestions[index - 1] = quest
        }

        setCriteria(updatedQuestions)
    }

    const handleSubmit = () => {
        const isCriteria =
            criteria.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.factor
            }, 0) <= 1

        const isValid = isCriteria
        if (!isValid) {
            setError({
                criteria: !isCriteria,
            })
            setMessageError({
                criteria: !isCriteria ? 'Total of factor must be less or equal 1' : '',
            })
        } else {
            setSaveLoading(true)
            const formatCriteria = criteria.map((item, index) => ({
                ...item,
                grade: null,
                position: index + 1,
            }))

            updateReviewCriteriaSetting(trackIdSubmitted, formatCriteria)
                .then(() => {
                    showSnackbar({
                        severity: 'success',
                        children: 'Update review criteria submission successfully.',
                    })
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong, cannot upload files.',
                    })
                    setSaveLoading(false)
                })
        }
    }

    useEffect(() => {
        setLoading(true)
        const controller = new AbortController()
        if (conferenceId && trackIdSubmitted) {
            const reviewSettingGet = getReviewCriteriaSetting(trackIdSubmitted, controller.signal)
            Promise.all([reviewSettingGet])
                .then((response) => {
                    const reviewSetting = response[0].data
                    setCriteria(reviewSetting ? reviewSetting : [])
                })
                .catch(() => {
                    // showSnackbar({
                    //     severity: 'error',
                    //     children: 'Something went wrong, Please try again later.',
                    // })
                })
                .finally(() => {
                    setLoading(false)
                })
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
                        {loading ? (
                            <Loading height="70vh" />
                        ) : (
                            <React.Fragment>
                                <Typography variant="h5" fontWeight={700}>
                                    Review Criteria Submission
                                </Typography>
                                <SectionLayout
                                    disable={
                                        criteria.reduce((accumulator, currentValue) => {
                                            return accumulator + currentValue.factor
                                        }, 0) >= 1
                                    }
                                    title="REVIEW CRITERIA LIST"
                                    onClick={handleOpen}
                                    buttonText="New Criterion"
                                >
                                    {error.criteria && (
                                        <FormHelperText error={error.criteria}>{messageError.criteria}</FormHelperText>
                                    )}
                                    <CriteriaList
                                        criteria={criteria}
                                        handleOpenUpdateCriterion={handleOpenUpdateCriterion}
                                        deleteCriterion={deleteCriterion}
                                        handleMove={handleMove}
                                    />
                                </SectionLayout>
                                <Box
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                    sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                                >
                                    <LoadingButton
                                        variant="contained"
                                        sx={{ textTransform: 'none', height: 36 }}
                                        disabled={saveLoading}
                                        loading={saveLoading}
                                        loadingPosition="start"
                                        startIcon={<Save />}
                                        onClick={handleSubmit}
                                    >
                                        Save Changes
                                    </LoadingButton>
                                </Box>
                            </React.Fragment>
                        )}
                    </Grid>
                    {openNewCriterion && (
                        <NewOption
                            open={openNewCriterion}
                            handleClose={handleClose}
                            handleAddCriterion={handleAddCriterion}
                            criteria={criteria}
                        />
                    )}
                    {openUpdateCriterion && (
                        <UpdateOption
                            open={openUpdateCriterion}
                            handleClose={handleCloseUpdateCriterion}
                            handleUpdateCriterion={handleUpdateCriterion}
                            criterion={criterion}
                            criteria={criteria}
                        />
                    )}
                </Grid>
            </Container>
        </ConferenceDetail>
    )
}

export default ReviewConfig
