import { Edit, FiberManualRecord } from '@mui/icons-material'
import { IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ResearchContent = ({ researchDirectionName, researchDirectionId, handleOpenEdit }) => {
    return (
        <ListItem
            secondaryAction={
                <IconButton onClick={() => handleOpenEdit(researchDirectionId)} edge="end">
                    <Edit sx={{ color: AppStyles.colors['#004DFF'] }} />
                </IconButton>
            }
        >
            <ListItemIcon sx={{ minWidth: 32 }}>
                <FiberManualRecord fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={researchDirectionName} />
        </ListItem>
    )
}

export default ResearchContent
