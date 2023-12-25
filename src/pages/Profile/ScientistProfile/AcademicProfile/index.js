import React, { useState } from 'react'

import { Edit, LocalLibrary, School } from '@mui/icons-material'
import { Avatar, Box, Chip, IconButton, Stack, Typography } from '@mui/material'

import ScientificInfoModal from '../../ModalComponent/ScientificInfoModal'

import IdImage from '~/assets/images/id.png'
import { AppStyles } from '~/constants/colors'
import { generateLink, removeProtocol } from '~/utils/commonFunction'

const AcademicProfile = ({
    publishName,
    orcid,
    adminPositionFunction,
    academicFunction,
    academic,
    degree,
    currentDegree,
    scientistTitle,
    alsoKnownAs,
    setProfile,
    profile,
    userId,
    firstName,
    middleName,
    lastName,
}) => {
    const [openAcademicInfo, setOpenAcademicInfo] = useState(false)

    const handleOpenAcademicInfo = () => setOpenAcademicInfo(true)

    const handleCloseAcademicInfo = () => setOpenAcademicInfo(false)

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2" sx={{ color: AppStyles.colors['#333333'] }}>
                    Public name
                </Typography>
                <IconButton onClick={handleOpenAcademicInfo} size="small">
                    <Edit fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography sx={{ color: '#535050' }} variant="h5" fontWeight={700}>
                    {publishName}
                </Typography>
                <Box mt={1} ml={3} display="flex" alignItems="center">
                    <Avatar sx={{ width: 15, height: 15 }} src={IdImage} alt="id-image" />
                    <Box component="a" href={generateLink(orcid)} target="_blank" ml={1} pb={0.5}>
                        {removeProtocol(orcid)}
                    </Box>
                </Box>
            </Box>
            <Typography sx={{ color: '#9f9696' }} gutterBottom>
                ({lastName}, {firstName} {middleName})
            </Typography>
            <Box mt={1} display="flex" alignItems="center">
                <School fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                <Typography sx={{ color: '#7b8084', ml: 1 }}>{adminPositionFunction}</Typography>
            </Box>
            <Box mt={1} display="flex" alignItems="center">
                <LocalLibrary fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                <Typography sx={{ color: '#7b8084', ml: 1 }}>{scientistTitle}</Typography>
            </Box>
            <Box mt={2} display="flex">
                <Box
                    py={1}
                    px={2}
                    sx={{ borderRadius: 3, border: '0.5px solid #99B8FF', minWidth: 250, maxWidth: 300 }}
                >
                    <Typography variant="body2" sx={{ color: '#535050' }}>
                        Academic rank
                    </Typography>
                    <Typography fontWeight={600}>{academicFunction}</Typography>
                    <Typography>Year: {academic}</Typography>
                </Box>
                <Box
                    py={1}
                    px={2}
                    ml={3}
                    sx={{ borderRadius: 3, border: '0.5px solid #99B8FF', minWidth: 250, maxWidth: 300 }}
                >
                    <Typography variant="body2" sx={{ color: '#535050' }}>
                        Current Degree
                    </Typography>
                    <Typography fontWeight={600}>{currentDegree}</Typography>
                    <Typography>Year: {degree}</Typography>
                </Box>
            </Box>
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

export default AcademicProfile
