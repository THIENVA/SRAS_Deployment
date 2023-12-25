import React from 'react'

import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import CardCompo from '~/components/Card'

import { AppStyles } from '~/constants/colors'

const Tracks = ({ tracks, handleClickOpenAlertPopup, openEditTrackHandler, isAdd }) => {
    return (
        <React.Fragment>
            {tracks.map((trackItem) => (
                <CardCompo
                    key={trackItem.id}
                    cardStyle={{ mt: 1.5 }}
                    cardContentStyle={{
                        px: 2,
                        py: '8px !important',
                        backgroundColor: (theme) =>
                            `${isAdd.id === trackItem.id ? theme.palette.primary.main : AppStyles.colors['#FAFBFF']}`,
                        color: `${
                            isAdd.id === trackItem.id ? AppStyles.colors['#FAFBFF'] : AppStyles.colors['#000000de']
                        }`,
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{trackItem.name}</Typography>
                        <Box display="flex" alignItems="center">
                            {trackItem.isEditable && (
                                <IconButton onClick={() => openEditTrackHandler(trackItem.id)}>
                                    <Edit
                                        sx={{
                                            color: `${
                                                isAdd.id === trackItem.id
                                                    ? AppStyles.colors['#FAFBFF']
                                                    : AppStyles.colors['#000000de']
                                            }`,
                                        }}
                                    />
                                </IconButton>
                            )}
                            {trackItem.isDeletable && (
                                <IconButton sx={{ mr: 1.5 }} onClick={() => handleClickOpenAlertPopup(trackItem.id)}>
                                    <Delete
                                        sx={{
                                            color: `${
                                                isAdd.id === trackItem.id
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

export default Tracks
