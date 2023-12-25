import { Box, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ContentBlock = ({ title, content, isClickAble = false }) => {
    return (
        <Box display="flex" alignItems="baseline" mt={2}>
            <Typography width={200} variant="subtitle2" fontWeight={500} sx={{ color: AppStyles.colors['#333333'] }}>
                {title}
            </Typography>
            {isClickAble ? (
                <Box component="a" sx={{ fontSize: 16 }} display="inline-block" href={content} target="_blank">
                    {content}
                </Box>
            ) : (
                <Typography variant="body1" lineHeight={2} flex={1}>
                    {content}
                </Typography>
            )}
        </Box>
    )
}

export default ContentBlock
