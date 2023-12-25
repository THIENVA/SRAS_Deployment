import React from 'react'

import Award from './Award'

const ListAward = ({ awards, handleOpenEdit }) => {
    return (
        <React.Fragment>
            {awards.map((award, index) => (
                <Award {...award} key={award.id} index={index} id={award.id} handleOpenEdit={handleOpenEdit} />
            ))}
        </React.Fragment>
    )
}

export default ListAward
