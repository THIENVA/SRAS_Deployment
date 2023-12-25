import { useEffect, useMemo, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import Home from '@mui/icons-material/Home'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { Collapse, FormControl, MenuItem, Select } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import { ThemeProvider, createTheme, styled } from '@mui/material/styles'

import { useTrack } from '~/api/common/track'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { handleFactorIsCurrent, handleGetSteps, handleLoading, resetStepWhenTrackChange } from '~/features/guidelines'
import { trackChange } from '~/features/track-for-chair'
import { useAppSelector } from '~/hooks/redux-hooks'

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

export default function SettingCompo() {
    const dispatch = useDispatch()
    const { conferenceId } = useParams()
    const { getGuideline } = useTrack()
    const [openFeature, setOpenFeature] = useState(false)
    const [openActivity, setOpenActivity] = useState(false)
    const [openForm, setOpenForm] = useState(false)
    const [openGeneral, setOpenGeneral] = useState(false)
    const [openTrackPlan, setOpenTrackPlan] = useState(false)
    const history = useHistory()
    const { trackId, tracks } = useAppSelector((state) => state.trackForChair)
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)

    const handleChange = (_, { props }) => {
        dispatch(trackChange({ id: props.value, name: props.children }))
        dispatch(resetStepWhenTrackChange())
        dispatch(handleLoading(true))
        getGuideline(props.value, true, {})
            .then((response) => {
                const data = response.data
                if (data) {
                    const currentRow = data.rows.find((item) => item.isCurrentPhase === true)
                    if (!currentRow) {
                        dispatch(handleGetSteps({ steps: data.rows, stepSelected: null }))
                    } else {
                        let positionGuidelines = -1
                        if (currentRow.guidelines) {
                            positionGuidelines = currentRow.guidelines.findIndex((item) => !item.isFinished)
                        }
                        dispatch(
                            handleGetSteps({
                                steps: data.rows,
                                stepSelected: {
                                    ...cloneDeep(currentRow),
                                    trackId: props.value,
                                    guideLineSelected:
                                        positionGuidelines !== -1
                                            ? { ...currentRow.guidelines[positionGuidelines] }
                                            : null,
                                    currentStep: positionGuidelines,
                                },
                            })
                        )
                        dispatch(handleFactorIsCurrent(currentRow.guidelineGroupFactor))
                    }
                } else {
                    dispatch(handleGetSteps({ steps: null, stepSelected: null }))
                }
            })
            .finally(() => {
                dispatch(handleLoading(false))
            })
    }

    const settingRoutes = useMemo(() => {
        return {
            features: [
                {
                    icon: '',
                    label: 'Paper Status',
                    to: `/conferences/${conferenceId}/settings/paper-status`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Subject Area',
                    to: `/conferences/${conferenceId}/settings/subject-area`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Submission',
                    to: `/conferences/${conferenceId}/settings/submission`,
                    isSelected: false,
                },
                // { icon: '', label: 'Review', to: `/conferences/${conferenceId}/settings/review`, isSelected: false },
                {
                    icon: '',
                    label: 'Reviewer Suggestion',
                    to: `/conferences/${conferenceId}/settings/reviewer-suggestion`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Camera Ready Submissions',
                    to: `/conferences/${conferenceId}/settings/camera-ready-submissions`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Presentations',
                    to: `/conferences/${conferenceId}/settings/presentations`,
                    isSelected: false,
                },
            ],
            activityTimeline: [
                {
                    icon: '',
                    label: 'Deadlines',
                    to: `/conferences/${conferenceId}/settings/deadline`,
                    isSelected: false,
                },
            ],
            trackPlan: [
                {
                    icon: '',
                    label: 'Plan Deadlines',
                    to: `/conferences/${conferenceId}/settings/track-plan`,
                    isSelected: false,
                },
            ],
            forms: [
                {
                    icon: '',
                    label: 'Submission',
                    to: `/conferences/${conferenceId}/settings/submission-question`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Camera Ready Submission',
                    to: `/conferences/${conferenceId}/settings/camera-ready-submission`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Review Criteria',
                    to: `/conferences/${conferenceId}/settings/review`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Decision Criteria',
                    to: `/conferences/${conferenceId}/settings/decision-criteria-submission`,
                    isSelected: false,
                },
            ],
            general: [
                { icon: '', label: 'Track', to: `/conferences/${conferenceId}/settings/track`, isSelected: false },
                {
                    icon: '',
                    label: 'Registration Paper',
                    to: `/conferences/${conferenceId}/settings/registration`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Warning Factor',
                    to: `/conferences/${conferenceId}/settings/warning-factor`,
                    isSelected: false,
                },
                {
                    icon: '',
                    label: 'Email Template',
                    to: `/conferences/${conferenceId}/settings/email-template`,
                    isSelected: false,
                },
            ],
        }
    }, [conferenceId])

    useEffect(() => {
        const url = window.location.href
            .replace('http://localhost:3000', '')
            .replace('https://capstone-client-inky.vercel.app', '')
        for (const feature of settingRoutes.features) {
            if (feature.to === url) {
                feature.isSelected = true
                setOpenFeature(true)
                break
            }
        }
        for (const activityTimeline of settingRoutes.activityTimeline) {
            if (activityTimeline.to === url) {
                activityTimeline.isSelected = true
                setOpenActivity(true)
                break
            }
        }
        for (const trackPlan of settingRoutes.trackPlan) {
            if (trackPlan.to === url) {
                trackPlan.isSelected = true
                setOpenTrackPlan(true)
                break
            }
        }
        for (const form of settingRoutes.forms) {
            if (form.to === url) {
                form.isSelected = true
                setOpenForm(true)
                break
            }
        }
        for (const general of settingRoutes.general) {
            if (general.to === url) {
                general.isSelected = true
                setOpenGeneral(true)
                break
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {roleName === ROLES_NAME.CHAIR && (
                <FormControl sx={{ mb: 2, maxWidth: 256 }} size="small" fullWidth>
                    <Select size="small" value={trackId} onChange={handleChange}>
                        {tracks.map((track) => (
                            <MenuItem key={track.id} value={track.id}>
                                {track.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
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
                        <ListItemButton sx={{ height: 56 }}>
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
                        {roleName === ROLES_NAME.CHAIR && (
                            <Box
                                sx={{
                                    bgcolor: openGeneral ? AppStyles.colors['#EFEFEF'] : null,
                                    pb: openGeneral ? 2 : 0,
                                }}
                            >
                                <ListItemButton
                                    alignItems="flex-start"
                                    onClick={() => setOpenGeneral((prev) => !prev)}
                                    sx={{
                                        px: 3,
                                        pt: 2.5,
                                        pb: openGeneral ? 0 : 2.5,
                                        '&:hover, &:focus': {
                                            '& svg': { opacity: openGeneral ? 1 : 0 },
                                            '& p': { opacity: openGeneral ? 0 : 1 },
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary="General"
                                        primaryTypographyProps={{
                                            fontSize: 18,
                                            fontWeight: 600,
                                            lineHeight: '20px',
                                            mb: '2px',
                                            color: AppStyles.colors['#464646'],
                                        }}
                                        secondary="Track, Registration"
                                        secondaryTypographyProps={{
                                            noWrap: true,
                                            fontSize: 12,
                                            lineHeight: '16px',
                                            color: openGeneral
                                                ? AppStyles.colors['#EFEFEF']
                                                : AppStyles.colors['#495057'],
                                        }}
                                        sx={{ my: 0 }}
                                    />
                                    <KeyboardArrowDown
                                        sx={{
                                            mr: -1,
                                            opacity: 0,
                                            transform: openGeneral ? 'rotate(-180deg)' : 'rotate(0)',
                                            transition: '0.2s',
                                        }}
                                    />
                                </ListItemButton>
                                <Collapse in={openGeneral} timeout="auto" unmountOnExit>
                                    <FireNav disablePadding component="nav">
                                        {settingRoutes.general.map((item) => (
                                            <ListItemButton
                                                key={item.label}
                                                sx={{
                                                    py: 0,
                                                    minHeight: 32,
                                                    color: item.isSelected
                                                        ? AppStyles.colors['#F2F2F2']
                                                        : AppStyles.colors['#027A9D'],
                                                    backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                    ':hover': {
                                                        color: item.isSelected
                                                            ? AppStyles.colors['#F2F2F2']
                                                            : AppStyles.colors['#027A9D'],
                                                        backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                    },
                                                }}
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
                        )}
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
                                    secondary="Paper Status, Subject Area, Conflict, Submission, Review, Author Feedback, and Camera Ready Submission"
                                    secondaryTypographyProps={{
                                        noWrap: true,
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        color: openFeature ? AppStyles.colors['#EFEFEF'] : AppStyles.colors['#495057'],
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
                                            sx={{
                                                py: 0,
                                                minHeight: 32,
                                                color: item.isSelected
                                                    ? AppStyles.colors['#F2F2F2']
                                                    : AppStyles.colors['#027A9D'],
                                                backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                ':hover': {
                                                    color: item.isSelected
                                                        ? AppStyles.colors['#F2F2F2']
                                                        : AppStyles.colors['#027A9D'],
                                                    backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                },
                                            }}
                                            onClick={() => history.push(item.to)}
                                        >
                                            {item.icon && (
                                                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                                            )}
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{ fontSize: 16, fontWeight: 'medium' }}
                                                secondary={
                                                    item.label === 'Submission' &&
                                                    'Submission, Supplementary, Revision, Other'
                                                }
                                                secondaryTypographyProps={{
                                                    color: item.isSelected
                                                        ? AppStyles.colors['#F2F2F2']
                                                        : AppStyles.colors['#027A9D'],
                                                    backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                    ':hover': {
                                                        color: item.isSelected
                                                            ? AppStyles.colors['#F2F2F2']
                                                            : AppStyles.colors['#027A9D'],
                                                        backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                    },
                                                }}
                                            />
                                        </ListItemButton>
                                    ))}
                                </FireNav>
                            </Collapse>
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                bgcolor: openForm ? AppStyles.colors['#EFEFEF'] : null,
                                pb: openForm ? 2 : 0,
                            }}
                        >
                            <ListItemButton
                                alignItems="flex-start"
                                onClick={() => setOpenForm((prev) => !prev)}
                                sx={{
                                    px: 3,
                                    pt: 2.5,
                                    pb: openForm ? 0 : 2.5,
                                    '&:hover, &:focus': {
                                        '& svg': { opacity: openForm ? 1 : 0 },
                                        '& p': { opacity: openForm ? 0 : 1 },
                                    },
                                }}
                            >
                                <ListItemText
                                    primary="Forms"
                                    primaryTypographyProps={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        lineHeight: '20px',
                                        mb: '2px',
                                        color: AppStyles.colors['#464646'],
                                    }}
                                    secondary="Submission"
                                    secondaryTypographyProps={{
                                        noWrap: true,
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        color: openForm ? AppStyles.colors['#EFEFEF'] : AppStyles.colors['#495057'],
                                    }}
                                    sx={{ my: 0 }}
                                />
                                <KeyboardArrowDown
                                    sx={{
                                        mr: -1,
                                        opacity: 0,
                                        transform: openForm ? 'rotate(-180deg)' : 'rotate(0)',
                                        transition: '0.2s',
                                    }}
                                />
                            </ListItemButton>
                            <Collapse in={openForm} timeout="auto" unmountOnExit>
                                <FireNav disablePadding component="nav">
                                    {settingRoutes.forms.map((item) => (
                                        <ListItemButton
                                            key={item.label}
                                            sx={{
                                                py: 0,
                                                minHeight: 32,
                                                color: item.isSelected
                                                    ? AppStyles.colors['#F2F2F2']
                                                    : AppStyles.colors['#027A9D'],
                                                backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                            }}
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
                        <Divider />
                        <Box
                            sx={{
                                bgcolor: openActivity ? AppStyles.colors['#EFEFEF'] : null,
                                pb: openActivity ? 2 : 0,
                            }}
                        >
                            <ListItemButton
                                alignItems="flex-start"
                                onClick={() => setOpenActivity((prev) => !prev)}
                                sx={{
                                    px: 3,
                                    pt: 2.5,
                                    pb: openActivity ? 0 : 2.5,
                                    '&:hover, &:focus': {
                                        '& svg': { opacity: openActivity ? 1 : 0 },
                                        '& p': { opacity: openActivity ? 0 : 1 },
                                    },
                                }}
                            >
                                <ListItemText
                                    primary="Activity Timeline"
                                    primaryTypographyProps={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        lineHeight: '20px',
                                        mb: '2px',
                                        color: AppStyles.colors['#464646'],
                                    }}
                                    secondary="Deadlines"
                                    secondaryTypographyProps={{
                                        noWrap: true,
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        color: openActivity ? AppStyles.colors['#EFEFEF'] : AppStyles.colors['#495057'],
                                    }}
                                    sx={{ my: 0 }}
                                />
                                <KeyboardArrowDown
                                    sx={{
                                        mr: -1,
                                        opacity: 0,
                                        transform: openActivity ? 'rotate(-180deg)' : 'rotate(0)',
                                        transition: '0.2s',
                                    }}
                                />
                            </ListItemButton>
                            <Collapse in={openActivity} timeout="auto" unmountOnExit>
                                <FireNav disablePadding component="nav">
                                    {settingRoutes.activityTimeline.map((item) => (
                                        <ListItemButton
                                            key={item.label}
                                            sx={{
                                                py: 0,
                                                minHeight: 32,
                                                color: item.isSelected
                                                    ? AppStyles.colors['#F2F2F2']
                                                    : AppStyles.colors['#027A9D'],
                                                backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                ':hover': {
                                                    color: item.isSelected
                                                        ? AppStyles.colors['#F2F2F2']
                                                        : AppStyles.colors['#027A9D'],
                                                    backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                },
                                            }}
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
                        <Divider />
                        <Box
                            sx={{
                                bgcolor: openTrackPlan ? AppStyles.colors['#EFEFEF'] : null,
                                pb: openTrackPlan ? 2 : 0,
                            }}
                        >
                            <ListItemButton
                                alignItems="flex-start"
                                onClick={() => setOpenTrackPlan((prev) => !prev)}
                                sx={{
                                    px: 3,
                                    pt: 2.5,
                                    pb: openTrackPlan ? 0 : 2.5,
                                    '&:hover, &:focus': {
                                        '& svg': { opacity: openTrackPlan ? 1 : 0 },
                                        '& p': { opacity: openTrackPlan ? 0 : 1 },
                                    },
                                }}
                            >
                                <ListItemText
                                    primary="Track Plan"
                                    primaryTypographyProps={{
                                        fontSize: 18,
                                        fontWeight: 600,
                                        lineHeight: '20px',
                                        mb: '2px',
                                        color: AppStyles.colors['#464646'],
                                    }}
                                    secondary="Plan Deadlines"
                                    secondaryTypographyProps={{
                                        noWrap: true,
                                        fontSize: 12,
                                        lineHeight: '16px',
                                        color: openTrackPlan
                                            ? AppStyles.colors['#EFEFEF']
                                            : AppStyles.colors['#495057'],
                                    }}
                                    sx={{ my: 0 }}
                                />
                                <KeyboardArrowDown
                                    sx={{
                                        mr: -1,
                                        opacity: 0,
                                        transform: openTrackPlan ? 'rotate(-180deg)' : 'rotate(0)',
                                        transition: '0.2s',
                                    }}
                                />
                            </ListItemButton>
                            <Collapse in={openTrackPlan} timeout="auto" unmountOnExit>
                                <FireNav disablePadding component="nav">
                                    {settingRoutes.trackPlan.map((item) => (
                                        <ListItemButton
                                            key={item.label}
                                            sx={{
                                                py: 0,
                                                minHeight: 32,
                                                color: item.isSelected
                                                    ? AppStyles.colors['#F2F2F2']
                                                    : AppStyles.colors['#027A9D'],
                                                backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                ':hover': {
                                                    color: item.isSelected
                                                        ? AppStyles.colors['#F2F2F2']
                                                        : AppStyles.colors['#027A9D'],
                                                    backgroundColor: item.isSelected && AppStyles.colors['#027A9D'],
                                                },
                                            }}
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
                        <Divider />
                    </FireNav>
                </Paper>
            </ThemeProvider>
        </Box>
    )
}
