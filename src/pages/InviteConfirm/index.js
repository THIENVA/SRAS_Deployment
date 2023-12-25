import { Fragment, useEffect, useRef, useState } from 'react'

import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'

import { Box, Typography } from '@mui/material'
import Header from '~/components/Common/Header'
import ModalInfo from '~/components/ModalInfo'

import Loading from '../Loading'
import ConfirmAction from './ConfirmAction'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useReviewer } from '~/api/common/reviewer'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'

const InviteConfirm = () => {
    const showSnackbar = useSnackbar()
    const history = useHistory()
    const { getHasCreateAccount, getHasInvite, postConfirmInvite } = useReviewer()
    const { search: query } = useLocation()
    const { participantid, inviteid, trackid } = queryString.parse(query)
    const [isLoading, setLoading] = useState(true)
    const [buttonLoading, setButtonLoading] = useState(false)

    // const [quota, setQuota] = useState(0)
    const confirmType = useRef('')

    const [openConfirmModal, setOpenConfirmModal] = useState(true)
    const [inviteInfo, setInviteInfo] = useState({
        conferenceName: '',
        city: '',
        trackName: '',
    })
    const [buttonType, setButtonType] = useState(2)
    const handleOpenConfirmModal = (type) => {
        setButtonType(type)
        setOpenConfirmModal(true)
    }
    const handleCloseConfirmModal = () => setOpenConfirmModal(false)

    // const handleSubmitFeedback = () => {
    //     showSnackbar({
    //         severity: 'success',
    //         children: 'Feedback has been successfully saved.',
    //     })
    // }

    // const handleCommentChange = (event) => {
    //     setComment(event.target.value)
    // }

    // const handleQuotaChange = (event) => {
    //     const regex = /^[0-9\b]+$/
    //     if (event.target.value === '' || regex.test(event.target.value)) {
    //         setQuota(event.target.value)
    //     }
    // }

    const handleAcceptInvite = () => {
        confirmType.current = 'Accept'
    }

    const handleDeclineInvite = () => {
        confirmType.current = 'Decline'
    }

    const callConfirmAPI = (status) => {
        const params = {
            trackId: trackid,
            recipientId: participantid,
            invitationId: inviteid,
            status: status,
        }
        postConfirmInvite(params)
            .then(() => {
                if (status === false) {
                    handleDeclineInvite()
                } else {
                    handleAcceptInvite()
                }
                showSnackbar({
                    severity: 'success',
                    children: `Your response have been changed to ${confirmType.current}.`,
                })
                history.push('/conferences')
            })
            .catch((err) => {
                const error = err.response?.data?.error?.code
                    ? err.response.data.error.code
                    : 'Something went wrong, please try again later'

                history.push('/conferences')

                showSnackbar({
                    severity: 'error',
                    children: `${err.response?.data === 'Link Is Expired' ? err.response?.data : error}`,
                })
            })
            .finally(() => {
                setButtonLoading(false)
            })
    }

    const handleSubmit = () => {
        setButtonLoading(true)
        if (buttonType === 1 || confirmType.current === 'Accept') {
            callConfirmAPI(false)
            // handleDeclineInvite()
        } else if (buttonType === 2 || confirmType.current === 'Decline') {
            callConfirmAPI(true)
            // handleAcceptInvite()
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const secondController = new AbortController()
        const secondSignal = secondController.signal
        const signal = controller.signal

        getHasCreateAccount({ participantId: participantid }, signal)
            .then((response) => {
                const data = response.data
                if (data === true) {
                    getHasInvite({ invitationId: inviteid, trackId: trackid }, secondSignal)
                        .then((response) => {
                            const data = response.data
                            if (data.status === 'Accept' || data.status === 'Reject') {
                                history.push('/conferences')
                                showSnackbar({
                                    severity: 'error',
                                    children: 'This invitation has already responded.',
                                })
                            }
                            setInviteInfo((prev) => ({
                                ...prev,
                                conferenceName: data.conferenceName,
                                city: data.city,
                                trackName: data.trackName,
                            }))
                        })
                        .catch(() => {
                            showSnackbar({
                                severity: 'error',
                                children: 'Something went wrong, check invite status error.',
                            })
                        })
                        .finally(() => {
                            setLoading(false)
                        })
                } else {
                    history.push('/register')
                    showSnackbar({
                        severity: 'error',
                        children: 'Please register account in the system.',
                    })
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, check has account error.',
                })
                setLoading(false)
            })

        return () => {
            controller.abort()
            secondController.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Fragment>
            <Header />
            {isLoading ? (
                <Loading height="70vh" />
            ) : (
                <Fragment>
                    <ModalInfo
                        open={openConfirmModal}
                        handleClose={handleCloseConfirmModal}
                        header={'Confirmation required'}
                        headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
                        maxWidth="sm"
                        submitBtnName="OK"
                        enableActions={true}
                        handleSubmit={handleSubmit}
                        loading={buttonLoading}
                    >
                        You are about to change your response to{' '}
                        <b>
                            {buttonType === 2 || confirmType.current === 'Decline'
                                ? 'Accept'
                                : buttonType === 1 || confirmType.current === 'Accept'
                                ? 'Decline'
                                : ''}
                        </b>
                        . Are you sure?
                    </ModalInfo>
                    <Box width={ScreenSize.ScreenWidth} m="0 auto">
                        <Typography mb={3} sx={{ fontSize: 28, fontWeight: 600 }}>
                            Manage Reviewer Invite
                        </Typography>
                        <Typography sx={{ fontSize: 18, mb: 1 }}>
                            You have been invited as a <b>reviewer</b> for conference <b>{inviteInfo.conferenceName}</b>{' '}
                            in <b>{inviteInfo.city} City</b>, track <b>{inviteInfo.trackName}</b>. Your current response
                            is <b>{confirmType.current === '' ? 'Not yet choose' : confirmType.current}</b>.
                        </Typography>

                        <Box
                            sx={{
                                borderRadius: 2,
                                p: 3,
                                my: 1,
                                mb: 3,
                                backgroundColor: AppStyles.colors['#F5F5F5'],
                                border: '0.5px solid #cecdcd',
                                width: 800,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: 'Arial, sans-serif',
                                    fontSize: 16,
                                    color: '#333',
                                    lineHeight: 1.6,
                                }}
                            >
                                <strong>Important Notice:</strong> This invitation allows for a single response only, so
                                please choose wisely before submitting your response. Once you have submitted your
                                response and close this page, it cannot be changed or edited. <br />
                                <br />
                                We appreciate your thoughtful consideration and look forward to your response. Thank
                                you!
                            </Typography>
                        </Box>
                        <Box display={'flex'} mb={2} ml={2}>
                            <Typography sx={{ fontStyle: 'italic', fontSize: 18 }}>
                                Change your response to{' '}
                                <ConfirmAction
                                    fontSize={18}
                                    confirmType={confirmType.current}
                                    handleOpenConfirmModal={handleOpenConfirmModal}
                                    handleAccept={handleAcceptInvite}
                                    handleDecline={handleDeclineInvite}
                                />
                            </Typography>
                        </Box>
                        {/* <Box>
                    <Typography mb={2} sx={{ fontSize: 18 }}>
                        You may provide optional Feedback.
                    </Typography>
                    {confirmType.current === 'Accept' && (
                        <Box mb={2} ml={2}>
                            <Typography mb={1}>
                                Enter the limit if you can only review a limited number of papers
                            </Typography>
                            <TextField
                                fullWidth={true}
                                placeholder="Quota"
                                variant="outlined"
                                sx={{ height: 42, width: 600 }}
                                size="small"
                                value={quota}
                                onChange={handleQuotaChange}
                            />
                        </Box>
                    )}

                    <Box mb={2} ml={2}>
                        <Typography mb={1}>Enter comment</Typography>
                        <TextField
                            label="Comment"
                            fullWidth={true}
                            variant="outlined"
                            sx={{ height: 42, width: 600 }}
                            size="small"
                            value={comment}
                            onChange={handleCommentChange}
                            multiline
                            rows={4}
                        />
                    </Box>
                </Box> */}
                        <Box
                            sx={{
                                mt: 4,
                                px: 2,
                                py: 3,
                                boxShadow: 'inset 0 -1px 0 #edeeef',
                                backgroundColor: AppStyles.colors['#F8F9FA'],
                            }}
                        >
                            {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            sx={{ ml: 5, textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={handleSubmitFeedback}
                        >
                            Submit Feedback
                        </Button>
                    </Box> */}
                        </Box>
                    </Box>
                </Fragment>
            )}
        </Fragment>
    )
}

export default InviteConfirm
