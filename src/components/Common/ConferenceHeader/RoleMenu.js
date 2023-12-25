import { Typography } from '@mui/material'

import { ControlledMenu, MenuItem } from '@szhsin/react-menu'

const RoleMenu = ({ open, anchorRef, onClose, rolesTrack, handleSwitchRole, roleName }) => {
    return (
        <ControlledMenu
            state={open ? 'open' : 'closed'}
            anchorRef={anchorRef}
            onClose={onClose}
            align="end"
            arrow={true}
            arrowStyle={{ right: 10, left: 'none' }}
            menuStyle={{ filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))' }}
        >
            {rolesTrack.map((role) => (
                <MenuItem
                    onClick={() => handleSwitchRole(role.id, role.name)}
                    key={role.id}
                    style={{
                        backgroundColor:
                            roleName === role.name && role.name === 'Chair'
                                ? '#ffe6c1'
                                : roleName === role.name && role.name === 'Track Chair'
                                ? '#d3ebd3'
                                : roleName === role.name && role.name === 'Author'
                                ? '#fff9c4'
                                : roleName === role.name && role.name === 'Reviewer'
                                ? '#F5F5F5'
                                : '',
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: roleName === role.name && 'bold',

                            color:
                                role.name === 'Chair'
                                    ? '#d84315'
                                    : role.name === 'Track Chair'
                                    ? '#1b5e20'
                                    : role.name === 'Author'
                                    ? '#af861f'
                                    : '#607D8B',
                        }}
                    >
                        {role.name}
                    </Typography>
                </MenuItem>
            ))}
        </ControlledMenu>
    )
}

export default RoleMenu
