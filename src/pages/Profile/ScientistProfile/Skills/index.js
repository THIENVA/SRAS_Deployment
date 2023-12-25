import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import TopicBlock from '../components/TopicBlock'
import { Box } from '@mui/material'

import CreateSkillModal from '../../ModalComponent/CreateSkillModal'
import EditSkillModal from '../../ModalComponent/EditSkillModal'
import Skill from './Skill'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'

const Skills = ({ skills, setSkills, tabLoading, setTabLoading, userId }) => {
    const { loadingSkill } = tabLoading
    const { getSkills } = useProfile()
    const showSnackbar = useSnackbar()
    const [openSkills, setOpenSkills] = useState(false)
    const [openEditModal, setOpenEditModal] = useState({ open: false, skill: null })

    const handleCloseEdit = () => setOpenEditModal({ open: false, skill: null })

    const handleOpenEdit = (id) => {
        const getSkill = skills.find((item) => item.id === id)
        if (getSkill) {
            setOpenEditModal({ open: true, skill: cloneDeep(getSkill) })
        }
    }

    const handleOpenSkills = () => setOpenSkills(true)

    const handleCloseSkills = () => setOpenSkills(false)

    useEffect(() => {
        const firstController = new AbortController()

        if (loadingSkill) {
            getSkills(userId, firstController.signal)
                .then((response) => {
                    const getSkills = response.data.result
                    setSkills(getSkills)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingSkill: false }))
                })
        }
        return () => {
            firstController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loadingSkill ? (
        <Loading height="40vh" />
    ) : (
        <React.Fragment>
            <TopicBlock title="Skills" num={skills.length} handleOpenModal={handleOpenSkills} />
            {skills.length !== 0 && (
                <Box mt={3} sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)', px: 3, pb: 3, pt: 1, borderRadius: 3 }}>
                    {skills.map((skill, index) => (
                        <Skill {...skill} key={skill.id} index={index} id={skill.id} handleOpenEdit={handleOpenEdit} />
                    ))}
                </Box>
            )}
            {openSkills && (
                <CreateSkillModal
                    skills={skills}
                    setSkills={setSkills}
                    userId={userId}
                    open={openSkills}
                    handleClose={handleCloseSkills}
                />
            )}
            {openEditModal.open && (
                <EditSkillModal
                    skills={skills}
                    setSkills={setSkills}
                    userId={userId}
                    open={openEditModal.open}
                    handleClose={handleCloseEdit}
                    getSkill={openEditModal.skill}
                />
            )}
        </React.Fragment>
    )
}

export default Skills
