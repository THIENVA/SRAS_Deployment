import React, { useState } from 'react'

import { Box, Container, Grid } from '@mui/material'
import TabPanelCompo from '~/components/TabPanelCompo'
import UserInfoSlideBar from '~/pages/common/UserInfo/components/UserInfoSllideBar'

import AvatarInfo from './Avatar'
import PersonalInfo from './PersonalInfo'
import TabSection from './TabSection'

import { AppStyles } from '~/constants/colors'
import tabs from '~/constants/tabs'

const Home = () => {
    const [value, setValue] = useState(0)

    const handleChange = (_, newValue) => {
        setValue(newValue)
    }
    return (
        <React.Fragment>
            <Container maxWidth="lg">
                <Grid container columnSpacing={3}>
                    <Grid item md={3.5}>
                        <UserInfoSlideBar />
                    </Grid>
                    <Grid container item md={8.5} mt={5} height="1">
                        <Box
                            sx={{
                                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)',
                                borderRadius: '0px 0px 6px 6px',
                                backgroundColor: AppStyles.colors['#FFFFFF'],
                            }}
                            width="1"
                        >
                            <Box
                                height={10}
                                sx={{
                                    borderRadius: '4px 4px 0px 0px',
                                    backgroundColor: AppStyles.colors['#003ECC'],
                                    mb: 5,
                                }}
                            ></Box>
                            <Grid item md={12} container columnSpacing={2} px={4}>
                                <Grid item md={3}>
                                    <AvatarInfo />
                                </Grid>
                                <Grid item md={9}>
                                    <PersonalInfo
                                        fullName="Nguyen Dang Truong Anh"
                                        job="Academic Mentor"
                                        studyAt="FPT university"
                                        idLink="https://orcid.org/0009-0004-8556-9649"
                                    />
                                </Grid>
                            </Grid>
                            <TabSection value={value} handleChange={handleChange} />
                        </Box>
                        <Box width="1">
                            {tabs.map((tab, index) => (
                                <TabPanelCompo key={index} value={value} index={index}>
                                    {tab.element}
                                </TabPanelCompo>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}

export default Home
