import React from 'react'

import { Box, TextField, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SuggestionForAuthor = ({ suggestionForAuthor, handleChange, messageError, error }) => {
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
                    Reviewer(s) Comment to Authors
                    <span style={{ color: 'red' }}> *</span>
                </Typography>
            </Box>
            <TextField
                value={suggestionForAuthor}
                onChange={handleChange}
                size="small"
                sx={{ mt: 2 }}
                fullWidth
                name="suggestionForAuthor"
                multiline
                minRows={5}
                maxRows={9}
                error={error.suggestionForAuthor}
                helperText={error.suggestionForAuthor ? messageError.suggestionForAuthor : ''}
            />
        </React.Fragment>
    )
}

export default SuggestionForAuthor
