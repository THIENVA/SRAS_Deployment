import React, { useState } from 'react'

import { Box, Typography } from '@mui/material'
import UserBlockInfo from '~/pages/Profile/ScientistProfile/components/UserBlockInfo'

import { AppStyles } from '~/constants/colors'
import OtherIdsModal from '~/pages/Profile/ModalComponent/OtherIdsModal'
import WebSocialModal from '~/pages/Profile/ModalComponent/WebSocialModal'

// import { formatGuidForDisplay } from '~/utils/commonFunction'

const UserInfoSlideBar = ({ userId, otherIds, country, websiteAndSocialLinks, profile, setProfile, email }) => {
    const [openSocialLinks, setOpenSocialLinks] = useState(false)
    const [openOtherIds, setOpenOtherIds] = useState(false)
    const parseOtherIds = JSON.parse(otherIds)
    const parseWebsiteAndSocialLinks = JSON.parse(websiteAndSocialLinks)

    const handleOpenSocialLinks = () => setOpenSocialLinks(true)

    const handleCloseSocialLinks = () => setOpenSocialLinks(false)

    const handleOpenOtherIds = () => setOpenOtherIds(true)

    const handleCloseOtherIds = () => setOpenOtherIds(false)

    return (
        <React.Fragment>
            <Box sx={{ backgroundColor: AppStyles.colors['#E5EDFF'] }} width="1">
                <Box p={4} display="flex" justifyContent="center" flexDirection="column">
                    <Box
                        sx={{
                            backgroundColor: AppStyles.colors['#FFFFFF'],
                            border: `1px solid ${AppStyles.colors['#004DFF']}`,
                            p: 3,
                            px: 2,
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="body1" align="center" sx={{ fontWeight: 500 }}>
                            Author ID
                        </Typography>
                        <Typography variant="h6" align="center" fontWeight={600}>
                            {/* {formatGuidForDisplay(userId)} */}
                            {userId}
                        </Typography>
                    </Box>
                    <UserBlockInfo style={{ mt: 2 }} content={email} title="Email" canEditing={false} />
                    <UserBlockInfo
                        style={{ mt: 2 }}
                        content={parseWebsiteAndSocialLinks}
                        title="Website & social links"
                        isClickable={true}
                        handleOpenModal={handleOpenSocialLinks}
                    />
                    <UserBlockInfo
                        style={{ mt: 2 }}
                        handleOpenModal={handleOpenOtherIds}
                        content={parseOtherIds}
                        title="Other IDs"
                        isClickable={true}
                    />
                    <UserBlockInfo
                        style={{ mt: 2 }}
                        content={country}
                        title="Country"
                        isClickable={false}
                        canEditing={false}
                    />
                </Box>
            </Box>
            {openSocialLinks && (
                <WebSocialModal
                    websiteSocialLinks={parseWebsiteAndSocialLinks}
                    open={openSocialLinks}
                    handleClose={handleCloseSocialLinks}
                    profile={profile}
                    setProfile={setProfile}
                />
            )}
            {openOtherIds && (
                <OtherIdsModal
                    otherIds={parseOtherIds}
                    open={openOtherIds}
                    handleClose={handleCloseOtherIds}
                    profile={profile}
                    setProfile={setProfile}
                />
            )}
        </React.Fragment>
    )
}

export default UserInfoSlideBar
