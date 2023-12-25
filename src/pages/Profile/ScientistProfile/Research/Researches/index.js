import { List } from '@mui/material'

import ResearchContent from './ResearchContent'

const Researches = ({ researches, handleOpenEdit }) => {
    return (
        <List>
            {researches.map((research) => (
                <ResearchContent key={research.researchDirectionId} handleOpenEdit={handleOpenEdit} {...research} />
            ))}
        </List>
    )
}

export default Researches
