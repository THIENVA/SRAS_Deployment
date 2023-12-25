import React, { useEffect, useState } from 'react'

import { Typography } from '@mui/material'

import WorkPlaceModal from '../../ModalComponent/WorkPlaceModal'
import CardLayout from '../Layout/CardLayout'
import ContentBlock from './ContentBlock'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import Loading from '~/pages/Loading'
import { generateLink } from '~/utils/commonFunction'

const Workplace = ({ workPlace, setWorkPlace, tabLoading, setTabLoading, userId }) => {
    const { loadingWorkplace } = tabLoading
    const { getWorkplace } = useProfile()
    const showSnackbar = useSnackbar()
    const [openWorkplace, setOpenWorkPlace] = useState(false)

    const handleOpenWorkplace = () => setOpenWorkPlace(true)

    const handleCloseWorkplace = () => setOpenWorkPlace(false)

    useEffect(() => {
        const controller = new AbortController()
        if (loadingWorkplace) {
            getWorkplace(userId, controller.signal)
                .then((response) => {
                    const getWorkplace = response.data.result
                    setWorkPlace(getWorkplace)
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setTabLoading((prev) => ({ ...prev, loadingWorkplace: false }))
                })
        }
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loadingWorkplace ? (
        <Loading height="40vh" />
    ) : (
        <React.Fragment>
            {workPlace ? (
                <CardLayout title="Workplace" handleOpenModal={handleOpenWorkplace}>
                    <ContentBlock title="Organization Name" content={workPlace.organizationName} />
                    <ContentBlock title="Organization Phone Number" content={workPlace.organizationPhoneNumber} />
                    {workPlace.organizationDescription && (
                        <ContentBlock title="Organization Description" content={workPlace.organizationDescription} />
                    )}
                    {workPlace.organizationWebsite && (
                        <ContentBlock
                            title="Organization Website"
                            content={generateLink(workPlace.organizationWebsite)}
                            isClickAble={true}
                        />
                    )}
                    {workPlace.grid && <ContentBlock title="GRID" content={workPlace.grid} />}
                </CardLayout>
            ) : (
                <CardLayout title="Workplace" handleOpenModal={handleOpenWorkplace}>
                    <Typography mt={2} sx={{ color: '#FFC107' }} align="center" variant="h6">
                        You have not provided your current organization yet. Please provider your information
                    </Typography>
                </CardLayout>
            )}
            {openWorkplace && (
                <WorkPlaceModal
                    open={openWorkplace}
                    handleClose={handleCloseWorkplace}
                    userId={userId}
                    organizationId={workPlace ? workPlace.organizationId : null}
                    workPlace={workPlace}
                    setWorkPlace={setWorkPlace}
                />
            )}
        </React.Fragment>
    )
}

export default Workplace
