import React from 'react'

import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'

const HorizontalLinearStepper = ({ activeStep, steps, alternativeLabel }) => {
    return (
        <Stepper activeStep={activeStep} alternativeLabel={alternativeLabel} sx={{ mb: 2 }}>
            {steps.map((step, index) => {
                return (
                    <Step key={index}>
                        <StepLabel sx={{ fontSize: 20 }}>{step.label}</StepLabel>
                    </Step>
                )
            })}
        </Stepper>
    )
}

export default React.memo(HorizontalLinearStepper)
