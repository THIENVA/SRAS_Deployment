import { Box, Typography } from '@mui/material'
import UserBlockInfo from '~/pages/common/UserInfo/components/UserBlockInfo'

import { AppStyles } from '~/constants/colors'

const UserInfoSlideBar = ({ userId }) => {
    return (
        <Box sx={{ backgroundColor: AppStyles.colors['#E5EDFF'], borderRadius: 3 }} width="1">
            <Box p={4} display="flex" justifyContent="center" flexDirection="column">
                <Box sx={{ border: `1px solid ${AppStyles.colors['#004DFF']}`, p: 3, px: 2, borderRadius: 3 }}>
                    <Typography variant="body1" align="center">
                        Author ID
                    </Typography>
                    <Typography variant="h6" align="center" fontWeight={500}>
                        {userId}
                    </Typography>
                </Box>
                <UserBlockInfo style={{ mt: 2 }} content="hienbtse150763@fpt.edu.vn" title="Email" />
                <UserBlockInfo
                    style={{ mt: 2 }}
                    content="Personal website"
                    title="Website & social links"
                    isClickable={true}
                />
                <UserBlockInfo
                    style={{ mt: 2 }}
                    content="Scopus Author ID: 57185132600"
                    title="Other IDs"
                    isClickable={true}
                />
            </Box>
        </Box>
    )
}

export default UserInfoSlideBar
