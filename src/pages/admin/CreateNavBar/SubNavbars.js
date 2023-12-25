import React, { useState } from 'react'

import { ArrowDownward, ArrowUpward, Delete, Edit } from '@mui/icons-material'
import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'

import InputChildNavbar from './InputSubNavbar'

const SubNavbars = ({ subNavbarSelected, selectedNavbar, modifySubNavHandler, deleteSubNav }) => {
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [text, setText] = useState('')
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })

    const handleClickOpenAlertPopup = (id) => {
        setOpenAlertPopup({ open: true, id })
    }

    const handleCloseAlertPopup = () => {
        setOpenAlertPopup({ open: false, id: null })
    }

    const openEditSubNavHandler = (id) => {
        const subNavItem = subNavbarSelected.find((item) => item.childId === id)
        setIsAdd({ status: false, id })
        setText(subNavItem.childLabel)
    }

    const openAddSubNav = () => {
        setText('')
        setIsAdd({ status: true, id: null })
    }

    const handleAddingSubNav = (value) => {
        modifySubNavHandler(value, selectedNavbar, isAdd)
        setText('')
        setIsAdd({ status: true, id: null })
    }

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom mb={2} fontWeight={500}>
                SUB NAVBAR
            </Typography>
            <Box
                sx={{
                    height: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #e5e0e0',
                }}
            >
                {subNavbarSelected.length > 0 ? (
                    <List dense sx={{ width: '100%', height: '1', p: 0, overflow: 'auto' }}>
                        {subNavbarSelected.map((nav) => (
                            <React.Fragment key={nav.childId}>
                                <ListItem
                                    secondaryAction={
                                        <React.Fragment>
                                            <IconButton>
                                                <ArrowDownward />
                                            </IconButton>
                                            <IconButton>
                                                <ArrowUpward />
                                            </IconButton>
                                            <IconButton onClick={() => openEditSubNavHandler(nav.childId)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleClickOpenAlertPopup(nav.childId)}>
                                                <Delete />
                                            </IconButton>
                                        </React.Fragment>
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemText primary={nav.childLabel} />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography variant="subtitle1" sx={{ opacity: 0.5 }}>
                        There is no sub nav here
                    </Typography>
                )}
            </Box>
            <InputChildNavbar
                childNav={text}
                selectedNavbar={selectedNavbar}
                isAdd={isAdd}
                openAddSubNav={openAddSubNav}
                handleAddingSubNav={handleAddingSubNav}
            />
            {openAlertPopup.open && (
                <AlertPopup
                    open={openAlertPopup.open}
                    handleClose={handleCloseAlertPopup}
                    handleDelete={() => deleteSubNav(openAlertPopup.id, handleCloseAlertPopup)}
                >
                    Are you sure you want to delete this navbar? Sub navbar and all file linked to this also be deleted.
                </AlertPopup>
            )}
        </React.Fragment>
    )
}

export default SubNavbars
