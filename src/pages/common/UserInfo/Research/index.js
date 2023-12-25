import CardLayout from '../Layout/CardLayout'
import Researches from './Researches'

import { researches } from '~/mock'

const Research = () => {
    return (
        <CardLayout title="Computer Skills" nameModal="Edit">
            <Researches computerSkills={researches} />
        </CardLayout>
    )
}

export default Research
