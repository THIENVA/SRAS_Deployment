import { useEffect, useState } from 'react'

import { useHistory, useParams } from 'react-router-dom'

import { Box, Button, Container, Typography } from '@mui/material'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'
import SubmissionContent from './SubmissionContent'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { usePaperSubmission } from '~/api/common/paper-submission'
import { AppStyles } from '~/constants/colors'
import { ROLES_NAME } from '~/constants/conferenceRoles'
import { useAppSelector } from '~/hooks/redux-hooks'

const SubmissionSummary = () => {
    const {
        roleConference: { roleName },
    } = useAppSelector((state) => state.conference)
    const { conferenceId } = useParams()
    const showSnackbar = useSnackbar()
    const { submissionId } = useParams()
    const { getSubmissionSummary } = usePaperSubmission()
    const history = useHistory()
    // const [anchorEl, setAnchorEl] = useState(null)
    // const open = Boolean(anchorEl)
    // const [value, setValue] = useState('me')
    const [loading, setLoading] = useState(true)
    const [submission, setSubmission] = useState({})

    // const handleChange = (event) => {
    //     setValue(event.target.value)
    // }
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget)
    // }
    // const handleSend = () => {
    //     setAnchorEl(null)
    //     showSnackbar({
    //         severity: 'success',
    //         children: 'Email has been sent.',
    //     })
    // }
    // const handleClose = () => {
    //     setAnchorEl(null)
    // }

    const handleGoBack = () => {
        if (roleName === ROLES_NAME.AUTHOR) {
            history.push(`/conferences/${conferenceId}/submission/author`)
        } else if (roleName === ROLES_NAME.REVIEWER) {
            history.push(`/conferences/${conferenceId}/submission/reviewer`)
        } else {
            history.push(`/conferences/${conferenceId}/submission/submission-console`)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getSubmissionSummary(submissionId, signal)
            .then((response) => {
                const data = response.data
                setSubmission(data)
            })
            .catch(() => {
                // showSnackbar({
                //     severity: 'error',
                //     children: 'Something went wrong, please try again later.',
                // })
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between">
                    <Typography mb={3} sx={{ fontSize: 28, fontWeight: 600 }}>
                        Submission Summary
                    </Typography>
                    {/* <Box display="flex" alignItems="center">
                        <Button
                            variant="outlined"
                            onClick={() => window.print()}
                            startIcon={<PrintOutlined />}
                            sx={{ mr: 2, height: 36 }}
                        >
                            Print
                        </Button>
                        <Button
                            id="demo-customized-button"
                            aria-controls={open ? 'demo-customized-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            variant="contained"
                            disableElevation
                            onClick={handleClick}
                            startIcon={<Email />}
                            sx={{
                                height: 36,
                                textTransform: 'none',
                                border: '1px solid #0077CC',
                                backgroundImage: 'linear-gradient(#42A1EC, #0070C9)',
                                borderRadius: 1,
                                color: AppStyles.colors['#FFFFFF'],
                                fontWeight: 500,
                                padding: '4px 15px',
                                ':hover': {
                                    backgroundImage: 'linear-gradient(#51A9EE, #147BCD)',
                                    borderColor: '#1482D0',
                                    textDecoration: 'none',
                                },
                                ':active': {
                                    backgroundImage: 'linear-gradient(#3D94D9, #0067B9)',
                                    borderColor: '#006DBC',
                                    outline: 'none',
                                },
                                ':focus': {
                                    boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                                    outline: 'none',
                                },
                            }}
                        >
                            <Typography>Email</Typography>
                            <ArrowDropDown fontSize="medium" sx={{ color: AppStyles.colors['#FFFFFF'] }} />
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                sx: {
                                    px: 2,
                                },
                                style: {
                                    width: '15rem',
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <FormControl>
                                <RadioGroup value={value} onChange={handleChange}>
                                    <FormControlLabel value="me" control={<Radio />} label="Send Email to Me" />
                                    <FormControlLabel
                                        value="all"
                                        control={<Radio />}
                                        label="Send Email to All Authors"
                                    />
                                </RadioGroup>
                            </FormControl>
                            <Button variant="contained" onClick={handleSend} endIcon={<Send />} sx={{ mt: 1 }}>
                                Send Email
                            </Button>
                        </Menu>
                    </Box> */}
                </Box>
                {loading ? <Loading /> : <SubmissionContent values={submission} />}

                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 2,
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                    }}
                >
                    <Box ml={12} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="error"
                            sx={{ textTransform: 'none', height: 36, mr: 2, fontWeight: 'bold' }}
                            onClick={() => handleGoBack()}
                        >
                            Go Back
                        </Button>

                        {/* <Button
                            sx={{ ml: 5, textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={() =>
                                history.push({
                                    pathname: `/conferences/${conferenceId}/submission/${submission.trackId}/update-paper-submission/${submission.paperId}`,
                                    state: { trackName: submission.trackName },
                                })
                            }
                        >
                            Edit Submission
                        </Button> */}
                    </Box>
                </Box>
            </Container>
        </ConferenceDetail>
    )
}

export default SubmissionSummary
