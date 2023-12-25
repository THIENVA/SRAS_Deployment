import React from 'react'

import { useHistory } from 'react-router-dom'

import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const FinishInvite = ({ infoField }) => {
    const { firstName, lastName, middleName, email } = infoField
    const history = useHistory()
    return (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                    Finish
                </Typography>
            </Box>
            <Box
                sx={{
                    mt: 3,
                    px: 2,
                    py: 3,
                    boxShadow: '#daebfe 0px 0px 0px 3px',
                    backgroundColor: AppStyles.colors['#edf5ff'],
                }}
            >
                <Typography>
                    User {firstName} {middleName && middleName} {lastName} {'<'}
                    {email}
                    {'>'} has been invited!
                </Typography>
            </Box>
            <Box
                sx={{
                    mt: 5,
                    px: 2,
                    py: 3,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                    backgroundColor: AppStyles.colors['#F8F9FA'],
                }}
            />
        </React.Fragment>
    )
}

export default FinishInvite
