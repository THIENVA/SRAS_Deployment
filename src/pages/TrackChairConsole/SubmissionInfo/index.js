import { Fragment, useEffect, useState } from 'react'

import { CheckCircle } from '@mui/icons-material'
import { Box, Grid, Skeleton, Tooltip, Typography, Zoom } from '@mui/material'
import IDField from '~/components/IDField'
import ListItemForID from '~/components/ListItemForID'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'
import ModalInfo from '~/components/ModalInfo'

import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import QuestionsResponse from '~/pages/SubmissionSummary/QuestionsResponse'

const width = {
    itemWidth: 5,
    valueWidth: 7,
}
const SubmissionInfo = ({ open, handleClose, row }) => {
    const [paperInfo, setPaperInfo] = useState({})
    const [loading, setLoading] = useState(true)

    const { getSubmissionInfoSupport } = usePaperSubmission()

    useEffect(() => {
        const controller = new AbortController()

        const signal = controller.signal

        getSubmissionInfoSupport(row?.paperId, signal)
            .then((response) => {
                setPaperInfo(response.data ? response.data : {})
                setLoading(false)
            })
            .catch(() => {})
            .finally(() => {})

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'View Submission'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="md"
        >
            <Grid px={2} container spacing={2}>
                {loading ? (
                    <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                        {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                            <Grid item lg={12} mb={2} key={index}>
                                <Skeleton width="1" variant="rounded" height={38} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Fragment>
                        <ListItemForID itemName="Paper ID" itemWidth={width.itemWidth} valueWidth={width.valueWidth}>
                            <IDField id={paperInfo?.submissionId} showButton={true} />
                        </ListItemForID>
                        <ListItemPopupInfo
                            itemName="Paper title"
                            value={paperInfo?.title}
                            itemWidth={width.itemWidth}
                            valueWidth={width.valueWidth}
                        />
                        <ListItemPopupInfo
                            itemName="Abstract"
                            value={paperInfo?.abstract}
                            itemWidth={width.itemWidth}
                            valueWidth={width.valueWidth}
                        />
                        <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                            <Grid item xs={width.itemWidth}>
                                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                    Authors
                                </Typography>
                            </Grid>
                            <Grid item xs={width.valueWidth}>
                                {paperInfo?.listAuthors?.map((value, index) => {
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
                                        <Box key={index}>
                                            {value.authorOrganization ? (
                                                <Box>
                                                    <Box display="flex" alignItems="center">
                                                        <Tooltip
                                                            TransitionComponent={Zoom}
                                                            title={title}
                                                            placement="left"
                                                        >
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
                                                                {value.authorOrganization &&
                                                                    ' ( ' + value.authorOrganization + ' ) '}{' '}
                                                            </Typography>
                                                        </Tooltip>
                                                        {value.hasAccount && (
                                                            <Tooltip
                                                                TransitionComponent={Zoom}
                                                                title="Registered User"
                                                                placement="right"
                                                            >
                                                                <CheckCircle
                                                                    fontSize="small"
                                                                    sx={{
                                                                        ml: 1,
                                                                        color: AppStyles.colors['#027A9D'],
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        )}
                                                    </Box>
                                                    <Typography color={color}>
                                                        {'<' + value.authorEmail + '>'}
                                                    </Typography>
                                                </Box>
                                            ) : (
                                                <Box display="flex" alignItems="center">
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
                                                            {'<' + value.authorEmail + '>'}
                                                        </Typography>
                                                    </Tooltip>
                                                    {value.hasAccount && (
                                                        <Tooltip
                                                            TransitionComponent={Zoom}
                                                            title="Registered User"
                                                            placement="right"
                                                        >
                                                            <CheckCircle
                                                                fontSize="small"
                                                                sx={{ ml: 1, color: AppStyles.colors['#027A9D'] }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Box>
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
                                {paperInfo?.listPrimarySubjectArea?.map((value, index) => (
                                    <Box key={index} display="flex" alignItems="center">
                                        <Typography color="primary">{value.name}</Typography>
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
                                {paperInfo?.listSecondarySubjectArea?.map((value, index) => (
                                    <Box key={index} display="flex" alignItems="center">
                                        <Typography color="secondary">{value.name}</Typography>
                                    </Box>
                                ))}
                            </Grid>
                        </Grid>
                        <ListItemPopupInfo
                            itemName="Domain Conflicts"
                            value={paperInfo?.domainConflicts}
                            itemWidth={width.itemWidth}
                            valueWidth={width.valueWidth}
                        />
                        <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                            <Grid item xs={width.itemWidth}>
                                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                    Submission questions response
                                </Typography>
                            </Grid>
                            <Grid item xs={width.valueWidth}>
                                <QuestionsResponse
                                    questions={
                                        paperInfo?.submissionAnswer ? JSON.parse(paperInfo?.submissionAnswer) : []
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef' }}>
                            <Box>
                                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'] }}>
                                    Factors Disqualifying a Research Paper Abstract
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    mt: 1,
                                    backgroundColor: AppStyles.colors['#F5F5F5'],
                                    border: '1px solid #002b5d',
                                    p: 1,
                                    borderRadius: 1,
                                    // maxWidth: 600,
                                }}
                            >
                                <Typography
                                    component={'pre'}
                                    sx={{
                                        fontSize: 14,
                                        color: AppStyles.colors['#000F33'],
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {paperInfo?.criteria}
                                </Typography>
                            </Box>
                        </Grid>
                    </Fragment>
                )}
            </Grid>
        </ModalInfo>
    )
}

export default SubmissionInfo
