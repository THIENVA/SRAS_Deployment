import React from 'react'

import { Checkbox, FormControlLabel, Grid, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SelectSubject = ({ values, handleCheckboxChange, index }) => {
    return (
        <Grid container item sx={{ boxShadow: 'inset 0 -1px 0 #edeeef', alignItems: 'center' }}>
            <Grid item xs={4}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.primary}
                            size="small"
                            onChange={() => handleCheckboxChange(index, 'primary')}
                        />
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={values.secondary}
                            size="small"
                            onChange={() => handleCheckboxChange(index, 'secondary')}
                        />
                    }
                />
            </Grid>
            <Grid item xs={4}>
                <Typography sx={{ color: AppStyles.colors['#495057'] }}>{values.name}</Typography>
            </Grid>
        </Grid>
    )
}

export default SelectSubject
