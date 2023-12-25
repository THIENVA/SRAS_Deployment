import React from 'react'

import { Edit } from '@mui/icons-material'
import { Avatar, Box, IconButton, Typography } from '@mui/material'

import IdImage from '~/assets/images/id.png'
import { AppStyles } from '~/constants/colors'

const PersonalInfo = ({ fullName, job, studyAt, idLink = undefined }) => {
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ color: AppStyles.colors['#333333'] }}>Publish name</Typography>
                <IconButton>
                    <Edit sx={{ color: AppStyles.colors['#004DFF'] }} />
                </IconButton>
            </Box>
            <Typography variant="h4" fontWeight={700}>
                {fullName}
            </Typography>
            <Typography mt={1.5}>{job}</Typography>
            <Typography mt={1.5}>{studyAt}</Typography>
            {idLink && (
                <Box mt={1.5} display="flex" alignItems="center">
                    <Avatar sx={{ width: 15, height: 15 }} src={IdImage} alt="id-image" />
                    <Box component="a" href={idLink} target="_blank" ml={1}>
                        {idLink}
                    </Box>
                </Box>
            )}
        </React.Fragment>
    )
}

export default PersonalInfo
