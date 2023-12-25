import React from 'react'

import { Box, TextField, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SuggestionForChair = ({ suggestionForChair, handleChange, messageError, error }) => {
    return (
        <React.Fragment>
            <Box
                sx={{
                    mt: 4,
                    px: 2,
                    py: 1,
                    backgroundColor: (theme) => theme.palette.primary.main,
                    boxShadow: 'inset 0 -1px 0 #edeeef',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: AppStyles.colors['#F7F7F7'],
                        textTransform: 'uppercase',
                    }}
                >
                    Review Suggestion for Chair
                    <span style={{ color: 'red' }}> *</span>
                </Typography>
            </Box>
            <TextField
                value={suggestionForChair}
                onChange={handleChange}
                size="small"
                sx={{ mt: 2 }}
                name="suggestionForChair"
                fullWidth
                multiline
                minRows={5}
                maxRows={9}
                error={error.suggestionForChair}
                helperText={error.suggestionForChair ? messageError.suggestionForChair : ''}
            />
        </React.Fragment>
    )
}

export default SuggestionForChair
