import { Collapse, Divider, List, ListItemButton, ListItemText } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SubUsersMenu = ({ openSubMenu }) => {
    return (
        <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItemButton
                    sx={{
                        pl: 4,
                        height: 36,
                        py: 0.75,
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                >
                    <ListItemText primary="Invite" />
                </ListItemButton>
                <ListItemButton
                    sx={{
                        pl: 4,
                        height: 36,
                        py: 0.75,
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                >
                    <ListItemText primary="Invite (Bulk)" />
                </ListItemButton>
                <ListItemButton
                    sx={{
                        pl: 4,
                        height: 36,
                        py: 0.75,
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                >
                    <ListItemText primary="Manage Invites" />
                </ListItemButton>
                <Divider />
                <ListItemButton
                    sx={{
                        pl: 4,
                        height: 36,
                        py: 0.75,
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                >
                    <ListItemText primary="Import" />
                </ListItemButton>
                <ListItemButton
                    sx={{
                        pl: 4,
                        height: 36,
                        py: 0.75,
                        ':hover': {
                            backgroundColor: (theme) => theme.palette.primary.main,
                            color: AppStyles.colors['#F7F7F7'],
                        },
                    }}
                >
                    <ListItemText primary="Manage Reviewers" />
                </ListItemButton>
            </List>
        </Collapse>
    )
}

export default SubUsersMenu
