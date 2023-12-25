import { useHistory, useParams } from 'react-router-dom'

import { LaunchOutlined } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { Box, IconButton, Step, StepContent, StepLabel, Stepper, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CurrentStep = ({ currentStep, guideLines, handleNext, activityDeadlineId, finishStepLoading }) => {
    const { conferenceId } = useParams()
    const history = useHistory()
    return (
        <Stepper activeStep={currentStep} orientation="vertical">
            {guideLines.map((step, index) => (
                <Step completed={step.isFinished} key={index}>
                    <Box display="flex" alignItems="center">
                        <StepLabel>{step.name}</StepLabel>
                        <IconButton
                            // disabled={!step.isFinished}
                            onClick={() => history.push(step.route.replace(':conferenceId', conferenceId))}
                            size="small"
                        >
                            <LaunchOutlined sx={{ color: AppStyles.colors['#004DFF'] }} fontSize="small" />
                        </IconButton>
                    </Box>
                    <StepContent>
                        <Typography>{step.description}</Typography>
                        <Box sx={{ mb: 2 }}>
                            <div>
                                <LoadingButton
                                    variant="contained"
                                    onClick={() =>
                                        handleNext(
                                            index,
                                            step.isFinishedMarkingGuideline,
                                            step.name,
                                            activityDeadlineId
                                        )
                                    }
                                    loading={finishStepLoading}
                                    disabled={finishStepLoading}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Continue
                                </LoadingButton>
                            </div>
                        </Box>
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    )
}

export default CurrentStep
