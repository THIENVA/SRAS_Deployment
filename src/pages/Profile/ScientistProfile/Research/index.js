import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import TopicBlock from '../components/TopicBlock'
import { Box } from '@mui/material'

import CreateResearchModal from '../../ModalComponent/CreateResearchModal'
import EditResearchModal from '../../ModalComponent/EditResearchModal'
import Researches from './Researches'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'

const Research = ({ researches, setResearches, tabLoading, setTabLoading, userId }) => {
    const { loadingResearch } = tabLoading
    const { getResearch } = useProfile()
    const showSnackbar = useSnackbar()
    const [openResearches, setOpenResearches] = useState(false)
    const [openEditModal, setOpenEditModal] = useState({ open: false, research: null })

    const handleCloseEdit = () => setOpenEditModal({ open: false, research: null })

    const handleOpenEdit = (id) => {
        const getResearch = researches.find((item) => item.researchDirectionId === id)
        if (getResearch) {
            setOpenEditModal({ open: true, research: cloneDeep(getResearch) })
        }
    }

    const handleOpenResearches = () => setOpenResearches(true)

    const handleCloseResearches = () => setOpenResearches(false)

    useEffect(() => {
        const firstController = new AbortController()

        if (loadingResearch) {
            getResearch(userId, firstController.signal)
                .then((response) => {
                    const getResearches = response.data.result
                    setResearches(getResearches)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingResearch: false }))
                })
        }
        return () => {
            firstController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loadingResearch ? (
        <Loading height="40vh" />
    ) : (
        <React.Fragment>
            <TopicBlock title="Research" num={researches.length} handleOpenModal={handleOpenResearches} />
            {researches.length !== 0 && (
                <Box mt={3} sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)', px: 3, py: 1, borderRadius: 3 }}>
                    <Researches researches={researches} handleOpenEdit={handleOpenEdit} />
                </Box>
            )}
            {openResearches && (
                <CreateResearchModal
                    researches={researches}
                    setResearches={setResearches}
                    userId={userId}
                    open={openResearches}
                    handleClose={handleCloseResearches}
                />
            )}
            {openEditModal.open && (
                <EditResearchModal
                    researches={researches}
                    setResearches={setResearches}
                    userId={userId}
                    open={openEditModal.open}
                    handleClose={handleCloseEdit}
                    getResearch={openEditModal.research}
                />
            )}
        </React.Fragment>
    )
}

export default Research
