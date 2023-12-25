import { HelpOutline } from '@mui/icons-material'
import { Box, Tooltip, Typography, Zoom } from '@mui/material'
import { grey } from '@mui/material/colors'

const InputField = ({
    children,
    isRequire,
    text,
    textStyle,
    boxStyle,
    textBoxStyle,
    otherTextProps,
    explainText,
    explainPosition,
}) => {
    return (
        <Box sx={{ ...boxStyle }}>
            <Box display="flex" maxWidth={800} sx={{ ...textBoxStyle }}>
                <Typography sx={{ fontSize: 26, opacity: '60%', ...textStyle }} fontWeight={500} {...otherTextProps}>
                    {text}
                    {isRequire && (
                        <Box component={'span'} sx={{ color: 'red', pl: 0.5 }}>
                            *
                        </Box>
                    )}
                </Typography>
                {explainText && (
                    <Tooltip title={explainText} TransitionComponent={Zoom} placement={explainPosition}>
                        <HelpOutline fontSize="inherit" sx={{ ml: 1, color: grey[600] }} />
                    </Tooltip>
                )}
            </Box>
            {children}
        </Box>
    )
}

export default InputField
