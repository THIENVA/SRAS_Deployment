import React, { useState } from 'react'

import { ArrowDownward, ArrowUpward, Delete, Edit } from '@mui/icons-material'
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
    handleSwapNavbar,
    template,
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
                template={template}
                cancelEditingHandler={cancelEditingHandler}
                isAdd={isAdd}
                modifyNavbarHandler={modifyNavbarHandler}
                parentNav={navbar}
                navbars={navbars}
            />
            <List dense sx={{ width: '100%', height: 400, p: 0, border: '1px solid #e5e0e0' }}>
                {navbars.map((nav, index) => (
                    <React.Fragment key={nav.parentId}>
                        <ListItem
                            secondaryAction={
                                <React.Fragment>
                                    <IconButton
                                        disabled={index === navbars.length - 1 || navbars.length === 1}
                                        onClick={() => handleSwapNavbar(index, 'down')}
                                    >
                                        <ArrowDownward />
                                    </IconButton>
                                    <IconButton
                                        disabled={index === 0 || navbars.length === 1}
                                        onClick={() => handleSwapNavbar(index, 'up')}
                                    >
                                        <ArrowUpward />
                                    </IconButton>
                                    <IconButton
                                        disabled={
                                            nav.parentLabel.toLowerCase() === 'home' ||
                                            nav.parentLabel.toLowerCase() === 'about'
                                        }
                                        onClick={() => openEditNavbarHandler(nav.parentId)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        disabled={
                                            nav.parentLabel.toLowerCase() === 'home' ||
                                            nav.parentLabel.toLowerCase() === 'about'
                                        }
                                        onClick={() => handleClickOpenAlertPopup(nav.parentId)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </React.Fragment>
                            }
                            disablePadding
                        >
                            <ListItemButton
                                selected={selectedNavbar.id === nav.parentId}
                                onClick={() => handleSelectNav(nav.parentId, nav.parentLabel)}
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
