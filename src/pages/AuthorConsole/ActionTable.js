import React from 'react'

import { useHistory } from 'react-router-dom'

import { CheckBoxOutlined, EditOutlined, HighlightOff } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ActionTable = ({ row, conferenceId, handleOpenConfirmModal }) => {
    const history = useHistory()
    return (
        <React.Fragment>
            {row.original.actions ? (
                <React.Fragment>
                    {(row.original.actions.includes('EditSubmission') ||
                        row.original.actions.includes('DeleteSubmission') ||
                        row.original.actions.includes('EditConflicts')) && (
                        <Box>
                            <Typography
                                textAlign="center"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#444B52'],
                                }}
                            >
                                Submission:
                            </Typography>
                            <Box display="flex">
                                {row.original.actions.includes('EditSubmission') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push({
                                                pathname: `/conferences/${conferenceId}/submission/${row.original.trackId}/update-paper-submission/${row.original.submissionId}`,
                                                state: { trackName: row.original.trackName },
                                            })
                                        }
                                    >
                                        Edit Submission
                                    </Button>
                                )}
                                {row.original.actions.includes('EditConflicts') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<CheckBoxOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/edit-conflict/${row.original.submissionId}`
                                            )
                                        }
                                    >
                                        Edit Conflicts
                                    </Button>
                                )}
                            </Box>
                            {row.original.actions.includes('DeleteSubmission') && (
                                <Button
                                    variant="text"
                                    sx={{
                                        color: AppStyles.colors['#027A9D'],
                                        textTransform: 'none',
                                    }}
                                    startIcon={<HighlightOff />}
                                    onClick={() => handleOpenConfirmModal(row.original, 'submission')}
                                >
                                    Delete Submission
                                </Button>
                            )}
                        </Box>
                    )}
                    {(row.original.actions.includes('UploadSupplementary') ||
                        row.original.actions.includes('EditSupplementary') ||
                        row.original.actions.includes('DeleteSupplementary')) && (
                        <Box>
                            <Typography
                                textAlign="center"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#444B52'],
                                }}
                            >
                                Supplementary Material:
                            </Typography>
                            {(row.original.actions.includes('UploadSupplementary') ||
                                row.original.actions.includes('EditSupplementary')) && (
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/upload-supplementary/${row.original.submissionId}`
                                            )
                                        }
                                    >
                                        Upload Supplementary Material
                                    </Button>
                                </Box>
                            )}
                            <Box display="flex" justifyContent="space-evenly">
                                {row.original.actions.includes('DeleteSupplementary') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<HighlightOff />}
                                        onClick={() => handleOpenConfirmModal(row.original, 'supplementary')}
                                    >
                                        Delete Supplementary
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                    {(row.original.actions.includes('UploadRevision') ||
                        row.original.actions.includes('EditRevision') ||
                        row.original.actions.includes('DeleteRevision')) && (
                        <Box>
                            <Typography
                                textAlign="center"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#444B52'],
                                }}
                            >
                                Revision:
                            </Typography>
                            {row.original.actions.includes('UploadRevision') && (
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/submission/${row.original.submissionId}/revision`
                                            )
                                        }
                                    >
                                        Upload Revision
                                    </Button>
                                </Box>
                            )}
                            <Box display="flex" justifyContent="space-evenly">
                                {row.original.actions.includes('EditRevision') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/submission/${row.original.submissionId}/edit-revision`
                                            )
                                        }
                                    >
                                        Edit Revision
                                    </Button>
                                )}
                                {row.original.actions.includes('DeleteRevision') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<HighlightOff />}
                                        onClick={() => handleOpenConfirmModal(row.original, 'revision')}
                                    >
                                        Delete Revision
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                    {(row.original.actions.includes('CreateCameraReadySubmission') ||
                        row.original.actions.includes('DeleteCameraReadySubmission') ||
                        row.original.actions.includes('EditCameraReadySubmission')) && (
                        <Box>
                            <Typography
                                textAlign="center"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#444B52'],
                                }}
                            >
                                Camera Ready Submission:
                            </Typography>
                            {row.original.actions.includes('CreateCameraReadySubmission') && (
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/track/${row.original.trackId}/paper/${row.original.submissionId}/camera-ready`
                                            )
                                        }
                                    >
                                        Create Camera Ready
                                    </Button>
                                </Box>
                            )}
                            <Box display="flex" justifyContent="space-evenly">
                                {row.original.actions.includes('EditCameraReadySubmission') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/paper/${row.original.submissionId}/edit-camera-ready`
                                            )
                                        }
                                    >
                                        Edit Camera Ready
                                    </Button>
                                )}
                            </Box>
                            {row.original.actions.includes('DeleteCameraReadySubmission') && (
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<HighlightOff />}
                                        onClick={() => handleOpenConfirmModal(row.original, 'cameraReady')}
                                    >
                                        Delete Camera Ready
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    )}
                    {(row.original.actions.includes('UploadPresentation') ||
                        row.original.actions.includes('EditPresentation') ||
                        row.original.actions.includes('DeletePresentation')) && (
                        <Box>
                            <Typography
                                textAlign="center"
                                sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#444B52'],
                                }}
                            >
                                Presentation:
                            </Typography>
                            {row.original.actions.includes('UploadPresentation') && (
                                <Box display="flex" justifyContent="center">
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/submission/${row.original.submissionId}/presentation`
                                            )
                                        }
                                    >
                                        Upload Presentation
                                    </Button>
                                </Box>
                            )}
                            <Box display="flex" justifyContent="space-evenly">
                                {row.original.actions.includes('EditPresentation') && (
                                    <Button
                                        variant="text"
                                        sx={{
                                            color: AppStyles.colors['#027A9D'],
                                            textTransform: 'none',
                                        }}
                                        startIcon={<EditOutlined />}
                                        onClick={() =>
                                            history.push(
                                                `/conferences/${conferenceId}/submission/${row.original.submissionId}/edit-presentation`
                                            )
                                        }
                                    >
                                        Edit Presentation
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </React.Fragment>
            ) : (
                <Box display="flex" justifyContent="center" alignContent={'center'}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontSize: 14,
                            opacity: 0.5,

                            textAlign: 'center',
                        }}
                    >
                        There are currently no actions
                    </Typography>
                </Box>
            )}
        </React.Fragment>
    )
}

export default ActionTable
