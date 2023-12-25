import { useMemo, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Home, KeyboardArrowDown } from '@mui/icons-material'
import { Box, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material'
import { ThemeProvider, createTheme, styled } from '@mui/material/styles'

import { AppStyles } from '~/constants/colors'

const FireNav = styled(List)({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
})

const AdminSettings = () => {
    const { conferenceId } = useParams()
    const [openFeature, setOpenFeature] = useState(true)
    const history = useHistory()
    const settingRoutes = useMemo(() => {
        return {
            features: [
                { icon: '', label: 'Create nav bar', to: `/admin/create-nav/${conferenceId}` },
                { icon: '', label: 'Create Website', to: `/admin/create-website/${conferenceId}` },
            ],
        }
    }, [conferenceId])
    return (
        <ThemeProvider
            theme={createTheme({
                components: {
                    MuiListItemButton: {
                        defaultProps: {
                            disableTouchRipple: true,
                        },
                    },
                },
                palette: {
                    mode: 'light',
                    background: { paper: AppStyles.colors['#D5D5D5'] },
                },
            })}
        >
            <Paper elevation={1} sx={{ maxWidth: 256 }}>
                <FireNav component="nav" disablePadding>
                    <ListItemButton sx={{ height: 56 }} onClick={() => history.push('/admin')}>
                        <ListItemIcon>
                            <Home fontSize="large" sx={{ color: AppStyles.colors['#444B52'] }} />
                        </ListItemIcon>
                        <ListItemText
                            sx={{ my: 0, color: AppStyles.colors['#444B52'] }}
                            primary="Back to Home"
                            primaryTypographyProps={{
                                fontSize: 20,
                                fontWeight: 600,
                                letterSpacing: 0,
                            }}
                        />
                    </ListItemButton>
                    <Divider />
                    <Box
                        sx={{
                            bgcolor: openFeature ? AppStyles.colors['#EFEFEF'] : null,
                            pb: openFeature ? 2 : 0,
                        }}
                    >
                        <ListItemButton
                            alignItems="flex-start"
                            onClick={() => setOpenFeature((prev) => !prev)}
                            sx={{
                                px: 3,
                                pt: 2.5,
                                pb: openFeature ? 0 : 2.5,
                                '&:hover, &:focus': {
                                    '& svg': { opacity: openFeature ? 1 : 0 },
                                    '& p': { opacity: openFeature ? 0 : 1 },
                                },
                            }}
                        >
                            <ListItemText
                                primary="Features"
                                primaryTypographyProps={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    lineHeight: '20px',
                                    mb: '2px',
                                    color: AppStyles.colors['#464646'],
                                }}
                                sx={{ my: 0 }}
                            />
                            <KeyboardArrowDown
                                sx={{
                                    mr: -1,
                                    opacity: 0,
                                    transform: openFeature ? 'rotate(-180deg)' : 'rotate(0)',
                                    transition: '0.2s',
                                }}
                            />
                        </ListItemButton>
                        <Collapse in={openFeature} timeout="auto" unmountOnExit>
                            <FireNav disablePadding component="nav">
                                {settingRoutes.features.map((item) => (
                                    <ListItemButton
                                        key={item.label}
                                        sx={{ py: 0, minHeight: 32, color: AppStyles.colors['#027A9D'] }}
                                        onClick={() => history.push(item.to)}
                                    >
                                        {item.icon && (
                                            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                                        )}
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{ fontSize: 16, fontWeight: 'medium' }}
                                        />
                                    </ListItemButton>
                                ))}
                            </FireNav>
                        </Collapse>
                    </Box>
                </FireNav>
            </Paper>
        </ThemeProvider>
    )
}

export default AdminSettings
