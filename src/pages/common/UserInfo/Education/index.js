import React from 'react'

import { Box, Typography } from '@mui/material'
import TopicBlock from '~/pages/common/UserInfo/components/TopicBlock'

import CollapseLayout from '../Layout/CollapseLayout'

const Education = () => {
    return (
        <React.Fragment>
            <TopicBlock title="Education" num={2} nameModal="Add" />
            <CollapseLayout
                title="Sungkyunkwan University - Natural Sciences Campus: Suwon, Gyeonggi-do, KR"
                nameModal="Edit"
            >
                <Box px={3} py={2} sx={{ borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}>
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight={500} mb={1}>
                            Organization identifiers
                        </Typography>
                        <Typography variant="body1">GRID: grid.444812.f</Typography>
                        <Typography variant="body1">Ton Duc Thang University: Ho Chi Minh City, VN</Typography>
                        <Box component="a" href="https://www.tdtu.edu.vn/">
                            https://www.tdtu.edu.vn/
                        </Box>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight={500} mb={1}>
                            URL
                        </Typography>
                        <Box component="a" href="https://sites.google.com/view/dnmduc/">
                            https://sites.google.com/view/dnmduc/
                        </Box>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight={500} mb={1}>
                            Added
                        </Typography>
                        <Typography variant="body1">2018-10-23</Typography>
                    </Box>
                    <Box mb={3}>
                        <Typography variant="h5" fontWeight={500} mb={1}>
                            Last Modified
                        </Typography>
                        <Typography variant="body1">2022-08-21</Typography>
                    </Box>
                </Box>
            </CollapseLayout>
        </React.Fragment>
    )
}

export default Education
