import CardLayout from '../Layout/CardLayout'
import Skill from './Skill'

import { skills } from '~/mock'

const Research = () => {
    return (
        <CardLayout title="Language" nameModal="Edit">
            {skills.map((skill) => (
                <Skill {...skill} key={skill.id} />
            ))}
        </CardLayout>
    )
}

export default Research
