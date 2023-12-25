import React from 'react'

import ScholarShip from './ScholarShip'

const ListScholarShip = ({ scholarShips }) => {
    return (
        <React.Fragment>
            {scholarShips.map((scholarShip) => (
                <ScholarShip {...scholarShip} key={scholarShip.id} />
            ))}
        </React.Fragment>
    )
}

export default ListScholarShip
