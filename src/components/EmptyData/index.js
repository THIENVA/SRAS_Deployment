import React from 'react'

import { Link } from 'react-router-dom'

import { Box, Button, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const EmptyData = ({ textAbove, textBelow, image, path = undefined, content = '', imgStyle, onClick, boxStyle }) => {
    return (
        <React.Fragment>
            <Box textAlign="center" sx={{ ...boxStyle }}>
                {image && (
                    <Box
                        mt={2}
                        component="img"
                        alt="sets_empty"
                        src={image}
                        sx={{
                            width: 300,
                            height: 150,
                            ...imgStyle,
                        }}
                    />
                )}

                <Typography fontSize={24} fontWeight={700} sx={{ color: AppStyles.colors['#000F33'] }}>
                    {textAbove}
                </Typography>
                <Typography fontSize={16} mt={1} sx={{ color: AppStyles.colors['#000F33'] }}>
                    {textBelow}
                </Typography>
                {content && (
                    <Button
                        sx={{
                            color: AppStyles.colors['#FFFFFF'],
                            borderRadius: 3,
                            px: 3,
                            py: 1,
                            mt: 3,
                            textTransform: 'none',
                            backgroundColor: '#1976d2',
                            ':hover': {
                                bgcolor: '#42A1EC',
                                color: 'white',
                            },
                        }}
                        component={path ? Link : Button}
                        to={path}
                        onClick={onClick}
                    >
                        <Typography>{content}</Typography>
                    </Button>
                )}
            </Box>
        </React.Fragment>
    )
}

export default EmptyData
