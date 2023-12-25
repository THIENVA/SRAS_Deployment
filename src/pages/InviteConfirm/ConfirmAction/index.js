import React from 'react'

import { Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ConfirmAction = ({ confirmType, handleOpenConfirmModal, fontSize }) => {
    return (
        <React.Fragment>
            {confirmType === '' && (
                <React.Fragment>
                    <Typography
                        component="span"
                        sx={{
                            fontSize: fontSize,
                            color: AppStyles.colors['#027A9D'],
                            ':hover': {
                                textDecoration: 'underline',
                            },
                            cursor: 'pointer',
                        }}
                        onClick={() => handleOpenConfirmModal(2)}
                    >
                        Accept
                    </Typography>{' '}
                    <Typography component="span" sx={{ fontSize: fontSize }}>
                        or
                    </Typography>{' '}
                    <Typography
                        component="span"
                        sx={{
                            fontSize: fontSize,
                            color: AppStyles.colors['#027A9D'],
                            ':hover': {
                                textDecoration: 'underline',
                            },
                            cursor: 'pointer',
                        }}
                        onClick={() => handleOpenConfirmModal(1)}
                    >
                        Decline
                    </Typography>
                </React.Fragment>
            )}
            {confirmType === 'Accept' && (
                <Typography
                    component="span"
                    sx={{
                        fontSize: fontSize,
                        color: AppStyles.colors['#027A9D'],
                        ':hover': {
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                    onClick={() => handleOpenConfirmModal(1)}
                >
                    Decline
                </Typography>
            )}
            {confirmType === 'Decline' && (
                <Typography
                    component="span"
                    sx={{
                        fontSize: fontSize,
                        color: AppStyles.colors['#027A9D'],
                        ':hover': {
                            textDecoration: 'underline',
                        },
                        cursor: 'pointer',
                    }}
                    onClick={() => handleOpenConfirmModal(2)}
                >
                    Accept
                </Typography>
            )}
        </React.Fragment>
    )
}

export default ConfirmAction
