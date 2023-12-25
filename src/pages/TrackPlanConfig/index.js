import { Fragment, useEffect, useRef, useState } from 'react'

import { addDays } from 'date-fns'
import { ExportToCsv } from 'export-to-csv'
import { cloneDeep } from 'lodash'
import moment from 'moment'

import { Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, Grid, InputLabel, Skeleton, Typography } from '@mui/material'
import EmptyData from '~/components/EmptyData'
import SettingCompo from '~/components/SettingCompo'

import ConferenceDetail from '../ConferenceDetail'
import ConfirmPopup from './ConfirmPopup'
import TimeTable from './TimeTable'
import TrackPlanPopup from './TrackPlanPopup'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'
import { getClosedIndex, getTurnOffDeadline, propertiesMatch } from '~/utils/commonFunction'

const targetPhases = [
    'Revision 1 Submission Deadline',
    'Revision 1 Review Submission Deadline',
    'Revision 2 Submission Deadline',
    'Revision 2 Review Submission Deadline',
    'Revision 3 Submission Deadline',
    'Revision 3 Review Submission Deadline',
    'Revision 4 Submission Deadline',
    'Revision 4 Review Submission Deadline',
    'Revision 5 Submission Deadline',
    'Revision 5 Review Submission Deadline',
    'Revision 6 Submission Deadline',
    'Revision 6 Review Submission Deadline',
    'Revision 7 Submission Deadline',
    'Revision 7 Review Submission Deadline',
    'Revision 8 Submission Deadline',
    'Revision 8 Review Submission Deadline',
    'Revision 9 Submission Deadline',
    'Revision 9 Review Submission Deadline',
    'Revision 10 Submission Deadline',
    'Revision 10 Review Submission Deadline',
]

const TrackPlanConfig = () => {
    const showSnackbar = useSnackbar()
    const { getTrackPlan, checkTrackPlan } = useTrack()
    const [deadlinesActivity, setDeadlinesActivity] = useState([])
    const [initialDeadline, setInitialDeadline] = useState([])
    const [isDisable, setDisable] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)
    const [openPaperModal, setOpenPaperModal] = useState(false)
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [isFirstTime, setFirstTime] = useState(true)
    const formRef = useRef(null)
    const { trackId } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
        trackConference: { trackId: id },
    } = useAppSelector((state) => state.conference)
    const [tableLoading, setTableLoading] = useState(true)
    const csvExporter = new ExportToCsv({
        filename: 'template_trackplan',
        fieldSeparator: ',',
        quoteStrings: '',
        decimalSeparator: '.',
        showLabels: true,
        useTextFile: false,
        useBom: true,
        headers: ['Deadline Name', 'Status', 'Plan Deadline'],
    })

    const trackIdSubmitted = roleName === ROLES_NAME.TRACK_CHAIR ? id : trackId

    const targetPhaseIndices = deadlinesActivity
        .map((phase, index) => (targetPhases.includes(phase.name) ? index : -1))
        .filter((index) => index !== -1)

    const handleOpenModal = () => {
        setOpenPaperModal(true)
    }

    const handleCloseModal = () => {
        setTableLoading(false)
        setOpenPaperModal(false)
    }

    const handleOpenConfirmModal = () => {
        setOpenConfirmModal(true)
    }

    const handleCloseConfirmModal = () => {
        setButtonLoading(false)
        setOpenConfirmModal(false)
    }

    const handleDeadlineStatus = (event, index) => {
        const updatedDeadlines = cloneDeep(deadlinesActivity)

        const newUpdateDeadline = getTurnOffDeadline(event, updatedDeadlines, targetPhaseIndices, index)

        setDeadlinesActivity(newUpdateDeadline)
    }

    const handleDeadlineTime = (newDate, index) => {
        const { beforeIndex, afterIndex } = getClosedIndex(deadlinesActivity, index)
        const formatDate = moment(newDate).format()
        const planDeadline = formatDate.substring(0, 19)

        const updatedDeadlines = cloneDeep(deadlinesActivity)

        const previousPlanDeadline = deadlinesActivity[beforeIndex]?.planDeadline
        const nextPlanDeadline = deadlinesActivity[afterIndex]?.planDeadline
        const formattedPrevPlan = new Date(previousPlanDeadline).toLocaleDateString('en-GB')
        const formattedNextPlan = new Date(nextPlanDeadline).toLocaleDateString('en-GB')

        updatedDeadlines[index].error = false
        updatedDeadlines[index].helperText = ''

        if (index === 0) {
            if (nextPlanDeadline === null) {
                updatedDeadlines[index].planDeadline = planDeadline
                setDeadlinesActivity(updatedDeadlines)
            } else {
                if (deadlinesActivity[index].canSkip === false) {
                    if (formatDate < moment(nextPlanDeadline).format()) {
                        updatedDeadlines[index].planDeadline =
                            planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                        setDeadlinesActivity(updatedDeadlines)
                    } else {
                        updatedDeadlines[index].error = true
                        updatedDeadlines[index].planDeadline = null
                        updatedDeadlines[index].helperText = `Must < ${formattedNextPlan}`
                        setDeadlinesActivity(updatedDeadlines)
                    }
                } else {
                    if (formatDate <= moment(nextPlanDeadline).format()) {
                        updatedDeadlines[index].planDeadline =
                            planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                        setDeadlinesActivity(updatedDeadlines)
                    } else {
                        updatedDeadlines[index].error = true
                        updatedDeadlines[index].planDeadline = null
                        updatedDeadlines[index].helperText = `Must ≤ ${formattedNextPlan}`
                        setDeadlinesActivity(updatedDeadlines)
                    }
                }
            }
        } else if (index === deadlinesActivity.length - 1) {
            if (previousPlanDeadline === null) {
                updatedDeadlines[index].planDeadline =
                    planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                setDeadlinesActivity(updatedDeadlines)
            } else {
                if (deadlinesActivity[index].canSkip === false) {
                    if (formatDate > moment(previousPlanDeadline).format()) {
                        updatedDeadlines[index].planDeadline =
                            planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                        setDeadlinesActivity(updatedDeadlines)
                    } else {
                        updatedDeadlines[index].error = true
                        updatedDeadlines[index].planDeadline = null
                        updatedDeadlines[index].helperText = `Must > ${formattedPrevPlan}`
                        setDeadlinesActivity(updatedDeadlines)
                    }
                } else {
                    if (formatDate >= moment(previousPlanDeadline).format()) {
                        updatedDeadlines[index].planDeadline =
                            planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                        setDeadlinesActivity(updatedDeadlines)
                    } else {
                        updatedDeadlines[index].error = true
                        updatedDeadlines[index].planDeadline = null
                        updatedDeadlines[index].helperText = `Must ≥ ${formattedPrevPlan}`
                        setDeadlinesActivity(updatedDeadlines)
                    }
                }
            }
        } else {
            if (deadlinesActivity[index].canSkip === false) {
                if (previousPlanDeadline === null && formatDate < moment(nextPlanDeadline).format()) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else if (formatDate > moment(previousPlanDeadline).format() && nextPlanDeadline === null) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else if (previousPlanDeadline === null && nextPlanDeadline === null) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else if (
                    formatDate > moment(previousPlanDeadline).format() &&
                    formatDate < moment(nextPlanDeadline).format()
                ) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else {
                    updatedDeadlines[index].error = true
                    updatedDeadlines[index].planDeadline = null

                    if (previousPlanDeadline === null) {
                        updatedDeadlines[index].helperText = `Must < ${formattedNextPlan}`
                    } else if (nextPlanDeadline === null) {
                        updatedDeadlines[index].helperText = `Must > ${formattedPrevPlan}`
                    } else {
                        updatedDeadlines[index].helperText = `Must > ${formattedPrevPlan} & < ${formattedNextPlan}`
                    }
                    setDeadlinesActivity(updatedDeadlines)
                }
            } else {
                if (previousPlanDeadline === null && formatDate <= moment(nextPlanDeadline).format()) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else if (formatDate >= moment(previousPlanDeadline).format() && nextPlanDeadline === null) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else if (previousPlanDeadline === null && nextPlanDeadline === null) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else if (
                    formatDate >= moment(previousPlanDeadline).format() &&
                    formatDate <= moment(nextPlanDeadline).format()
                ) {
                    updatedDeadlines[index].planDeadline =
                        planDeadline.toUpperCase() === 'INVALID DATE' ? null : planDeadline
                    setDeadlinesActivity(updatedDeadlines)
                } else {
                    updatedDeadlines[index].error = true
                    updatedDeadlines[index].planDeadline = null

                    if (previousPlanDeadline === null) {
                        updatedDeadlines[index].helperText = `Must ≤ ${formattedNextPlan}`
                    } else if (nextPlanDeadline === null) {
                        updatedDeadlines[index].helperText = `Must ≥ ${formattedPrevPlan}`
                    } else {
                        updatedDeadlines[index].helperText = `Must ≥ ${formattedPrevPlan} & ≤ ${formattedNextPlan}`
                    }
                    setDeadlinesActivity(updatedDeadlines)
                }
            }
        }
    }

    const handleSaveConflictSetting = () => {
        setButtonLoading(true)
        handleOpenConfirmModal()
    }

    const handleReset = () => setDeadlinesActivity(initialDeadline)

    const handleIncreaseDate = () => {
        const updatedDeadlines = cloneDeep(deadlinesActivity)

        for (let index = 1; index < updatedDeadlines.length - 1; index++) {
            updatedDeadlines[index].planDeadline = moment(
                addDays(new Date(updatedDeadlines[index - 1].planDeadline), 7)
            )
                .format()
                .substring(0, 19)
        }
        setDeadlinesActivity(updatedDeadlines)
    }

    const checkDateEmpty = () => {
        let count = 0
        let disableCount = 0
        for (const deadline of deadlinesActivity) {
            if (deadline.status === 'Enabled') {
                if (deadline.planDeadline !== null) {
                    count++
                }
            } else {
                disableCount++
            }
        }
        if (count === deadlinesActivity.length - disableCount) {
            setDisable(false)
        } else {
            setDisable(true)
        }
    }

    const downloadTemplate = () => {
        const updatedDeadlines = cloneDeep(deadlinesActivity)

        const modifiedData = updatedDeadlines.slice(1, updatedDeadlines.length - 1).map((obj) => ({
            name: obj.name,
            status: obj.status,
            planDeadline: obj.planDeadline,
        }))

        csvExporter.generateCsv(modifiedData)
    }

    const arraysMatch = (array1, array2) => {
        // Check if the arrays have the same length
        if (array1.length !== array2.length) {
            return false
        }

        // Create a map to store the elements of array1 by their "name" property
        const map = new Map()
        for (const obj of array1) {
            map.set(obj.name, obj)
        }
        // Iterate through the elements of array2 and compare them with the corresponding elements in array1
        for (const obj of array2) {
            const correspondingObj = map.get(obj.name)
            // If there is no corresponding element in array1 or if the properties don't match, return false
            if (!correspondingObj || !propertiesMatch(correspondingObj, obj)) {
                return false
            }
        }

        // If all elements match, return true
        return true
    }

    const checkPlanDeadlines = (array) => {
        for (let i = 1; i < array.length; i++) {
            const currentDeadline = new Date(array[i].planDeadline)
            const previousDeadline = new Date(array[i - 1].planDeadline)

            // Check if the current deadline is greater than or equal to the previous deadline
            if (currentDeadline <= previousDeadline) {
                return false // Plan deadlines are not in ascending order
            }
        }
        return true // All plan deadlines are in ascending order
    }

    const importTemplate = (e) => {
        const updatedDeadlines = cloneDeep(deadlinesActivity)
        const file = e.target.files[0]
        if (file) {
            if (file.name.endsWith('.csv')) {
                var reader = new FileReader()
                reader.onload = function () {
                    const data = reader.result
                    const rows = data.split('\n')
                    const modifiedData = updatedDeadlines.slice(1, updatedDeadlines.length - 1).map((obj) => ({
                        name: obj.name,
                        status: obj.status,
                        planDeadline: obj.planDeadline,
                    }))
                    const formatCheck = rows.slice(1, updatedDeadlines.length - 1)
                    if (
                        arraysMatch(
                            modifiedData,
                            formatCheck.map((row) => {
                                const fields = row.split(',')
                                const [name, status, planDeadline] = fields
                                return {
                                    name,
                                    status: status,
                                    planDeadline: planDeadline,
                                }
                            })
                        )
                    ) {
                        const dataArray = rows.slice(1, updatedDeadlines.length - 1).map((row) => {
                            const fields = row?.split(',')
                            const [name, status, planDeadline] = fields
                            const cleanedDate = planDeadline?.replace(/\r$/, '')
                            const dateString = cleanedDate
                            const dateParts = dateString?.split('/')
                            const day = parseInt(dateParts[0])
                            const month = parseInt(dateParts[1]) - 1
                            const year = parseInt(dateParts[2])
                            const dateObject = new Date(year, month, day)
                            return {
                                name,
                                status: status,
                                planDeadline: moment(dateObject)?.format()?.substring(0, 19),
                            }
                        })
                        dataArray.forEach((row, index) => {
                            if (
                                updatedDeadlines[index + 1].canSkip === true &&
                                (row.status === 'Enabled' || row.status === 'Disabled')
                            ) {
                                updatedDeadlines[index + 1].status = row.status
                            }
                            if (row?.status !== 'Disabled') {
                                updatedDeadlines[index + 1].planDeadline = moment(row.planDeadline)
                                    ?.format()
                                    ?.substring(0, 19)
                            }
                        })
                        if (checkPlanDeadlines(dataArray)) {
                            setDeadlinesActivity(updatedDeadlines)
                        } else {
                            showSnackbar({
                                severity: 'error',
                                children: 'Plan deadlines are not in ascending order.',
                            })
                        }
                        formRef.current.reset()
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'Incorrect template format, please download new template.',
                        })
                        formRef.current.reset()
                    }
                }

                reader.readAsText(file)
            } else {
                showSnackbar({
                    severity: 'error',
                    children: 'The file must be the .csv file',
                })
                formRef.current.reset()
            }
        }
    }

    useEffect(() => {
        checkDateEmpty()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deadlinesActivity])

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        setDeadlinesActivity([])
        setInitialDeadline([])
        setTableLoading(true)
        if (trackIdSubmitted) {
            checkTrackPlan(trackIdSubmitted, signal).then((response) => {
                const data = response.data
                if (data === '') {
                    setFirstTime(true)
                    handleOpenModal()
                    setTableLoading(true)
                } else {
                    getTrackPlan(trackIdSubmitted, signal)
                        .then((response) => {
                            const data = response.data
                            const modifiedData = data.map((obj) => ({
                                ...obj,
                                error: false,
                                helperText: '',
                            }))
                            setFirstTime(false)
                            setDeadlinesActivity(modifiedData)
                            setTableLoading(false)
                        })
                        .catch(() => {
                            showSnackbar({
                                severity: 'error',
                                children: 'Something went wrong, please try again later.',
                            })
                        })
                        .finally(() => {
                            setTableLoading(false)
                        })
                }
            })
        }
        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackIdSubmitted])

    return (
        <ConferenceDetail>
            {openPaperModal && (
                <TrackPlanPopup
                    open={openPaperModal}
                    handleClose={handleCloseModal}
                    trackIdSubmitted={trackIdSubmitted}
                    setDeadlinesActivity={setDeadlinesActivity}
                    setTableLoading={setTableLoading}
                    setInitialDeadline={setInitialDeadline}
                    setFirstTime={setFirstTime}
                />
            )}
            {openConfirmModal && (
                <ConfirmPopup
                    open={openConfirmModal}
                    handleClose={handleCloseConfirmModal}
                    trackIdSubmitted={trackIdSubmitted}
                    deadlinesActivity={deadlinesActivity}
                    setButtonLoading={setButtonLoading}
                    setFirstTime={setFirstTime}
                />
            )}
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item lg={3}>
                        <SettingCompo />
                    </Grid>
                    <Grid item lg={9}>
                        <Typography variant="h5" fontWeight={700} onClick={handleIncreaseDate}>
                            Plan Deadlines
                        </Typography>
                        <Box
                            sx={{
                                borderRadius: 2,
                                p: 3,
                                my: 1,
                                mb: 3,
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                border: '0.5px solid #cecdcd',
                            }}
                        >
                            <Typography gutterBottom sx={{ fontSize: 16 }}>
                                Please enter the plan deadline.
                            </Typography>
                            <Typography gutterBottom sx={{ fontSize: 16 }}>
                                Click{' '}
                                <Typography component="span" color="error" sx={{ fontWeight: 'bold' }}>
                                    Clear Deadlines
                                </Typography>{' '}
                                button will reset to the original.
                            </Typography>
                            <Typography sx={{ fontSize: 16 }}>
                                <strong>Note: </strong> Enter your input in chronological order, from top to bottom.
                                Start with the earliest date at the top, and continue down the page. This ensures a
                                seamless and error-free timetable timeline. Thank you for your cooperation!
                            </Typography>

                            <Typography sx={{ fontSize: 16, mt: 2 }}>
                                <strong>Template Note:</strong> The downloaded template{' '}
                                <strong>
                                    {`"`}template_trackplan.csv{`"`}
                                </strong>{' '}
                                allows changes only to{' '}
                                <strong>
                                    {`"`}Status{`"`}
                                </strong>{' '}
                                (Enabled or Disabled) and{' '}
                                <strong>
                                    {`"`}Plan Deadline{`"`}
                                </strong>{' '}
                                (dd/mm/yyyy). Remember re-downloading the template if input new number of revision
                                requires.
                            </Typography>
                        </Box>
                        {tableLoading ? (
                            <Box mt={2}>
                                <Skeleton variant="rounded" height={700} />
                            </Box>
                        ) : (
                            <Fragment>
                                {deadlinesActivity?.length ? (
                                    <Fragment>
                                        {isFirstTime === true && (
                                            <Box
                                                display="flex"
                                                alignItems={'center'}
                                                justifyContent={'flex-end'}
                                                component={'form'}
                                                ref={formRef}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => downloadTemplate()}
                                                    sx={{ mr: 1, borderRadius: 1 }}
                                                >
                                                    Download Template
                                                </Button>
                                                <InputLabel htmlFor="upload" sx={{ display: 'inline-block' }}>
                                                    <input
                                                        onChange={importTemplate}
                                                        required
                                                        style={{ opacity: 0, maxWidth: 0.5 }}
                                                        id="upload"
                                                        type="file"
                                                        accept=".csv"
                                                    />
                                                    <LoadingButton
                                                        variant="contained"
                                                        component="span"
                                                        sx={{ borderRadius: 1 }}
                                                    >
                                                        Import Template
                                                    </LoadingButton>
                                                </InputLabel>
                                            </Box>
                                        )}
                                        <TimeTable
                                            deadlines={deadlinesActivity}
                                            handleDeadlineStatus={handleDeadlineStatus}
                                            handleDeadlineTime={handleDeadlineTime}
                                            isFirstTime={isFirstTime}
                                        />
                                        {isFirstTime === true && (
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                sx={{
                                                    backgroundColor: AppStyles.colors['#F5F5F5'],
                                                    mt: 2,
                                                    p: 2,
                                                    borderRadius: 2,
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ mr: 1.5, textTransform: 'none', height: 36 }}
                                                    onClick={handleReset}
                                                >
                                                    Clear Deadlines
                                                </Button>
                                                <LoadingButton
                                                    variant="contained"
                                                    sx={{ textTransform: 'none', height: 36 }}
                                                    disabled={isDisable}
                                                    loading={buttonLoading}
                                                    loadingPosition="start"
                                                    startIcon={<Save />}
                                                    onClick={() => handleSaveConflictSetting()}
                                                >
                                                    Save Changes
                                                </LoadingButton>
                                            </Box>
                                        )}
                                    </Fragment>
                                ) : (
                                    <Box m="auto" mt={4}>
                                        <EmptyData
                                            textAbove={'No data to display'}
                                            textBelow={'Please input number of revisions to create track plan'}
                                            content="Input Number of Revisions"
                                            onClick={() => handleOpenModal()}
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

export default TrackPlanConfig
