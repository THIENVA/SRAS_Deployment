import { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { Box, Button, TextField, Typography } from '@mui/material'
import InputField from '~/components/InputField'
import SupportPlaceholder from '~/components/SupportPlaceholder'

import ConferenceDetail from '../ConferenceDetail'
import EmailInfoModal from './EmailInfoModal'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'

const ResendInvite = () => {
    const history = useHistory()
    const showSnackbar = useSnackbar()

    const [textField, setTextField] = useState({
        subject: 'Reviewer Invitation for {Conference.Name}',
        body: 'Dear {Recipient.Name},\n\nYou are invited as a reviewer for {Conference.Name}.\n\nClick the link below to accept.\n{Recipient.InviteeAcceptUrl}.\nClick the link below to decline.\n{Recipient.InviteeDeclineUrl}.\nThe invitation expires on {Invite.Expiration}.\n\nPlease contact {Sender.Email} if you have questions about the invitation.\n\nThanks,\nCMT team',
    })
    const [openPaperModal, setOpenPaperModal] = useState(false)

    const handleTextChange = (event) => {
        const { name, value } = event.target
        setTextField((prev) => ({ ...prev, [name]: value }))
    }

    const handleOpenPaperModal = () => {
        setOpenPaperModal(true)
    }

    const handleClosePaperModal = () => setOpenPaperModal(false)

    const handleSubmit = () => {
        setOpenPaperModal(false)
        // showSnackbar({
        //     severity: 'success',
        //     children: 'Sending Email Successfully.',
        // })
    }

    return (
        <ConferenceDetail>
            <EmailInfoModal
                open={openPaperModal}
                handleClose={handleClosePaperModal}
                row={textField}
                handleSubmit={handleSubmit}
            />
            <Box width={ScreenSize.ScreenWidth} m="0 auto">
                <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                    Resend Reviewer Invites
                </Typography>
                <Box
                    sx={{
                        mt: 4,
                        px: 2,
                        py: 1,
                        backgroundColor: AppStyles.colors['#F8F9FA'],
                        boxShadow: 'inset 0 -1px 0 #edeeef',
                    }}
                >
                    <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                        Resend email
                    </Typography>
                </Box>
                <Box mt={1} mb={3}>
                    <Box ml={6} mt={2}>
                        <InputField
                            text="From"
                            isRequire={false}
                            textStyle={{ fontSize: 18 }}
                            boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                            textBoxStyle={{ width: 170 }}
                        >
                            <Box ml={5}>
                                <Typography sx={{ fontSize: 18 }}>
                                    Anh Nguyen Dang Truong {'<'}anhndtse150640@fpt.edu.vn{'>'}
                                </Typography>
                            </Box>
                        </InputField>
                        <InputField
                            text="Total Invites to Send"
                            isRequire={false}
                            textStyle={{ fontSize: 18 }}
                            boxStyle={{ display: 'flex', alignItems: 'center', mb: 2 }}
                            textBoxStyle={{ width: 170 }}
                        >
                            <Box ml={5}>
                                <Typography sx={{ fontSize: 18 }}>1</Typography>
                            </Box>
                        </InputField>
                        <InputField
                            text="Subject"
                            isRequire={true}
                            textStyle={{ fontSize: 18 }}
                            boxStyle={{ display: 'flex', alignItems: 'center', mb: 3 }}
                            textBoxStyle={{ width: 170 }}
                        >
                            <Box ml={5} minWidth={600}>
                                <TextField
                                    fullWidth={true}
                                    placeholder="Subject"
                                    variant="outlined"
                                    sx={{ height: 42 }}
                                    value={textField.subject}
                                    name="subject"
                                    onChange={handleTextChange}
                                    size="small"
                                />
                            </Box>
                        </InputField>
                        <InputField
                            text="Body"
                            isRequire={true}
                            textStyle={{ fontSize: 18 }}
                            boxStyle={{ display: 'flex' }}
                            textBoxStyle={{ width: 170 }}
                        >
                            <Box ml={5} minWidth={600}>
                                <TextField
                                    fullWidth={true}
                                    variant="outlined"
                                    value={textField.body}
                                    name="body"
                                    onChange={handleTextChange}
                                    size="small"
                                    multiline
                                    rows={8}
                                />
                            </Box>
                        </InputField>
                    </Box>
                </Box>
                <SupportPlaceholder />
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
                        <Typography
                            sx={{
                                ml: 5,
                                color: AppStyles.colors['#027A9D'],
                                cursor: 'pointer',
                                fontSize: '1.125rem',
                                ':hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                            onClick={() => history.push('/manage-reviewer-invite')}
                        >
                            Cancel
                        </Typography>
                        <Button
                            sx={{ ml: 5, textTransform: 'none', height: 36 }}
                            variant="contained"
                            onClick={handleOpenPaperModal}
                        >
                            Preview & Send
                        </Button>
                    </Box>
                </Box>
            </Box>
        </ConferenceDetail>
    )
}

export default ResendInvite
