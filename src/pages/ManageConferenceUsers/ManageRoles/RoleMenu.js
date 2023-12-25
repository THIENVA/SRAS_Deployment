import React from 'react'

import { cloneDeep } from 'lodash'

import { Menu, MenuItem, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'

const RoleMenu = ({
    anchorEl,
    handleClose,
    open,
    rolesNotAdded,
    handleAddUserToRole,
    roleName,
    handleOpenChairManager,
}) => {
    const cloneRolesNotAdded = cloneDeep(rolesNotAdded)

    if (Array.isArray(cloneRolesNotAdded)) cloneRolesNotAdded.sort((a, b) => a.roleName.localeCompare(b.roleName))

    return (
        <React.Fragment>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1,
                        px: 3,
                        pb: 1,
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {cloneRolesNotAdded.map((role) => (
                    <MenuItem
                        sx={{
                            display: 'flex',
                            ':hover': {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                color: AppStyles.colors['#F7F7F7'],
                            },
                        }}
                        key={role.roleId}
                        onClick={() => {
                            roleName === ROLES_NAME.TRACK_CHAIR
                                ? handleAddUserToRole(role.roleId)
                                : handleOpenChairManager(role.roleId, role.roleName, 'chair-add')
                        }}
                    >
                        <Typography ml={1}>{role.roleName}</Typography>
                    </MenuItem>
                ))}
                {cloneRolesNotAdded.length === 0 && (
                    <MenuItem
                        sx={{
                            display: 'flex',
                            ':hover': {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                color: AppStyles.colors['#F7F7F7'],
                            },
                        }}
                    >
                        <Typography ml={1}>None</Typography>
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    )
}

export default RoleMenu
