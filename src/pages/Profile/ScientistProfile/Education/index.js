import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import TopicBlock from '../components/TopicBlock'
import { Box, Typography } from '@mui/material'

import CreateEducationModal from '../../ModalComponent/CreateEducationModal'
import EditEducationModal from '../../ModalComponent/EditEducationModal'
import CollapseLayout from '../Layout/CollapseLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'
import { generateLink } from '~/utils/commonFunction'

const Education = ({
    educations,
    setEducations,
    tabLoading,
    setTabLoading,
    userId,
    setAcademicDegree,
    academicDegree,
}) => {
    const { loadingEducation } = tabLoading
    const { getEducations, getAcademicDegree } = useProfile()
    const showSnackbar = useSnackbar()
    const [openEducation, setOpenEducation] = useState(false)
    const [openEditModal, setOpenEditModal] = useState({ open: false, education: null })

    const handleOpenEducation = () => setOpenEducation(true)

    const handleCloseEducation = () => setOpenEducation(false)

    const handleCloseEdit = () => setOpenEditModal({ open: false, education: null })

    const handleOpenEdit = (id) => {
        const getEducation = educations.find((item) => item.educationId === id)
        if (getEducation) {
            setOpenEditModal({ open: true, education: cloneDeep(getEducation) })
        }
    }

    useEffect(() => {
        const firstController = new AbortController()
        const secondController = new AbortController()

        const educationsGet = getEducations(userId, firstController.signal)
        const academicDegreeGet = getAcademicDegree(secondController.signal)

        if (loadingEducation) {
            Promise.all([educationsGet, academicDegreeGet])
                .then((response) => {
                    const getEducations = response[0].data.result
                    const getAcademicDegree = response[1].data.result
                    setEducations(getEducations)
                    setAcademicDegree(getAcademicDegree)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingEducation: false }))
                })
        }
        return () => {
            firstController.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            <TopicBlock title="Education" num={educations.length} handleOpenModal={handleOpenEducation} />
            {loadingEducation ? (
                <Loading height="40vh" />
            ) : (
                <React.Fragment>
                    {educations.map((item) => (
                        <CollapseLayout
                            id={item.educationId}
                            key={item.educationId}
                            title={item.educationalOrganization.organizationName}
                            startDate={item.startYear}
                            endDate={item.yearOfGraduation}
                            degree={item.degree}
                            degreeAbbreviation={item.degreeAbbreviation}
                            tabName="Education"
                            handleOpenEdit={handleOpenEdit}
                        >
                            <Box px={3} py={2} sx={{ borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}>
                                <Box mb={1}>
                                    <Typography gutterBottom variant="h6" fontWeight={500}>
                                        Organization identifiers
                                    </Typography>
                                    {item.educationalOrganization.organizationDescription && (
                                        <Typography gutterBottom variant="body1">
                                            {item.educationalOrganization.organizationDescription}
                                        </Typography>
                                    )}
                                    {item.educationalOrganization.organizationPhoneNumber && (
                                        <Typography gutterBottom variant="body1">
                                            {item.educationalOrganization.organizationPhoneNumber}
                                        </Typography>
                                    )}
                                    {item.educationalOrganization.organizationWebsite && (
                                        <Box
                                            component="a"
                                            href={generateLink(item.educationalOrganization.organizationWebsite)}
                                            target="_blank"
                                        >
                                            {item.educationalOrganization.organizationWebsite}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </CollapseLayout>
                    ))}
                    {openEducation && (
                        <CreateEducationModal
                            open={openEducation}
                            handleClose={handleCloseEducation}
                            userId={userId}
                            educations={educations}
                            setEducations={setEducations}
                            academicDegrees={academicDegree}
                        />
                    )}
                    {openEditModal.open && (
                        <EditEducationModal
                            open={openEditModal.open}
                            handleClose={handleCloseEdit}
                            userId={userId}
                            educations={educations}
                            setEducations={setEducations}
                            getEducation={openEditModal.education}
                            academicDegrees={academicDegree}
                        />
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default Education
