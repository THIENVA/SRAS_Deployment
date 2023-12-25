import React from 'react'

import ScholarShip from './ScholarShip'

const ListScholarShip = ({ scholarShips, handleOpenEdit }) => {
    return (
        <React.Fragment>
            {scholarShips.map((scholarShip, index) => (
                <ScholarShip
                    {...scholarShip}
                    key={scholarShip.id}
                    index={index}
                    id={scholarShip.id}
                    handleOpenEdit={handleOpenEdit}
                />
            ))}
        </React.Fragment>
    )
}

export default ListScholarShip
