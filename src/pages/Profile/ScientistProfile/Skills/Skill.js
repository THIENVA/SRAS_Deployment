import { Edit } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const Skill = ({ name, issuedYear, issuer, description, index, result, id, handleOpenEdit }) => {
    return (
        <Box
            pt={index === 0 ? 0 : 2}
            mt={2}
            sx={{ borderTop: index !== 0 ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none' }}
        >
            <Box mb={1} display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="body1" fontWeight={700}>
                    {name}
                </Typography>
                <IconButton size="small" onClick={() => handleOpenEdit(id)}>
                    <Edit fontSize="small" sx={{ color: AppStyles.colors['#004DFF'] }} />
                </IconButton>
            </Box>
            {result && (
                <Typography gutterBottom sx={{ color: 'rgba(51, 51, 51, 0.7)' }} variant="body1">
                    score/result: {result}
                </Typography>
            )}
            {description && (
                <Typography gutterBottom sx={{ color: 'rgba(51, 51, 51, 0.7)' }} variant="body1">
                    {description}
                </Typography>
            )}
            {issuer && (
                <Typography gutterBottom sx={{ color: 'rgba(51, 51, 51, 0.7)' }} variant="body1">
                    {issuer}
                </Typography>
            )}
            {issuedYear && (
                <Typography sx={{ color: 'rgba(51, 51, 51, 0.7)' }} variant="body1">
                    issued {issuedYear}
                </Typography>
            )}
        </Box>
    )
}

export default Skill
