import { memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

import SectionLayout from './SectionLayout'

const Withdraw = ({ stateWithdraw, setStateWithdraw }) => {
    const handleWithdraw = (event, index) => {
        const updatedStateWithdraw = cloneDeep(stateWithdraw)
        updatedStateWithdraw[index].value = event.target.checked
        setStateWithdraw(updatedStateWithdraw)
    }

    return (
        <SectionLayout title="WITHDRAW">
            {stateWithdraw.map((withdraw, index) => (
                <Box key={withdraw.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography minWidth={500} align="right">
                        {withdraw.name}
                    </Typography>
                    <FormControlLabel
                        key={withdraw.id}
                        control={
                            <Checkbox
                                size="small"
                                sx={{ p: 0, mr: 0.5 }}
                                name={stateWithdraw.name}
                                checked={stateWithdraw.value}
                            />
                        }
                        label={stateWithdraw.checkboxName}
                        sx={{ ml: 1.5 }}
                        onChange={(event) => handleWithdraw(event, index)}
                    />
                </Box>
            ))}
        </SectionLayout>
    )
}

export default memo(Withdraw)
