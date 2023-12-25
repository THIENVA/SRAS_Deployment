import React from 'react'

import { isEmpty } from 'lodash'

import { Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'
import { generateLink } from '~/utils/commonFunction'

const UserBlockInfo = ({ isClickable = false, title, content, style, canEditing = true, handleOpenModal }) => {
    const isEmptyContent = isEmpty(content)

    return (
        <Box sx={{ border: `1px solid ${AppStyles.colors['#004DFF']}`, borderRadius: 3, overflow: 'hidden', ...style }}>
            <Box
                p={1.5}
                sx={{ borderBottom: !isEmptyContent ? `1px solid ${AppStyles.colors['#004DFF']}` : 'none' }}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography fontWeight={500}>{title}</Typography>
                {canEditing && (
                    <IconButton size="small" onClick={handleOpenModal}>
                        <Edit fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ backgroundColor: AppStyles.colors['#FFFFFF'], p: isEmptyContent ? 0 : 1.5 }}>
                {isClickable ? (
                    <React.Fragment>
                        {content.map((item, index) => (
                            <Box
                                component={'a'}
                                sx={{ mb: 1, display: 'block' }}
                                key={index}
                                href={generateLink(item.linkUrl)}
                                target="_blank"
                            >
                                {item.linkTitle}
                            </Box>
                        ))}
                    </React.Fragment>
                ) : (
                    <Typography variant="body2">{content}</Typography>
                )}
            </Box>
        </Box>
    )
}

export default UserBlockInfo
