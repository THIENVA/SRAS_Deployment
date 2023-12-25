import React, { useState } from 'react'

import { Edit, School } from '@mui/icons-material'
import { Avatar, Box, Chip, IconButton, Stack, Typography } from '@mui/material'

import ScientificInfoModal from '../../ModalComponent/ScientificInfoModal'

import IdImage from '~/assets/images/id.png'
import { AppStyles } from '~/constants/colors'

const PersonalInfo = ({
    publishName,
    adminPositionFunction,
    scientistTitle,
    orcid,
    academic,
    degree,
    academicFunction,
    currentDegree,
    alsoKnownAs,
    userId,
    profile,
    setProfile,
}) => {
    const [openAcademicInfo, setOpenAcademicInfo] = useState(false)
    const handleOpenAcademicInfo = () => setOpenAcademicInfo(true)

    const handleCloseAcademicInfo = () => setOpenAcademicInfo(false)

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ color: AppStyles.colors['#333333'] }}>
                    Publish name
                </Typography>
                <IconButton onClick={handleOpenAcademicInfo} size="small">
                    <Edit fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                </IconButton>
            </Box>
            <Typography sx={{ color: '#535050' }} variant="h5" fontWeight={700}>
                {publishName}
            </Typography>
            <Typography sx={{ color: '#7b8084' }} mt={1}>
                {scientistTitle}
            </Typography>
            <Box mt={1} display="flex" alignItems="center">
                <School fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                <Typography sx={{ color: '#7b8084', ml: 1 }}>{adminPositionFunction}</Typography>
            </Box>
            {orcid && (
                <Box mt={1.5} display="flex" alignItems="center">
                    <Avatar sx={{ width: 15, height: 15 }} src={IdImage} alt="id-image" />
                    <Box component="a" href={orcid} target="_blank" ml={1} pb={0.5}>
                        {orcid}
                    </Box>
                </Box>
            )}
            {alsoKnownAs.length !== 0 && (
                <Box mt={2}>
                    <Typography
                        width={200}
                        variant="subtitle2"
                        fontWeight={500}
                        sx={{ color: AppStyles.colors['#333333'] }}
                    >
                        Also known as
                    </Typography>
                    <Stack mt={1} direction="row" flexWrap="wrap" gap={1}>
                        {alsoKnownAs.map((name, index) => (
                            <Chip key={index} label={name.name} variant="outlined" />
                        ))}
                    </Stack>
                </Box>
            )}
            {openAcademicInfo && (
                <ScientificInfoModal
                    publishName={publishName}
                    academic={academic}
                    scientistTitle={scientistTitle}
                    orcid={orcid}
                    adminPositionFunction={adminPositionFunction}
                    open={openAcademicInfo}
                    handleClose={handleCloseAcademicInfo}
                    degree={degree}
                    currentDegree={currentDegree}
                    academicFunction={academicFunction}
                    alsoKnownAs={alsoKnownAs}
                    userId={userId}
                    profile={profile}
                    setProfile={setProfile}
                />
            )}
        </React.Fragment>
    )
}

export default PersonalInfo
