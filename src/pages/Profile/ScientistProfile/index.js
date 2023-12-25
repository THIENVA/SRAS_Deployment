import React, { useEffect, useState } from 'react'

import { useHistory } from 'react-router-dom'

import { AccountCircle } from '@mui/icons-material'
import { Box, Button, Container, Grid, Typography } from '@mui/material'
import Header from '~/components/Common/Header'
import PrimaryEmailModal from '~/components/PrimaryEmailModal'
import TabPanelCompo from '~/components/TabPanelCompo'
import UserInfoSlideBar from '~/pages/Profile/ScientistProfile/components/UserInfoSllideBar'

import About from './About'
import AcademicProfile from './AcademicProfile'
import Awards from './Awards'
import Education from './Education'
import Employment from './Employment'
import Publication from './Publication'
import Research from './Research'
import ScholarShips from './ScholarShips'
import Skills from './Skills'
import TabSection from './TabSection'
import Workplace from './WorkPlace'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import userIcon from '~/assets/images/user-icon.png'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'
import Loading from '~/pages/Loading'

const ScientistProfile = () => {
    const { userId, country } = useAppSelector((state) => state.auth)
    const showSnackbar = useSnackbar()
    const { checkHasProfile, getGeneralProfile } = useProfile()
    const history = useHistory()
    const [value, setValue] = useState(0)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)
    const [workPlace, setWorkPlace] = useState(null)
    const [educations, setEducations] = useState([])
    const [employments, setEmployments] = useState([])
    const [scholarships, setScholarships] = useState([])
    const [skills, setSkills] = useState([])
    const [awards, setAwards] = useState([])
    const [researches, setResearches] = useState([])
    const [publications, setPublications] = useState([])
    const [academicDegree, setAcademicDegree] = useState([])
    const [workTypes, setWorkTypes] = useState([])
    const [tabLoading, setTabLoading] = useState({
        loadingWorkplace: true,
        loadingEducation: true,
        loadingEmployment: true,
        loadingScholarship: true,
        loadingAward: true,
        loadingSkill: true,
        loadingResearch: true,
        loadingPublication: true,
    })
    const [openPrimaryEmailModal, setOpenPrimaryEmailModal] = useState(false)

    const handleOpenPrimaryEmail = () => setOpenPrimaryEmailModal(true)

    const handleClosePrimaryEmail = () => setOpenPrimaryEmailModal(false)

    const handleChange = (_, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        const firstController = new AbortController()
        const secondController = new AbortController()

        checkHasProfile(userId, firstController.firstSignal)
            .then((response) => {
                const hasProfile = response.data
                if (hasProfile) {
                    getGeneralProfile(userId, secondController.secondSignal)
                        .then((response) => {
                            const profileUser = response.data.result
                            setProfile(profileUser)
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong. Please try again later',
                })
                setLoading(false)
            })
        return () => {
            firstController.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            <Header />
            {loading ? (
                <Loading height="80vh" />
            ) : profile ? (
                <Container sx={{ mt: 5 }} maxWidth="lg">
                    <Grid container columnSpacing={3}>
                        <Grid item md={3.5}>
                            <UserInfoSlideBar
                                userId={userId}
                                otherIds={profile.otherIds}
                                country={country}
                                websiteAndSocialLinks={profile.websiteAndSocialLinks}
                                profile={profile}
                                setProfile={setProfile}
                                email={profile.primaryEmail}
                            />
                        </Grid>
                        <Grid container item md={8.5} height="1">
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
                                <Grid item md={12} container px={4}>
                                    <Grid item md={12}>
                                        <AcademicProfile
                                            academicFunction={profile.academicFunction}
                                            currentDegree={profile.currentDegree}
                                            academic={profile.academic}
                                            publishName={profile.publishName}
                                            adminPositionFunction={profile.adminPositionFunction}
                                            scientistTitle={profile.scientistTitle}
                                            orcid={profile.orcid}
                                            degree={profile.current}
                                            alsoKnownAs={JSON.parse(profile.alsoKnownAs)}
                                            setProfile={setProfile}
                                            profile={profile}
                                            userId={userId}
                                            firstName={profile.firstName}
                                            middleName={profile.middleName}
                                            lastName={profile.lastName}
                                        />
                                    </Grid>
                                </Grid>
                                <TabSection value={value} handleChange={handleChange} />
                            </Box>
                            <Box width="1">
                                <TabPanelCompo>
                                    {(() => {
                                        switch (value) {
                                            case 0:
                                                return (
                                                    <About
                                                        gender={profile.gender}
                                                        introduction={profile.introduction}
                                                        dateOfBirth={profile.dateOfBirth}
                                                        mobilePhone={profile.mobilePhone}
                                                        fax={profile.fax}
                                                        phoneNumber={profile.phoneNumber}
                                                        homeAddress={profile.homeAddress}
                                                        userId={userId}
                                                        profile={profile}
                                                        setProfile={setProfile}
                                                    />
                                                )
                                            case 1:
                                                return (
                                                    <Workplace
                                                        workPlace={workPlace}
                                                        setWorkPlace={setWorkPlace}
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                    />
                                                )
                                            case 2:
                                                return (
                                                    <Education
                                                        educations={educations}
                                                        setEducations={setEducations}
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        publishName={profile.publishName}
                                                        setAcademicDegree={setAcademicDegree}
                                                        academicDegree={academicDegree}
                                                    />
                                                )
                                            case 3:
                                                return (
                                                    <Employment
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        employments={employments}
                                                        setEmployments={setEmployments}
                                                        publishName={profile.publishName}
                                                    />
                                                )
                                            case 4:
                                                return (
                                                    <ScholarShips
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        scholarships={scholarships}
                                                        setScholarships={setScholarships}
                                                    />
                                                )
                                            case 5:
                                                return (
                                                    <Awards
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        awards={awards}
                                                        setAwards={setAwards}
                                                    />
                                                )
                                            case 6:
                                                return (
                                                    <Skills
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        skills={skills}
                                                        setSkills={setSkills}
                                                    />
                                                )
                                            case 7:
                                                return (
                                                    <Research
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        researches={researches}
                                                        setResearches={setResearches}
                                                    />
                                                )
                                            case 8:
                                                return (
                                                    <Publication
                                                        tabLoading={tabLoading}
                                                        setTabLoading={setTabLoading}
                                                        userId={userId}
                                                        publications={publications}
                                                        setPublications={setPublications}
                                                        workTypes={workTypes}
                                                        setWorkTypes={setWorkTypes}
                                                    />
                                                )
                                        }
                                    })()}
                                </TabPanelCompo>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            ) : (
                <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" height="75vh">
                    <Box
                        component="img"
                        src={userIcon}
                        alt="user icon"
                        sx={{ objectFit: 'cover', width: 300, height: 300, mb: 2 }}
                    />
                    <Box display="flex">
                        <Typography color="error" variant="h6">
                            You don&apos;t have scientist profile yet. please create your profile.
                        </Typography>
                        <Button
                            size="small"
                            sx={{ ml: 2 }}
                            startIcon={<AccountCircle />}
                            variant="contained"
                            onClick={handleOpenPrimaryEmail}
                        >
                            Create profile
                        </Button>
                    </Box>
                    <Button size="small" sx={{ mt: 2 }} variant="outlined" onClick={() => history.goBack()}>
                        Go back
                    </Button>
                </Box>
            )}
            {openPrimaryEmailModal && (
                <PrimaryEmailModal open={openPrimaryEmailModal} handleClose={handleClosePrimaryEmail} />
            )}
        </React.Fragment>
    )
}

export default ScientistProfile
