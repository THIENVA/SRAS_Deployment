import React, { useEffect, useMemo, useRef, useState } from 'react'

import { cloneDeep } from 'lodash'
import MaterialReactTable from 'material-react-table'
import { useHistory, useParams } from 'react-router-dom'

import { LoadingButton } from '@mui/lab'
import { Box, Button, Container, InputLabel, Typography } from '@mui/material'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import ConferenceDetail from '../ConferenceDetail'
import Loading from '../Loading'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useEmailTemplate from '~/api/common/emailTemplate'
import Template from '~/assets/files/users-information.csv'
import { AppStyles } from '~/constants/colors'
import { useAppSelector } from '~/hooks/redux-hooks'

const NotifySubmitPaper = () => {
    const showSnackbar = useSnackbar()
    const formRef = useRef(null)
    const [users, setUser] = useState([])
    const { userId } = useAppSelector((state) => state.auth)
    const { getCallPaperTemplate, sendAllNewMember } = useEmailTemplate()
    const { conferenceId } = useParams()
    const history = useHistory()
    const {
        conference: { conferenceName, conferenceFullName },
    } = useAppSelector((state) => state.conference)
    const [loading, setLoading] = useState(true)
    const [emailTemplate, setEmailTemplate] = useState(null)

    const importTemplate = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.name.endsWith('.csv')) {
                const updatedUsers = cloneDeep(users)
                var reader = new FileReader()
                reader.onload = function () {
                    const data = reader.result
                    const rows = data.split('\n')
                    const getUsers = rows.slice(1, updatedUsers.length - 1)
                    if (getUsers.length > 0) {
                        const formatUsers = getUsers.map((user, index) => {
                            const fields = user.split(',')
                            const [email, firstName, middleName, lastName] = fields
                            if (!email || !firstName || !middleName || !lastName) {
                                showSnackbar({
                                    severity: 'error',
                                    children: `Your input in line ${index + 2} lacks of information`,
                                })
                                return
                            } else {
                                const formatLastName = lastName?.replace(/\r$/, '')
                                return {
                                    email,
                                    firstName,
                                    middleName,
                                    lastName: formatLastName,
                                }
                            }
                        })
                        setUser(formatUsers)
                    } else {
                        showSnackbar({
                            severity: 'error',
                            children: 'Your file is empty',
                        })
                    }
                    formRef.current.reset()
                }
                reader.readAsText(file)
            } else {
                showSnackbar({
                    severity: 'error',
                    children: 'The file must be the .csv file',
                })
                formRef.current.reset()
            }
        }
    }

    const sendEmail = () => {
        const invitees = users.map((user) => ({
            toEmail: user.email,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
        }))
        const dataToSend = {
            accountIdOfSender: userId,
            conferenceId,
            conferenceName: conferenceFullName,
            conferenceShortName: conferenceName,
            subjectTemplate: emailTemplate.subject,
            bodyTemplate: emailTemplate.body,
            invitees,
        }
        sendAllNewMember(dataToSend)
        showSnackbar({
            severity: 'success',
            children: 'Send emails successfully',
        })
        history.replace(`/conferences/${conferenceId}/submission/submission-console`)
    }

    useEffect(() => {
        const controller = new AbortController()
        getCallPaperTemplate(conferenceId, controller.signal)
            .then((response) => {
                const emailTemplate = response.data
                if (emailTemplate) {
                    setEmailTemplate(emailTemplate)
                }
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'firstName',
                header: 'First Name',
            },
            {
                accessorKey: 'middleName',
                header: 'Middle Name',
            },
            {
                accessorKey: 'lastName',
                header: 'Last Name',
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
        ],
        []
    )

    return (
        <ConferenceDetail>
            <Container maxWidth="lg">
                <Typography mb={1} sx={{ fontSize: 28, fontWeight: 600 }}>
                    Submitting Paper Notification
                </Typography>
                <ListItemPopupInfo
                    itemName="Conference name"
                    value={conferenceFullName}
                    itemWidth={1.5}
                    valueWidth={10.5}
                    outerStyle={{ boxShadow: 'none', my: 1 }}
                />
                <ListItemPopupInfo
                    itemName="Short name"
                    value={conferenceName}
                    itemWidth={1.5}
                    valueWidth={10.5}
                    outerStyle={{ boxShadow: 'none', my: 1 }}
                />
                {loading ? (
                    <Loading height="80vh" />
                ) : (
                    <React.Fragment>
                        <Box my={2} display="flex" alignItems={'center'} component={'form'} ref={formRef}>
                            <Button variant="outlined" sx={{ mr: 1, borderRadius: 1 }}>
                                <Box
                                    component="a"
                                    download="users-information.csv"
                                    target="_blank"
                                    rel="noreferrer"
                                    href={Template}
                                    sx={{ textDecoration: 'none' }}
                                >
                                    Download Template
                                </Box>
                            </Button>
                            <InputLabel htmlFor="upload" sx={{ display: 'inline-block' }}>
                                <input
                                    onChange={importTemplate}
                                    required
                                    style={{ opacity: 0, maxWidth: 0.5 }}
                                    id="upload"
                                    type="file"
                                    accept=".csv"
                                />
                                <LoadingButton variant="contained" component="span" sx={{ borderRadius: 1 }}>
                                    Import Template
                                </LoadingButton>
                            </InputLabel>
                        </Box>
                        <MaterialReactTable
                            columns={columns}
                            data={users}
                            enableColumnFilterModes
                            enablePinning
                            enableColumnResizing
                            enableStickyHeader
                            positionToolbarAlertBanner="bottom"
                            muiTableBodyProps={{
                                sx: () => ({
                                    '& tr:nth-of-type(odd)': {
                                        backgroundColor: AppStyles.colors['#F7FCFF'],
                                    },
                                }),
                            }}
                            muiTableBodyCellEditTextFieldProps={() => ({
                                variant: 'outlined',
                            })}
                        />
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="center"
                            sx={{ backgroundColor: AppStyles.colors['#F5F5F5'], mt: 2, p: 2, borderRadius: 2 }}
                        >
                            <Button
                                type="button"
                                onClick={() => history.goBack()}
                                sx={{ textTransform: 'none', height: 36, mx: 2 }}
                                variant="outlined"
                            >
                                Go Back
                            </Button>
                            <Button
                                type="button"
                                onClick={sendEmail}
                                sx={{ textTransform: 'none', height: 36 }}
                                variant="contained"
                                disabled={!emailTemplate || users.length <= 0}
                            >
                                Send
                            </Button>
                        </Box>
                    </React.Fragment>
                )}
            </Container>
        </ConferenceDetail>
    )
}

export default NotifySubmitPaper
