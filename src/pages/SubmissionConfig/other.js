import { Fragment, memo } from 'react'

import { cloneDeep } from 'lodash'

import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material'

const Other = ({ stateOther, setStateOther }) => {
    const handleOther = (event, index) => {
        const updatedStateOther = cloneDeep(stateOther)
        updatedStateOther[index].value = event.target.checked
        setStateOther(updatedStateOther)
    }
    return (
        <Fragment>
            {stateOther.map((other, index) => (
                <Box key={other.id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Typography minWidth={500} maxWidth={500} align="right">
                        {other.name}
                    </Typography>
                    <FormControlLabel
                        key={other.id}
                        control={
                            <Checkbox size="small" sx={{ p: 0, mr: 0.5 }} name={other.name} checked={other.value} />
                        }
                        label={other.checkboxName}
                        sx={{ ml: 1.5 }}
                        onChange={(event) => handleOther(event, index)}
                    />
                </Box>
            ))}
        </Fragment>
    )
}

export default memo(Other)
