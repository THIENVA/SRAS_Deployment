import { CheckCircle } from '@mui/icons-material'
import { Box, Tooltip, Typography, Zoom } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const UserSearched = ({ userAccount }) => {
    return (
        <Box mt={3} display="flex" alignItems="center" sx={{ border: '1px solid #cacfd9', p: 1, width: 400 }}>
            {/* <Avatar
                alt="Remy Sharp"
                src="https://randomuser.me/api/portraits/women/30.jpg"
                sx={{ width: 56, height: 56 }}
            /> */}
            <Box ml={2}>
                <Box display="flex" alignItems="center">
                    <Typography sx={{ color: AppStyles.colors['#002b5d'], fontSize: 18, fontWeight: 'bold' }}>
                        {userAccount.firstName} {userAccount.lastName}
                    </Typography>
                    <Tooltip TransitionComponent={Zoom} title="Registered User" placement="bottom-start">
                        <CheckCircle
                            fontSize="small"
                            sx={{ ml: 0.5, fontSize: 18, color: AppStyles.colors['#027A9D'] }}
                        />
                    </Tooltip>
                </Box>
                <Typography
                    sx={{
                        color: AppStyles.colors['#91a1bb'],
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: 'arial',
                    }}
                >
                    {userAccount.email}
                </Typography>
                <Typography
                    sx={{
                        mt: 0.5,
                        color: AppStyles.colors['#212529'],
                        fontSize: 15,
                        fontWeight: 500,
                        fontFamily: 'arial',
                    }}
                >
                    {userAccount.organization ? userAccount.organization : 'Organization: N/A'}
                </Typography>
            </Box>
        </Box>
    )
}

export default UserSearched
