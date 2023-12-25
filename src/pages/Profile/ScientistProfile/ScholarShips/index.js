import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import TopicBlock from '../components/TopicBlock'
import { Box } from '@mui/material'

import CreateScholarshipModal from '../../ModalComponent/CreateScholarshipModal'
import EditScholarshipModal from '../../ModalComponent/EditScholarshipModal'
import ListScholarShip from './ScholarShips'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'

const ScholarShips = ({ scholarships, setScholarships, tabLoading, setTabLoading, userId }) => {
    const { loadingScholarship } = tabLoading
    const { getScholarships } = useProfile()
    const showSnackbar = useSnackbar()
    const [openScholarship, setOpenScholarship] = useState(false)
    const [openEditModal, setOpenEditModal] = useState({ open: false, education: null })

    const handleCloseEdit = () => setOpenEditModal({ open: false, education: null })

    const handleOpenEdit = (id) => {
        const getScholarship = scholarships.find((item) => item.id === id)
        if (getScholarship) {
            setOpenEditModal({ open: true, education: cloneDeep(getScholarship) })
        }
    }

    const handleOpenScholarship = () => setOpenScholarship(true)

    const handleCloseScholarship = () => setOpenScholarship(false)

    useEffect(() => {
        const firstController = new AbortController()

        if (loadingScholarship) {
            getScholarships(userId, firstController.signal)
                .then((response) => {
                    const getScholarships = response.data.result
                    setScholarships(getScholarships)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingScholarship: false }))
                })
        }
        return () => {
            firstController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loadingScholarship ? (
        <Loading height="40vh" />
    ) : (
        <React.Fragment>
            <TopicBlock title="Scholarship" num={scholarships.length} handleOpenModal={handleOpenScholarship} />
            {scholarships.length !== 0 && (
                <Box mt={3} sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)', px: 3, pb: 3, pt: 1, borderRadius: 3 }}>
                    <ListScholarShip handleOpenEdit={handleOpenEdit} scholarShips={scholarships} />
                </Box>
            )}
            {openScholarship && (
                <CreateScholarshipModal
                    scholarships={scholarships}
                    setScholarships={setScholarships}
                    userId={userId}
                    open={openScholarship}
                    handleClose={handleCloseScholarship}
                />
            )}

            {openEditModal.open && (
                <EditScholarshipModal
                    scholarships={scholarships}
                    setScholarships={setScholarships}
                    userId={userId}
                    open={openEditModal.open}
                    handleClose={handleCloseEdit}
                    getScholarship={openEditModal.education}
                />
            )}
        </React.Fragment>
    )
}

export default ScholarShips
