import React from 'react'

import { Box, Skeleton, TextField, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const SuggestionForAuthor = ({ suggestionForAuthor, handleChange, loading }) => {
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
                </Typography>
            </Box>
            {loading ? (
                <Skeleton sx={{ mt: 2 }} variant="rounded" animation="wave" width="100%" height={200} />
            ) : (
                <TextField
                    value={suggestionForAuthor}
                    onChange={handleChange}
                    size="small"
                    sx={{ mt: 2 }}
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={9}
                />
            )}
        </React.Fragment>
    )
}

export default SuggestionForAuthor
