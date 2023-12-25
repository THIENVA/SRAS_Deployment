import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import moment from 'moment'

import TopicBlock from '../components/TopicBlock'
import { Box, Typography } from '@mui/material'

import CreateEmploymentModal from '../../ModalComponent/CreateEmploymentModal'
import EditEmploymentModal from '../../ModalComponent/EditEmploymentModal'
import CollapseLayout from '../Layout/CollapseLayout'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'
import { generateLink } from '~/utils/commonFunction'

const Employment = ({ employments, setEmployments, tabLoading, setTabLoading, userId }) => {
    const { loadingEmployment } = tabLoading
    const { getEmployment } = useProfile()
    const showSnackbar = useSnackbar()
    const [openEditModal, setOpenEditModal] = useState({ open: false, employment: null })
    const [openEmployment, setOpenEmployment] = useState(false)

    const handleOpenEmployment = () => setOpenEmployment(true)

    const handleCloseEmployment = () => setOpenEmployment(false)

    const handleCloseEdit = () => setOpenEditModal({ open: false, employment: null })

    const handleOpenEdit = (id) => {
        const getEmployment = employments.find((item) => item.employmentId === id)
        if (getEmployment) {
            setOpenEditModal({ open: true, employment: cloneDeep(getEmployment) })
        }
    }

    useEffect(() => {
        const firstController = new AbortController()

        if (loadingEmployment) {
            getEmployment(userId, firstController.signal)
                .then((response) => {
                    const getEmployments = response.data.result
                    setEmployments(getEmployments)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingEmployment: false }))
                })
        }
        return () => {
            firstController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <React.Fragment>
            <TopicBlock title="Employment" num={employments.length} handleOpenModal={handleOpenEmployment} />
            {loadingEmployment ? (
                <Loading height="40vh" />
            ) : (
                <React.Fragment>
                    {employments.map((employment) => (
                        <CollapseLayout
                            id={employment.employmentId}
                            key={employment.employmentId}
                            title={employment.organization.organizationName}
                            startDate={moment(new Date(employment.startDate)).format('MM/yyyy')}
                            endDate={moment(new Date(employment.endDate)).format('MM/yyyy')}
                            position={employment.employmentPosition}
                            tabName="Employment"
                            handleOpenEdit={handleOpenEdit}
                        >
                            <Box px={3} py={2} sx={{ borderBottom: '0.5px solid rgba(51, 51, 51, 0.6)' }}>
                                <Box mb={1}>
                                    <Typography gutterBottom variant="h6" fontWeight={500}>
                                        Organization identifiers
                                    </Typography>
                                    {employment.organization.organizationDescription && (
                                        <Typography gutterBottom variant="body1">
                                            {employment.organization.organizationDescription}
                                        </Typography>
                                    )}
                                    {employment.organization.organizationPhoneNumber && (
                                        <Typography gutterBottom variant="body1">
                                            {employment.organization.organizationPhoneNumber}
                                        </Typography>
                                    )}
                                    {employment.organization.organizationWebsite && (
                                        <Box
                                            component="a"
                                            href={generateLink(employment.organization.organizationWebsite)}
                                            target="_blank"
                                        >
                                            {employment.organization.organizationWebsite}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </CollapseLayout>
                    ))}
                    {openEmployment && (
                        <CreateEmploymentModal
                            open={openEmployment}
                            handleClose={handleCloseEmployment}
                            userId={userId}
                            employments={employments}
                            setEmployments={setEmployments}
                        />
                    )}
                    {openEditModal.open && (
                        <EditEmploymentModal
                            open={openEditModal.open}
                            handleClose={handleCloseEdit}
                            userId={userId}
                            employments={employments}
                            setEmployments={setEmployments}
                            getEmployment={openEditModal.employment}
                        />
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default Employment
