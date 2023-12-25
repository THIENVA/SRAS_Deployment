import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import TopicBlock from '../components/TopicBlock'
import { Box } from '@mui/material'

import CreateAwardModal from '../../ModalComponent/CreateAwardModal'
import EditAwardModal from '../../ModalComponent/EditAwardModal'
import ListAward from './Awards'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'

const Awards = ({ awards, setAwards, tabLoading, setTabLoading, userId }) => {
    const { loadingAward } = tabLoading
    const { getAwards } = useProfile()
    const showSnackbar = useSnackbar()
    const [openAwards, setOpenAwards] = useState(false)
    const [openEditModal, setOpenEditModal] = useState({ open: false, award: null })

    const handleCloseEdit = () => setOpenEditModal({ open: false, award: null })

    const handleOpenEdit = (id) => {
        const getAward = awards.find((item) => item.id === id)
        if (getAward) {
            setOpenEditModal({ open: true, award: cloneDeep(getAward) })
        }
    }

    const handleOpenAwards = () => setOpenAwards(true)

    const handleCloseAwards = () => setOpenAwards(false)

    useEffect(() => {
        const firstController = new AbortController()

        if (loadingAward) {
            getAwards(userId, firstController.signal)
                .then((response) => {
                    const getAwards = response.data.result
                    setAwards(getAwards)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingAward: false }))
                })
        }
        return () => {
            firstController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loadingAward ? (
        <Loading height="40vh" />
    ) : (
        <React.Fragment>
            <TopicBlock title="Awards" num={awards.length} handleOpenModal={handleOpenAwards} />
            {awards.length !== 0 && (
                <Box mt={3} sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)', px: 3, pb: 3, pt: 1, borderRadius: 3 }}>
                    <ListAward handleOpenEdit={handleOpenEdit} awards={awards} />
                </Box>
            )}
            {openAwards && (
                <CreateAwardModal
                    awards={awards}
                    setAwards={setAwards}
                    userId={userId}
                    open={openAwards}
                    handleClose={handleCloseAwards}
                />
            )}
            {openEditModal.open && (
                <EditAwardModal
                    awards={awards}
                    setAwards={setAwards}
                    userId={userId}
                    open={openEditModal.open}
                    handleClose={handleCloseEdit}
                    getAward={openEditModal.award}
                />
            )}
        </React.Fragment>
    )
}

export default Awards
