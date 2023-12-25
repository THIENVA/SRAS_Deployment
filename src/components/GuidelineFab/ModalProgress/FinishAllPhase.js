import { Step, StepLabel, Stepper } from '@mui/material'

const FinishAllPhase = ({ rows }) => {
    return (
        <Stepper activeStep={rows.length} orientation="vertical">
            {rows.map((step, index) => (
                <Step key={index}>
                    <StepLabel>{step.guidelineGroup}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}

export default FinishAllPhase
