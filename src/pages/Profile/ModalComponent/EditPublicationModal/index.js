import { useState } from 'react'

import { enGB } from 'date-fns/locale'
import { cloneDeep } from 'lodash'
import { v4 as uuid } from 'uuid'

import { Close, Save } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import TransitionCompo from '~/components/TransitionCompo'

import InputLayout from '../InputLayout'
import Contributors from './Contributors'
import PublicationLinks from './PublicationLinks'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useProfile from '~/api/common/profile'
import { regexUrl } from '~/constants/regex'
import { isEmpty } from '~/utils/commonFunction'

const EditPublicationModal = ({
    open,
    handleClose,
    userId,
    setPublications,
    publications,
    workTypes,
    getPublication,
}) => {
    const { updatePublications } = useProfile()
    const showSnackbar = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [publication, setPublication] = useState({
        publicationName: getPublication.publicationName,
        publisher: getPublication.publisher,
        doi: getPublication.doi,
        dOILink: getPublication.dOILink,
    })
    const [workType, setWorkType] = useState({
        workTypeId: getPublication.workTypeId,
        workTypeName: getPublication.workTypeName,
    })
    const [publicationDate, setPublicationDate] = useState(new Date(getPublication.publicationDate))

    const [error, setError] = useState({
        publicationName: false,
        publisher: false,
        doi: false,
        publicationDate: false,
        dOILink: false,
        workType: false,
    })
    const [isLeadAuthor, setIsLeadAuthor] = useState(false)

    const [messageError, setMessageError] = useState({
        publicationName: '',
        publisher: '',
        doi: '',
        publicationDate: '',
        dOILink: '',
        workType: '',
    })
    const [contributorError, setContributorError] = useState({ error: false, messageError: '' })
    const formatPublicLinks = getPublication.publicationLinks.map((item) => ({
        ...item,
        messageLinkTitle: '',
        messageLinkUrl: '',
    }))
    const [publicationLinks, setPublicationLinks] = useState(formatPublicLinks)
    const [contributors, setContributors] = useState(getPublication.contributors)

    const { publicationName, publisher, doi, dOILink } = publication
    const { workTypeId, workTypeName } = workType

    const handlePublication = (event) => {
        const { value, name } = event.target
        setPublication((prev) => ({ ...prev, [name]: value }))
        setMessageError((prev) => ({ ...prev, [name]: '' }))
        setError((prev) => ({ ...prev, [name]: false }))
    }

    const handleWorkType = (_, { props }) => {
        setWorkType({ workTypeId: props.value, workTypeName: props.children })
        setMessageError((prev) => ({ ...prev, ['workType']: '' }))
        setError((prev) => ({ ...prev, ['workType']: false }))
    }

    const handleDatePicker = (value) => {
        setPublicationDate(value)
        setMessageError((prev) => ({ ...prev, ['publicationDate']: '' }))
        setError((prev) => ({ ...prev, ['publicationDate']: false }))
    }

    const handleIsAuthorLead = (event) => {
        const { value } = event.target
        setIsLeadAuthor(value)
    }

    const handleSubmit = () => {
        const isPublicationName = !isEmpty(publicationName)
        const isPublisher = !isEmpty(publisher)
        const isDoi = !isEmpty(doi)
        const isDoiLink = !isEmpty(dOILink) && regexUrl.test(dOILink)
        const isPublicationDate = !!publicationDate
        const isWorkType = workTypeId !== -1
        const isInValidContributor = contributors.every((contributor) => isEmpty(contributor))
        const isInvalidPublicationLinks = publicationLinks.some(
            (item) => isEmpty(item.label) || isEmpty(item.link) || !regexUrl.test(item.link)
        )

        const isValid =
            isPublicationName &&
            isPublisher &&
            isDoi &&
            isDoiLink &&
            isPublicationDate &&
            isWorkType &&
            !isInvalidPublicationLinks &&
            !isInValidContributor

        if (!isValid) {
            setError({
                publicationName: !isPublicationName,
                publisher: !isPublisher,
                doi: !isDoi,
                dOILink: !isDoiLink,
                publicationDate: !isPublicationDate,
                workType: !isWorkType,
            })
            setMessageError({
                publicationName: !isPublicationName ? 'Publication name must not be empty' : '',
                publisher: !isPublisher ? 'Publisher must not be empty' : '',
                doi: !isDoi ? 'Doi name must not be empty' : '',
                dOILink: !dOILink && isEmpty(dOILink) ? 'Doi link must not be empty' : 'Invalid URL',
                publicationDate: !publicationDate ? 'Publication date must be selected' : '',
                workType: !isWorkType ? 'Work type must be selected' : '',
            })
            if (isInvalidPublicationLinks) {
                const updatedLinks = publicationLinks.map((link) => {
                    if (isEmpty(link.label)) {
                        link.messageLinkTitle = 'The link title must not be empty'
                    }
                    if (isEmpty(link.link)) {
                        link.messageLinkUrl = 'The link url must not be empty'
                    } else if (!regexUrl.test(link.link)) {
                        link.messageLinkUrl = 'Invalid URL'
                    }
                    return link
                })
                setPublicationLinks(cloneDeep(updatedLinks))
            }
            if (isInValidContributor) {
                setContributorError({ error: true, messageError: 'There is must be at least 1 contributor' })
            }
        } else {
            setLoading(true)
            const formatData = publicationLinks.map((item) => ({ id: item.id, label: item.label, link: item.link }))
            const filterContributors = contributors.filter((contributor) => !isEmpty(contributor))
            const publicationData = {
                publicationId: uuid(),
                publicationDate,
                publicationName,
                publisher,
                doi,
                dOILink,
                publicationLinks: formatData,
                workTypeId,
                contributors: filterContributors,
                isLeadAuthor,
            }
            const formatPublications = { ...cloneDeep(publicationData), workTypeName }
            const clonePublications = cloneDeep(publications)
            const position = clonePublications.findIndex((item) => item.publicationId === getPublication.publicationId)
            clonePublications.splice(position, 1, formatPublications)
            updatePublications(userId, clonePublications)
                .then(() => {
                    setPublications(clonePublications)
                    handleClose()
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

    return (
        <Dialog
            sx={{ backdropFilter: 'blur(4px)' }}
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            TransitionComponent={TransitionCompo}
        >
            <Box sx={{ border: '2px solid #000' }}>
                <DialogTitle id="alert-dialog-title">
                    Edit Publication
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <InputLayout boxStyle={{ mb: 2 }} label="Publication Name">
                        <TextField
                            onChange={handlePublication}
                            value={publicationName}
                            inputProps={{ maxLength: 64 }}
                            name="publicationName"
                            size="small"
                            fullWidth
                            error={error.publicationName}
                            helperText={error.publicationName ? messageError.publicationName : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Publisher">
                        <TextField
                            onChange={handlePublication}
                            value={publisher}
                            inputProps={{ maxLength: 64 }}
                            name="publisher"
                            size="small"
                            fullWidth
                            error={error.publisher}
                            helperText={error.publisher ? messageError.publisher : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="DOI title">
                        <TextField
                            onChange={handlePublication}
                            value={doi}
                            inputProps={{ maxLength: 64 }}
                            name="doi"
                            size="small"
                            fullWidth
                            error={error.doi}
                            helperText={error.doi ? messageError.doi : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="DOI link">
                        <TextField
                            onChange={handlePublication}
                            value={dOILink}
                            inputProps={{ maxLength: 64 }}
                            name="dOILink"
                            size="small"
                            fullWidth
                            error={error.dOILink}
                            helperText={error.dOILink ? messageError.dOILink : ''}
                        />
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Work Type">
                        <Select
                            sx={{ minWidth: 200 }}
                            onChange={handleWorkType}
                            value={workTypeId}
                            size="small"
                            error={error.workType}
                        >
                            {workTypes.map((item) => (
                                <MenuItem key={item.referenceTypeId} value={item.referenceTypeId}>
                                    {item.referenceTypeName}
                                </MenuItem>
                            ))}
                        </Select>
                        {error.workType && (
                            <FormHelperText error={error.workType}>{messageError.workType}</FormHelperText>
                        )}
                    </InputLayout>
                    <InputLayout boxStyle={{ mb: 2 }} label="Publication Date">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <FormControl error={error.publicationDate} fullWidth size="small">
                                <DatePicker
                                    onChange={(value) => handleDatePicker(value)}
                                    value={publicationDate}
                                    views={['day', 'month', 'year']}
                                    renderInput={(params) => (
                                        <TextField size="small" {...params} error={error.publicationDate} />
                                    )}
                                />
                            </FormControl>
                            {error.publicationDate && (
                                <FormHelperText error={error.publicationDate}>
                                    {messageError.publicationDate}
                                </FormHelperText>
                            )}
                        </LocalizationProvider>
                    </InputLayout>
                    <RadioGroup onChange={handleIsAuthorLead} value={isLeadAuthor} row name="gender">
                        <FormControlLabel value={true} control={<Radio size="small" />} label="Author Lead" />
                        <FormControlLabel value={false} control={<Radio size="small" />} label="contributor" />
                    </RadioGroup>
                    {error.isLeadAuthor && (
                        <FormHelperText error={error.isLeadAuthor}>{messageError.isLeadAuthor}</FormHelperText>
                    )}
                    <PublicationLinks publicationLinks={publicationLinks} setPublicationLinks={setPublicationLinks} />
                    <Contributors
                        contributorError={contributorError}
                        contributors={contributors}
                        setContributors={setContributors}
                        setContributorError={setContributorError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={loading}
                        disabled={loading}
                        onClick={handleSubmit}
                        loadingPosition="start"
                        startIcon={<Save />}
                        variant="contained"
                    >
                        Save Change
                    </LoadingButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default EditPublicationModal
