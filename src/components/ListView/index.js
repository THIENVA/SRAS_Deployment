import React from 'react'

import { Box, Divider, List, ListItem, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ListView = ({ list, header, minHeight = 400, style, emptyText }) => {
    return (
        <Box
            sx={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px' }}
            borderRadius={2}
        >
            <Box sx={{ boxShadow: '0 1px 2px 0 rgba(0,0,0,.08)' }}>
                <Box py={2} px={3}>
                    <Typography sx={{ fontSize: 16, color: AppStyles.colors['#002b5d'], fontWeight: 600 }}>
                        {header}
                    </Typography>
                </Box>
            </Box>
            {list.length > 0 ? (
                <List style={{ ...style }}>
                    {list.map((item, index) => (
                        <Box key={index}>
                            <ListItem>
                                <Typography sx={{ p: 1, fontSize: 16, color: AppStyles.colors['#1F2328'] }}>
                                    {item}
                                </Typography>
                            </ListItem>
                            <Divider />
                        </Box>
                    ))}
                </List>
            ) : (
                <Box sx={{ position: 'relative', minHeight: minHeight, ...style }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontSize: 16,
                            opacity: 0.5,
                            margin: 0,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                    >
                        {emptyText}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default ListView
