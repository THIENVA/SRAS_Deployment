import { FiberManualRecord } from '@mui/icons-material'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'

const ResearchContent = ({ name }) => {
    return (
        <ListItem>
            <ListItemIcon>
                <FiberManualRecord />
            </ListItemIcon>
            <ListItemText primary={name} />
        </ListItem>
    )
}

export default ResearchContent
