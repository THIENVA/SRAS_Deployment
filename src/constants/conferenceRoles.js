const ROLES_NAME = {
    CHAIR: 'Chair',
    AUTHOR: 'Author',
    REVIEWER: 'Reviewer',
    TRACK_CHAIR: 'Track Chair',
}

const ROLES_ID = {
    TRACK_CHAIR: 1,
    AUTHOR: 2,
    REVIEWER: 3,
    CHAIR: 4,
}

const ROLE_ACCESS = {
    TRACK_CHAIR_AUTHOR: ['Chair', 'Track Chair', 'Author'],
    REVIEWER: ['Reviewer'],
    AUTHOR: ['Author'],
    TRACK_CHAIR: ['Chair', 'Track Chair'],
    CHAIR: ['Chair'],
    ALL: ['Chair', 'Track Chair', 'Reviewer', 'Author'],
    ADMIN: ['Admin'],
}

export { ROLES_ID, ROLES_NAME, ROLE_ACCESS }
