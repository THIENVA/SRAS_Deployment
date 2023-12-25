import { useState } from 'react'

import { cloneDeep, isEmpty } from 'lodash'

import { Add, Clear } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormHelperText,
    IconButton,
    Paper,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'

import TitleSection from '../TitleSection'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import { useOutsider } from '~/api/common/outsider'
import { AppStyles } from '~/constants/colors'
import { countries } from '~/constants/countries'

const Authors = ({
    authors,
    handleAddAuthor,
    handleRemoveAuthor,
    handlePrimaryAuthor,
    error,
    messageError,
    handleFirstAuthor,
    handleCorresponding,
}) => {
    const [email, setEmail] = useState('')
    const showSnackbar = useSnackbar()
    const { searchParticipantByEmail, createOutsider } = useOutsider()
    const [loading, setLoading] = useState(false)
    const [loadingOutsider, setLoadingOutsider] = useState(false)
    const [unregisteredUser, setUnRegisteredUser] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        organization: '',
        country: null,
    })
    const [openUnRegistered, setOpenUnRegistered] = useState(false)

    const handleUnregisteredChange = (event) => {
        const { value, name } = event.target
        setUnRegisteredUser((prev) => ({ ...prev, [name]: value }))
    }

    const handleEmailChange = (event) => {
        const { value } = event.target
        setEmail(value)
    }

    const handleCountrySelected = (newValue) => {
        if (newValue === null) setUnRegisteredUser((prev) => ({ ...prev, country: null }))
        else {
            setUnRegisteredUser((prev) => ({ ...prev, country: newValue }))
        }
    }

    const resetUnRegisteredUser = () => {
        setUnRegisteredUser({
            firstName: '',
            middleName: '',
            lastName: '',
            organization: '',
            country: null,
        })
        setOpenUnRegistered(false)
    }

    const checkEmailExistedToAdd = () => {
        if (email.trim().length !== 0) {
            setLoading(true)
            searchParticipantByEmail(email)
                .then((response) => {
                    const user = response.data
                    if (user) {
                        const cloneUser = cloneDeep(user)
                        const isAuthorAdded = authors.some(
                            (author) => author.pariticipantId === cloneUser.pariticipantId
                        )
                        if (isAuthorAdded) {
                            return
                        } else {
                            if (cloneUser.outsiderId) {
                                cloneUser.isPrimaryContact = false
                                cloneUser.enablePrimary = false
                                cloneUser.isFirstAuthor = false
                                cloneUser.isCorrespondingAuthor = false
                            } else {
                                const isHasPrimaryContact = authors.some((author) => !!author.userId === true)
                                if (!isHasPrimaryContact) {
                                    cloneUser.isPrimaryContact = true
                                    cloneUser.isFirstAuthor = true
                                    cloneUser.isCorrespondingAuthor = false
                                } else {
                                    cloneUser.isPrimaryContact = false
                                    cloneUser.isFirstAuthor = false
                                    cloneUser.isCorrespondingAuthor = false
                                }
                                cloneUser.enablePrimary = true
                            }
                            handleAddAuthor(cloneUser)
                            setEmail('')
                            setOpenUnRegistered(false)
                        }
                    } else {
                        setOpenUnRegistered(true)
                    }
                })
                .catch(() => {
                    showSnackbar({
                        severity: 'error',
                        children: 'Something went wrong. Please try again later',
                    })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const { firstName, middleName, lastName, organization, country } = unregisteredUser

    const isValidUnRegisterEmail =
        !isEmpty(firstName) && !isEmpty(middleName) && !isEmpty(lastName) && !isEmpty(organization) && !!country

    const handleAddUnRegisteredAuthor = () => {
        if (isValidUnRegisterEmail) {
            setLoadingOutsider(true)
            const newUser = {
                email,
                firstname: firstName,
                middlename: middleName,
                lastname: lastName,
                organization,
                country,
            }
            createOutsider(newUser)
                .then((response) => {
                    const newOutsider = response.data
                    const {
                        email,
                        country,
                        organization,
                        firstname,
                        lastname,
                        middlename,
                        hasAccount,
                        outsiderId,
                        participantId,
                    } = newOutsider
                    const formatNewOutSider = {
                        email,
                        country,
                        organization,
                        firstName: firstname,
                        lastName: lastname,
                        middleName: middlename,
                        hasAccount,
                        outsiderId,
                        userId: null,
                        pariticipantId: participantId,
                        isPrimaryContact: false,
                        enablePrimary: false,
                        isFirstAuthor: false,
                        isCorrespondingAuthor: false,
                    }
                    handleAddAuthor(cloneDeep(formatNewOutSider))
                    resetUnRegisteredUser()
                    setEmail('')
                })
                .finally(() => {
                    setLoadingOutsider(false)
                })
        }
    }

    return (
        <Box sx={{ mb: 3 }}>
            <TitleSection>
                <Typography fontWeight={600} sx={{ color: AppStyles.colors['#555'] }}>
                    AUTHORS{' '}
                    <Box component="span" sx={{ fontSize: 12, color: 'red', verticalAlign: 'top' }}>
                        *
                    </Box>{' '}
                </Typography>
                <Typography fontWeight={500} variant="body2">
                    You may add your collaborators.
                </Typography>
            </TitleSection>
            <RadioGroup>
                <TableContainer sx={{ mt: 2 }} component={Paper}>
                    <Table
                        sx={{
                            width: '100%',
                            overflow: 'hidden',
                        }}
                    >
                        <TableHead>
                            <TableRow
                                sx={{
                                    'td, th': {
                                        borderRight: '1px solid #cecdcd',
                                        py: 1,
                                        px: 2,
                                    },
                                }}
                            >
                                <TableCell>First Author</TableCell>
                                <TableCell>Corresponding</TableCell>
                                <TableCell>Primary Contact</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="left">First Name</TableCell>
                                <TableCell align="left">Middle Name</TableCell>
                                <TableCell align="left">Last Name</TableCell>
                                <TableCell align="left">Organization</TableCell>
                                <TableCell align="left">Country/Region</TableCell>
                                <TableCell align="left">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {authors.map((user, index) => (
                                <TableRow
                                    sx={{
                                        'td, th': {
                                            borderRight: '1px solid #cecdcd',
                                            py: 1,
                                            px: 2,
                                        },
                                    }}
                                    key={user.pariticipantId}
                                >
                                    <TableCell align="center">
                                        <FormControlLabel
                                            value={user.isFirstAuthor}
                                            checked={user.isFirstAuthor}
                                            control={<Radio />}
                                            onChange={() => handleFirstAuthor(index)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <FormControlLabel
                                            value={user.isCorrespondingAuthor}
                                            checked={user.isCorrespondingAuthor}
                                            control={<Checkbox />}
                                            onChange={() => handleCorresponding(index)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <FormControlLabel
                                            value={user.isPrimaryContact}
                                            checked={user.isPrimaryContact}
                                            control={<Radio />}
                                            disabled={!user.enablePrimary}
                                            onChange={() => handlePrimaryAuthor(index)}
                                        />
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell align="left">{user.firstName}</TableCell>
                                    <TableCell align="left">{user.middleName}</TableCell>
                                    <TableCell align="left">{user.lastName}</TableCell>
                                    <TableCell align="left">{user.organization}</TableCell>
                                    <TableCell align="left">{user.country}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            disabled={user.isPrimaryContact}
                                            onClick={() => handleRemoveAuthor(user.pariticipantId)}
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {error.authors && <FormHelperText error={error.authors}>{messageError.authors}</FormHelperText>}
            </RadioGroup>
            <Box mt={3} display="flex">
                <TextField
                    size="small"
                    variant="outlined"
                    sx={{ maxWidth: 600, minWidth: 400 }}
                    placeholder="Email"
                    inputProps={{ type: 'email' }}
                    value={email}
                    required
                    onChange={handleEmailChange}
                />
                <LoadingButton
                    variant="contained"
                    size="small"
                    startIcon={<Add />}
                    sx={{ ml: 2 }}
                    loading={loading}
                    loadingPosition={'start'}
                    onClick={checkEmailExistedToAdd}
                >
                    Add
                </LoadingButton>
            </Box>
            {openUnRegistered && (
                <Box sx={{ mt: 4, display: 'flex' }}>
                    <TextField
                        size="small"
                        name="firstName"
                        variant="outlined"
                        sx={{ maxWidth: 300, mr: 1 }}
                        value={firstName}
                        onChange={handleUnregisteredChange}
                        placeholder="First Name"
                    />
                    <TextField
                        size="small"
                        name="middleName"
                        variant="outlined"
                        value={middleName}
                        onChange={handleUnregisteredChange}
                        sx={{ maxWidth: 300, mr: 1 }}
                        placeholder="Middle Name"
                    />
                    <TextField
                        size="small"
                        name="lastName"
                        variant="outlined"
                        value={lastName}
                        onChange={handleUnregisteredChange}
                        sx={{ maxWidth: 300, mr: 1 }}
                        placeholder="Last Name"
                    />
                    <TextField
                        size="small"
                        name="organization"
                        variant="outlined"
                        value={organization}
                        onChange={handleUnregisteredChange}
                        sx={{ maxWidth: 300, mr: 1 }}
                        placeholder="Organization"
                    />
                    <Autocomplete
                        size="small"
                        value={country}
                        options={countries.map((country) => country.value)}
                        onChange={(_, value) => handleCountrySelected(value)}
                        sx={{ minWidth: 200, mr: 1 }}
                        renderInput={(params) => <TextField {...params} label="Country" />}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{ mr: 1 }}
                        onClick={resetUnRegisteredUser}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        size="small"
                        loadingPosition="start"
                        loading={loadingOutsider}
                        startIcon={<Add />}
                        onClick={handleAddUnRegisteredAuthor}
                        disabled={isEmpty(email)}
                    >
                        Add
                    </LoadingButton>
                </Box>
            )}
        </Box>
    )
}

export default Authors
