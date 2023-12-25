import CardLayout from '../Layout/CardLayout'
import ListAward from './Awards'

import { awards } from '~/mock'

const Awards = () => {
    return (
        <CardLayout title="Awards" nameModal="Edit">
            <ListAward awards={awards} />
        </CardLayout>
    )
}

export default Awards
