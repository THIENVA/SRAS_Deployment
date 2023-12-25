import { List } from '@mui/material'

import ResearchContent from './ResearchContent'

const Researches = ({ computerSkills }) => {
    return (
        <List>
            {computerSkills.map((computerSkill) => (
                <ResearchContent key={computerSkill.id} {...computerSkill} />
            ))}
        </List>
    )
}

export default Researches
