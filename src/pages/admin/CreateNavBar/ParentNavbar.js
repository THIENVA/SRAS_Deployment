import { useRef } from 'react'

import { Cancel, Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import CardCompo from '~/components/Card'

import SubNavBar from './SubNavBar'

import { AppStyles } from '~/constants/colors'

const ParentNavbar = ({
    isAdd,
    navbar,
    openEditNavbarHandler,
    handleClickOpenAlertPopup,
    index,
    modifySubNavHandler,
    deleteSubNav,
}) => {
    const ref = useRef(null)
    return (
        <Box mt={5}>
            <CardCompo
                cardStyle={{ mt: 1.5, width: 'fit-content' }}
                cardContentStyle={{
                    px: 2,
                    py: '8px !important',
                    backgroundColor: (theme) =>
                        `${isAdd.id === navbar.parentId ? theme.palette.primary.main : '#CBCBCB !important'}`,
                    color: `${
                        isAdd.id === navbar.parentId ? AppStyles.colors['#FAFBFF'] : AppStyles.colors['#000000de']
                    }`,
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">{navbar.parentLabel.toUpperCase()}</Typography>
                    <Box sx={{ ml: 5 }} display="flex" alignItems="center">
                        <IconButton onClick={() => openEditNavbarHandler(navbar.parentId)}>
                            <Edit
                                sx={{
                                    color: `${
                                        isAdd.id === navbar.parentId
                                            ? AppStyles.colors['#FAFBFF']
                                            : AppStyles.colors['#000000de']
                                    }`,
                                }}
                            />
                        </IconButton>
                        <IconButton sx={{ mr: 1.5 }} onClick={() => handleClickOpenAlertPopup(navbar.parentId)}>
                            <Cancel
                                sx={{
                                    color: `${
                                        isAdd.id === navbar.parentId
                                            ? AppStyles.colors['#FAFBFF']
                                            : AppStyles.colors['#000000de']
                                    }`,
                                }}
                            />
                        </IconButton>
                    </Box>
                </Box>
            </CardCompo>
            <SubNavBar
                ref={ref}
                childs={navbar.childs}
                parentIndex={index}
                modifySubNavHandler={modifySubNavHandler}
                parentId={navbar.parentId}
                deleteSubNav={deleteSubNav}
            />
        </Box>
    )
}

export default ParentNavbar
