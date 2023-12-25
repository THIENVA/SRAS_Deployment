import CardLayout from '../Layout/CardLayout'
import ListScholarShip from './ScholarShips'

import { scholarShips } from '~/mock'

const ScholarShips = () => {
    return (
        <CardLayout title="Scholarships" nameModal="Edit">
            <ListScholarShip scholarShips={scholarShips} />
        </CardLayout>
    )
}

export default ScholarShips
