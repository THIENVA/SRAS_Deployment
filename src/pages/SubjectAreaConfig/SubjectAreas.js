import React from 'react'

import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import CardCompo from '~/components/Card'

import { AppStyles } from '~/constants/colors'

const SubjectAreas = ({ subjectAreas, handleClickOpenAlertPopup, openEditSubjectAreaHandler, isAdd }) => {
    return (
        <React.Fragment>
            {subjectAreas.map((subjectAreaItem) => (
                <CardCompo
                    key={subjectAreaItem.id}
                    cardStyle={{ mt: 1.5 }}
                    cardContentStyle={{
                        px: 2,
                        py: '8px !important',
                        backgroundColor: (theme) =>
                            `${
                                isAdd.id === subjectAreaItem.id
                                    ? theme.palette.primary.main
                                    : AppStyles.colors['#FAFBFF']
                            }`,
                        color: `${
                            isAdd.id === subjectAreaItem.id
                                ? AppStyles.colors['#FAFBFF']
                                : AppStyles.colors['#000000de']
                        }`,
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{subjectAreaItem.name}</Typography>
                        <Box display="flex" alignItems="center">
                            {subjectAreaItem.isEditable && (
                                <IconButton onClick={() => openEditSubjectAreaHandler(subjectAreaItem.id)}>
                                    <Edit
                                        sx={{
                                            color: `${
                                                isAdd.id === subjectAreaItem.id
                                                    ? AppStyles.colors['#FAFBFF']
                                                    : AppStyles.colors['#000000de']
                                            }`,
                                        }}
                                    />
                                </IconButton>
                            )}
                            {subjectAreaItem.isDeletable && (
                                <IconButton
                                    sx={{ mr: 1.5 }}
                                    onClick={() => handleClickOpenAlertPopup(subjectAreaItem.id)}
                                >
                                    <Delete
                                        sx={{
                                            color: `${
                                                isAdd.id === subjectAreaItem.id
                                                    ? AppStyles.colors['#FAFBFF']
                                                    : AppStyles.colors['#000000de']
                                            }`,
                                        }}
                                    />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                </CardCompo>
            ))}
        </React.Fragment>
    )
}

export default SubjectAreas
