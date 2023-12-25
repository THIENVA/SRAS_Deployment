import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'

import TopicBlock from '../components/TopicBlock'
import { Box, Typography } from '@mui/material'

import CreatePublicationModal from '../../ModalComponent/CreatePublicationModal'
import EditPublicationModal from '../../ModalComponent/EditPublicationModal'
import PublicationCollapse from './PublicationCollapse'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'
import { generateLink } from '~/utils/commonFunction'

const Publication = ({ publications, setPublications, tabLoading, setTabLoading, userId, workTypes, setWorkTypes }) => {
    const { loadingPublication } = tabLoading
    const { getPublications, getWorkType } = useProfile()
    const showSnackbar = useSnackbar()
    const [openPublications, setOpenPublications] = useState(false)
    const [openEditModal, setOpenEditModal] = useState({ open: false, publication: null })

    const handleCloseEdit = () => setOpenEditModal({ open: false, publication: null })

    const handleOpenEdit = (id) => {
        const getPublications = publications.find((item) => item.publicationId === id)
        if (getPublications) {
            setOpenEditModal({ open: true, publication: cloneDeep(getPublications) })
        }
    }

    const handleOpenPublications = () => setOpenPublications(true)

    const handleClosePublications = () => setOpenPublications(false)

    useEffect(() => {
        const firstController = new AbortController()
        const secondController = new AbortController()

        const publicationsGet = getPublications(userId, firstController.signal)
        const workTypesGet = getWorkType(secondController.signal)

        if (loadingPublication) {
            Promise.all([publicationsGet, workTypesGet])
                .then((response) => {
                    const getPublications = response[0].data.result
                    const getWorkTypes = response[1].data.result
                    setPublications(getPublications)
                    setWorkTypes(getWorkTypes)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingPublication: false }))
                })
        }
        return () => {
            firstController.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loadingPublication ? (
        <Loading height="40vh" />
    ) : (
        <React.Fragment>
            <TopicBlock title="Publications" num={publications.length} handleOpenModal={handleOpenPublications} />
            {publications.map((publication) => (
                <PublicationCollapse
                    key={publication.publicationId}
                    title={publication.publicationName}
                    contributors={publication.contributors}
                    doiTitle={publication.doi}
                    doiLink={publication.dOILink}
                    date={new Date(publication.publicationDate).toLocaleDateString('en-GB')}
                    publisher={publication.publisher}
                    tabName="Publication"
                    workTypeName={publication.workTypeName}
                    id={publication.publicationId}
                    handleOpenEdit={handleOpenEdit}
                >
                    <Box px={3} py={2}>
                        {publication.publicationLinks.length !== 0 && (
                            <React.Fragment>
                                <Typography fontWeight={500} variant="subtitle1">
                                    URL
                                </Typography>
                                {publication.publicationLinks.map((publicationLink) => (
                                    <Box key={publicationLink.id} display="flex" alignItems="baseline">
                                        <Typography mr={0.5}>{publicationLink.label}: </Typography>
                                        <Box component="a" href={generateLink(publicationLink.link)} target="_blank">
                                            {publicationLink.link}
                                        </Box>
                                    </Box>
                                ))}
                            </React.Fragment>
                        )}
                        <Box mt={2}>
                            <Typography gutterBottom fontWeight={500} variant="subtitle1">
                                Contributors
                            </Typography>
                            {publication.contributors.map((contributor, index) => (
                                <Typography key={index} gutterBottom variant="body2">
                                    {contributor}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </PublicationCollapse>
            ))}
            {openPublications && (
                <CreatePublicationModal
                    publications={publications}
                    setPublications={setPublications}
                    userId={userId}
                    open={openPublications}
                    handleClose={handleClosePublications}
                    workTypes={workTypes}
                />
            )}
            {openEditModal.open && (
                <EditPublicationModal
                    publications={publications}
                    setPublications={setPublications}
                    userId={userId}
                    open={openEditModal.open}
                    handleClose={handleCloseEdit}
                    getPublication={openEditModal.publication}
                    workTypes={workTypes}
                />
            )}
        </React.Fragment>
    )
}

export default Publication
