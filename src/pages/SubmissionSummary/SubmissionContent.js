import { useState } from 'react'

import axios from 'axios'
import { saveAs } from 'file-saver'
import moment from 'moment'

import { CheckCircle, DownloadOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, Grid, Tooltip, Typography, Zoom } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import QuestionsResponse from './QuestionsResponse'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { APP_API_URL } from '~/config'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const width = {
    itemWidth: 4,
    valueWidth: 8,
}

const SubmissionContent = ({ values }) => {
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const showSnackbar = useSnackbar()
    const [submissionLoading, setSubmissionLoading] = useState(false)
    const [supplementLoading, setSupplementLoading] = useState(false)
    const [cameraLoading, setCameraLoading] = useState(false)
    const [presentationLoading, setPresentationLoading] = useState(false)
    const [copyrightLoading, setCopyrightLoading] = useState(false)
    const [revisionLoading, setRevisionLoading] = useState(false)

    const primarySubjectAreas = values?.subjectAreas?.filter((area) => area.isPrimary)
    const secondarySubjectAreas = values?.subjectAreas?.filter((area) => !area.isPrimary)

    const question = values.submissionQuestionsResponse ? JSON.parse(values.submissionQuestionsResponse) : []
    const handleDownloadSubmission = () => {
        setSubmissionLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${values?.paperId}/submission-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${values?.title}.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setSubmissionLoading(false)
            })
    }

    const handleDownloadCameraReady = () => {
        setCameraLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${values?.paperId}/download-camera-ready-file`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${values?.title}_CameraReady.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setCameraLoading(false)
            })
    }

    const handleDownloadPresentation = () => {
        setPresentationLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${values?.paperId}/download-presentation-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${values?.title}_Presentation.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setPresentationLoading(false)
            })
    }

    const handleDownloadCopyRight = () => {
        setCopyrightLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${values?.paperId}/download-copy-right-file`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${values?.title}_CopyRight.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setCopyrightLoading(false)
            })
    }

    const handleRevision = () => {
        setRevisionLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${values?.paperId}/download-revision-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${values?.title}_Revision.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setRevisionLoading(false)
            })
    }

    const handleSupplementary = () => {
        setSupplementLoading(true)
        axios({
            url: `${APP_API_URL}/submissions/${values?.paperId}/download-supplementary-material-files`,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                saveAs(response.data, `${values?.title}_Supplementary.zip`)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not download file. Please try again later',
                })
            })
            .finally(() => {
                setSupplementLoading(false)
            })
    }

    return (
        <Grid container spacing={2}>
            <ListItemPopupInfo
                itemName="Conference name"
                value={values.conferenceFullName && values.conferenceFullName}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            <ListItemPopupInfo
                itemName="Conference short name"
                value={values.conferenceShortName && values.conferenceShortName}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            <ListItemPopupInfo
                itemName="Track name"
                value={values.trackName && values.trackName}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            <ListItemForID
                itemName="Paper ID"
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
                outerStyle={{ boxShadow: 'none' }}
            >
                <IDField id={values?.paperId} showButton={true} />
            </ListItemForID>
            {/* <ListItemPopupInfo
                itemName="Paper ID"
                value={values?.paperId}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            /> */}
            <ListItemPopupInfo
                itemName="Paper title"
                value={values.title && values.title}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            <ListItemPopupInfo
                itemName="Abstract"
                value={values.abstract && values.abstract}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            <ListItemPopupInfo
                itemName="Created on"
                value={values.creationTime && moment(values.creationTime).format('MMMM Do YYYY, h:mm:ss A')}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            {/* <ListItemPopupInfo
                itemName="Last modified"
                value={
                    values.lastModificationTime && moment(values.lastModificationTime).format('MMMM Do YYYY, h:mm:ss A')
                }
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            /> */}
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>Authors</Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.authors?.map((value, index) => {
                        let color = ''
                        let title = ''
                        if (value?.isCorrespondingAuthor) {
                            title += 'Corresponding Author'
                        }

                        if (value?.isFirstAuthor) {
                            if (title.length > 0) {
                                title += ' | '
                            }
                            title += 'First Author'
                        }

                        if (value?.isPrimaryContact) {
                            if (title.length > 0) {
                                title += ' | '
                            }
                            title += 'Primary Contact'
                        }
                        if (value?.isCorrespondingAuthor === true) {
                            color = 'secondary'
                        } else if (value?.isFirstAuthor === true) {
                            color = 'primary'
                        }
                        return (
                            <Box key={index} display="flex" alignItems="center">
                                <Tooltip TransitionComponent={Zoom} title={title} placement="left">
                                    <Typography color={color}>
                                        {color || value.isPrimaryContact ? (
                                            <strong>
                                                {value.authorNamePrefix} {value.authorFullName}
                                            </strong>
                                        ) : (
                                            <Typography component="span">
                                                {value.authorNamePrefix} {value.authorFullName}
                                            </Typography>
                                        )}{' '}
                                        {value.authorOrganization && ' ( ' + value.authorOrganization + ' ) '}{' '}
                                        {'<' + value.authorEmail + '>'}
                                    </Typography>
                                </Tooltip>
                                {value.hasAccount && (
                                    <Tooltip
                                        TransitionComponent={Zoom}
                                        title="Registered User"
                                        placement="bottom-start"
                                    >
                                        <CheckCircle
                                            fontSize="small"
                                            sx={{ ml: 1, color: AppStyles.colors['#027A9D'] }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>
                        )
                    })}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Primary subject areas
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {primarySubjectAreas?.map((value, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <Typography color="primary">{value.subjectAreaName}</Typography>
                        </Box>
                    ))}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Secondary subject areas
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {secondarySubjectAreas?.map((value, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <Typography color="secondary">{value.subjectAreaName}</Typography>
                        </Box>
                    ))}
                </Grid>
            </Grid>

            <ListItemPopupInfo
                itemName="Domain Conflicts"
                value={values?.domainConflicts}
                itemWidth={width.itemWidth}
                valueWidth={width.valueWidth}
            />
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Conflicts of interest
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.conflictsOfInterest?.map((value, index) => (
                        <Box key={index}>
                            <Typography sx={{ color: AppStyles.colors['#495057'] }}>
                                {value.incumbentFullName} - {value.incumbentEmail}
                            </Typography>
                            <Box my={1} component="ul">
                                {value?.conflicts?.map((conflict, index) => (
                                    <Box component="li" mt={0.5} key={index}>
                                        {conflict}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Submission files
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.submissionFiles && (
                        <Box maxWidth={250} display="flex" flexDirection="column" alignItems="center">
                            {values?.submissionFiles?.map((value, index) => (
                                <Box key={index}>
                                    <Typography
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                            <LoadingButton
                                variant="outlined"
                                sx={{ textTransform: 'none', mt: 1, mb: 2 }}
                                startIcon={<DownloadOutlined />}
                                loading={submissionLoading}
                                loadingPosition="start"
                                onClick={() => handleDownloadSubmission()}
                            >
                                Download Submissions
                            </LoadingButton>
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Supplementary materials
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.supplementaryMaterialFiles && (
                        <Box maxWidth={250} display="flex" flexDirection="column" alignItems="center">
                            {values?.supplementaryMaterialFiles?.map((value, index) => (
                                <Box key={index}>
                                    <Typography
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                            <LoadingButton
                                variant="outlined"
                                sx={{ textTransform: 'none', mt: 1, mb: 2 }}
                                startIcon={<DownloadOutlined />}
                                loading={supplementLoading}
                                loadingPosition="start"
                                onClick={() => handleSupplementary()}
                            >
                                Download Supplementary
                            </LoadingButton>
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Revision files {values?.submittedRevisionNo ? 'No.' + values?.submittedRevisionNo : ''}
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.revisionFiles && (
                        <Box maxWidth={250} display="flex" flexDirection="column" alignItems="center">
                            {values?.revisionFiles?.map((value, index) => (
                                <Box key={index}>
                                    <Typography
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                            <LoadingButton
                                variant="outlined"
                                sx={{ textTransform: 'none', mt: 1, mb: 2 }}
                                startIcon={<DownloadOutlined />}
                                loading={revisionLoading}
                                loadingPosition="start"
                                onClick={() => handleRevision()}
                            >
                                Download Revision
                            </LoadingButton>
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Camera Ready files
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.cameraReadyFiles && (
                        <Box maxWidth={250} display="flex" flexDirection="column" alignItems="center">
                            {values?.cameraReadyFiles?.map((value, index) => (
                                <Box key={index}>
                                    <Typography
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                            <LoadingButton
                                variant="outlined"
                                sx={{ textTransform: 'none', mt: 1, mb: 2 }}
                                startIcon={<DownloadOutlined />}
                                loading={cameraLoading}
                                loadingPosition="start"
                                onClick={() => handleDownloadCameraReady()}
                            >
                                Download Camera Ready
                            </LoadingButton>
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>Copyright file</Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.copyRightFiles && (
                        <Box maxWidth={250} display="flex" flexDirection="column" alignItems="center">
                            {values?.copyRightFiles?.map((value, index) => (
                                <Box key={index}>
                                    <Typography
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                            <LoadingButton
                                variant="outlined"
                                sx={{ textTransform: 'none', mt: 1, mb: 2 }}
                                startIcon={<DownloadOutlined />}
                                loading={copyrightLoading}
                                loadingPosition="start"
                                onClick={() => handleDownloadCopyRight()}
                            >
                                Download Copyright
                            </LoadingButton>
                        </Box>
                    )}
                </Grid>
            </Grid>
            <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                <Grid item xs={width.itemWidth}>
                    <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                        Presentation files
                    </Typography>
                </Grid>
                <Grid item xs={width.valueWidth}>
                    {values?.presentationFiles && (
                        <Box maxWidth={250} display="flex" flexDirection="column" alignItems="center">
                            {values?.presentationFiles?.map((value, index) => (
                                <Box key={index}>
                                    <Typography
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {value}
                                    </Typography>
                                </Box>
                            ))}
                            <LoadingButton
                                variant="outlined"
                                sx={{ textTransform: 'none', mt: 1, mb: 2 }}
                                startIcon={<DownloadOutlined />}
                                loading={presentationLoading}
                                loadingPosition="start"
                                onClick={() => handleDownloadPresentation()}
                            >
                                Download Presentation
                            </LoadingButton>
                        </Box>
                    )}
                </Grid>
            </Grid>
            {roleName !== ROLES_NAME.REVIEWER && (
                <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                    <Grid item xs={width.itemWidth}>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                            Submission questions response
                        </Typography>
                    </Grid>
                    <Grid item xs={width.valueWidth}>
                        {/* Render Submission Response Here */}
                        <QuestionsResponse questions={question} />
                    </Grid>
                </Grid>
            )}
        </Grid>
    )
}

export default SubmissionContent
