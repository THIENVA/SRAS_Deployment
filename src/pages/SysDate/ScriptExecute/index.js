import React from 'react'

import { cloneDeep } from 'lodash'

import { ExpandMore, Visibility, VisibilityOff } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    IconButton,
    LinearProgress,
    TextField,
    Typography,
} from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ScriptExecute = ({
    conferenceId,
    trackId,
    scriptLoading,
    setScriptLoading,
    setExecuteMessage,
    executeMessage,
    scriptDemos,
    scriptAmount,
    subjectAreaAmount,
    values,
    setValues,
    consoleMessages,
    setGetMessage,
    setCurrentIndex,
    setConsoleMessages,
    setSuccessMessage,
    submissionQuestionAmount,
    reviewerAccount,
}) => {
    const handleRunScript = (scriptFunction, header, index) => {
        setScriptLoading(index)
        setSuccessMessage('')
        setGetMessage([])
        const updatedExecuteMessage = cloneDeep(executeMessage)
        updatedExecuteMessage[index].disable = false
        updatedExecuteMessage[index].loading = true
        const amount = values[index]
        const sendingAmount = amount ? amount : null
        setExecuteMessage(updatedExecuteMessage)
        scriptFunction(conferenceId, trackId, sendingAmount)
            .then((res) => {
                if (res.data.isSuccessful === true) {
                    const updatedExecuteMessage = cloneDeep(executeMessage)
                    if (!res.data.messages) {
                        updatedExecuteMessage[index].message = 'The script has been already run.'
                        updatedExecuteMessage[index].isSuccess = false
                    } else {
                        setSuccessMessage(res.data.conclusion)
                        updatedExecuteMessage[index].isSuccess = true
                    }
                    updatedExecuteMessage[index].disable = true
                    updatedExecuteMessage[index].loading = false
                    if (res.data.messages) {
                        setGetMessage(res.data.messages)
                        setCurrentIndex({ scriptIndex: index, messageIndex: 0 })
                    }
                    setExecuteMessage(updatedExecuteMessage)
                } else {
                    const updatedExecuteMessage = cloneDeep(executeMessage)
                    updatedExecuteMessage[index].message = `${header} script error`
                    updatedExecuteMessage[index].disable = true
                    updatedExecuteMessage[index].loading = false
                    updatedExecuteMessage[index].isSuccess = false
                    setExecuteMessage(updatedExecuteMessage)
                }
            })
            .catch(() => {
                const updatedExecuteMessage = cloneDeep(executeMessage)
                updatedExecuteMessage[index].message = `${header} script error`
                updatedExecuteMessage[index].disable = true
                updatedExecuteMessage[index].loading = false
                updatedExecuteMessage[index].isSuccess = false
                setExecuteMessage(updatedExecuteMessage)
            })
            .finally(() => {
                setScriptLoading(-1)
            })
    }

    const toggleShowMessage = (index) => {
        const updatedConsoleMessage = cloneDeep(consoleMessages)
        updatedConsoleMessage[index].isShown = !updatedConsoleMessage[index].isShown
        setConsoleMessages(updatedConsoleMessage)
    }

    const textChangeHandler = (newValue, index) => {
        const updatedScript = cloneDeep(values)
        if (index === 1) {
            const getValue = subjectAreaAmount.find((item) => item.title === newValue)
            if (getValue) {
                const cloneValue = cloneDeep(getValue)
                updatedScript[index] = cloneValue.value
            } else {
                updatedScript[index] = newValue
            }
        } else {
            const getValue = scriptAmount.find((item) => item.title === newValue)
            if (getValue) {
                const cloneValue = cloneDeep(getValue)

                updatedScript[index] = cloneValue.value
            } else {
                updatedScript[index] = newValue
            }
        }
        setValues(updatedScript)
    }

    return (
        <React.Fragment>
            {scriptDemos.map((script, index) => (
                <Box sx={{ mb: 2 }} key={index}>
                    <Accordion>
                        <AccordionSummary
                            sx={{ background: consoleMessages[index].message ? '#b7deb8' : '#fefefe' }}
                            expandIcon={<ExpandMore />}
                        >
                            <Typography sx={{ fontSize: 16, color: AppStyles.colors['#002b5d'], fontWeight: 600 }}>
                                {script.header}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {executeMessage[index].disable ? (
                                <React.Fragment>
                                    <Box>
                                        {consoleMessages[index].message && (
                                            <Box mb={1} display="flex" alignItems="center">
                                                <Typography sx={{ color: '#027A9D' }}>
                                                    {consoleMessages[index].isShown ? 'Hide Message' : 'Show Message'}
                                                </Typography>
                                                {consoleMessages[index].isShown ? (
                                                    <IconButton onClick={() => toggleShowMessage(index)} sx={{ ml: 1 }}>
                                                        <VisibilityOff sx={{ color: '#027A9D' }} fontSize="small" />
                                                    </IconButton>
                                                ) : (
                                                    <IconButton onClick={() => toggleShowMessage(index)} sx={{ ml: 1 }}>
                                                        <Visibility sx={{ color: '#027A9D' }} fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        )}
                                        {consoleMessages[index].isShown && (
                                            <Box
                                                component="pre"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 1,

                                                    backgroundColor: AppStyles.colors['#F5F5F5'],
                                                    border: '0.5px solid #cecdcd',
                                                    maxHeight: 300,
                                                    overflow: 'auto',
                                                }}
                                                maxWidth={600}
                                            >
                                                <Typography
                                                    color={'primary'}
                                                    fontWeight={'bold'}
                                                    sx={{
                                                        fontSize: 12,
                                                        color: executeMessage[index].isSuccess ? '#124116' : '#b23939',
                                                        whiteSpace: 'break-spaces',
                                                    }}
                                                >
                                                    {consoleMessages[index].message}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    {executeMessage[index].message && (
                                        <Box sx={{ color: '#027A9D' }}>
                                            <Typography gutterBottom>Conclusion</Typography>
                                            <Box
                                                component="pre"
                                                sx={{
                                                    borderRadius: 2,
                                                    p: 1,

                                                    backgroundColor: AppStyles.colors['#F5F5F5'],
                                                    border: '0.5px solid #cecdcd',
                                                }}
                                                maxWidth={600}
                                            >
                                                <Typography
                                                    color={'primary'}
                                                    fontWeight={'bold'}
                                                    sx={{
                                                        fontSize: 14,
                                                        color: executeMessage[index].isSuccess ? '#124116' : '#b23939',
                                                        whiteSpace: 'break-spaces',
                                                    }}
                                                >
                                                    {executeMessage[index].message}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {executeMessage[index].loading ? (
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress />
                                        </Box>
                                    ) : (
                                        <React.Fragment>
                                            {script.isAmount && index === 2 ? (
                                                <Autocomplete
                                                    onInputChange={(_, newInputValue) => {
                                                        textChangeHandler(newInputValue, index)
                                                    }}
                                                    size="small"
                                                    options={subjectAreaAmount}
                                                    sx={{ maxWidth: 500, mb: 2 }}
                                                    getOptionLabel={(option) => option.title}
                                                    fullWidth
                                                    renderInput={(params) => <TextField {...params} label="All" />}
                                                    clearOnBlur={false}
                                                />
                                            ) : script.isAmount && index === 3 ? (
                                                <Autocomplete
                                                    onInputChange={(_, newInputValue) => {
                                                        textChangeHandler(newInputValue, index)
                                                    }}
                                                    size="small"
                                                    options={submissionQuestionAmount}
                                                    sx={{ maxWidth: 500, mb: 2 }}
                                                    getOptionLabel={(option) => option.title}
                                                    fullWidth
                                                    renderInput={(params) => <TextField {...params} label="All" />}
                                                    clearOnBlur={false}
                                                />
                                            ) : script.isAmount && index === 5 ? (
                                                <Autocomplete
                                                    onInputChange={(_, newInputValue) => {
                                                        textChangeHandler(newInputValue, index)
                                                    }}
                                                    size="small"
                                                    options={reviewerAccount}
                                                    sx={{ maxWidth: 500, mb: 2 }}
                                                    getOptionLabel={(option) => option.title}
                                                    fullWidth
                                                    renderInput={(params) => <TextField {...params} label="All" />}
                                                    clearOnBlur={false}
                                                />
                                            ) : script.isAmount && (index !== 3 || index !== 4 || index !== 5) ? (
                                                <Autocomplete
                                                    onInputChange={(_, newInputValue) => {
                                                        textChangeHandler(newInputValue, index)
                                                    }}
                                                    size="small"
                                                    options={scriptAmount}
                                                    sx={{ maxWidth: 500, mb: 2 }}
                                                    getOptionLabel={(option) => option.title}
                                                    fullWidth
                                                    renderInput={(params) => <TextField {...params} label="All" />}
                                                    clearOnBlur={false}
                                                />
                                            ) : null}
                                            <LoadingButton
                                                loading={index === scriptLoading}
                                                disabled={!trackId}
                                                variant="contained"
                                                sx={{ textTransform: 'none' }}
                                                onClick={() =>
                                                    handleRunScript(script.scriptFunction, script.header, index)
                                                }
                                            >
                                                Execute
                                            </LoadingButton>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            ))}
        </React.Fragment>
    )
}

export default ScriptExecute
