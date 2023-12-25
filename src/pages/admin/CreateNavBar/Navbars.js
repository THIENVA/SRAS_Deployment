import React, { useState } from 'react'

import { Delete, Edit } from '@mui/icons-material'
import { Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import AlertPopup from '~/components/AlertPopup'

import InputParentNavbar from './InputParentNavbar'

const Navbars = ({
    navbars,
    handleSelectNav,
    selectedNavbar,
    openEditNavbarHandler,
    modifyNavbarHandler,
    isAdd,
    navbar,
    cancelEditingHandler,
    deleteNavbar,
}) => {
    const [openAlertPopup, setOpenAlertPopup] = useState({ open: false, id: null })

    const handleClickOpenAlertPopup = (id) => {
        setOpenAlertPopup({ open: true, id })
    }

    const handleCloseAlertPopup = () => {
        setOpenAlertPopup({ open: false, id: null })
    }

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom mb={2} fontWeight={500}>
                NAVBAR
            </Typography>
            <InputParentNavbar
                cancelEditingHandler={cancelEditingHandler}
                isAdd={isAdd}
                modifyNavbarHandler={modifyNavbarHandler}
                parentNav={navbar}
            />
            <List dense sx={{ width: '100%', height: 400, p: 0, border: '1px solid #e5e0e0', overflow: 'auto' }}>
                {navbars.map((nav) => (
                    <React.Fragment key={nav.parentId}>
                        <ListItem
                            secondaryAction={
                                <React.Fragment>
                                    <IconButton onClick={() => openEditNavbarHandler(nav.parentId)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleClickOpenAlertPopup(nav.parentId)}>
                                        <Delete />
                                    </IconButton>
                                </React.Fragment>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                selected={selectedNavbar === nav.parentId}
                                onClick={() => handleSelectNav(nav.parentId)}
                            >
                                <ListItemText primary={nav.parentLabel} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
            {openAlertPopup.open && (
                <AlertPopup
                    open={openAlertPopup.open}
                    handleClose={handleCloseAlertPopup}
                    handleDelete={() => deleteNavbar(openAlertPopup.id, handleCloseAlertPopup)}
                >
                    Are you sure you want to delete this navbar? Sub navbar and all file linked to this also be deleted.
                </AlertPopup>
            )}
        </React.Fragment>
    )
}

export default Navbars
