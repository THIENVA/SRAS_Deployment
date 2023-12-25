import React from 'react'

import Award from './Award'

const ListAward = ({ awards }) => {
    return (
        <React.Fragment>
            {awards.map((award) => (
                <Award name={award.name} year={award.year} key={award.id} />
            ))}
        </React.Fragment>
    )
}

export default ListAward
