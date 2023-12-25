import { v4 as uuid } from 'uuid'

const awards = [
    {
        id: 1,
        name: 'DAAD Surplace scholarship',
        year: 2006,
    },
    {
        id: 2,
        name: 'Gold medal award of Ho Chi Minh City University of Technology for Excellent Student in 2005.',
        year: 2005,
    },
    {
        id: 3,
        name: 'Scholarship award of SAMSUNG VINA Electronics Company',
        year: 2004,
    },
    {
        id: 4,
        name: 'Second prize award in Physics Competition in Ho Chi Minh City',
        year: 2000,
    },
]

const scholarShips = [
    {
        id: 1,
        name: 'World Class Professor Scheme Award',
        year: 2006,
        where: 'Technology and Higher Education',
    },
    {
        id: 2,
        name: 'Excellent Service Award.',
        year: 2005,
        where: 'Citra Karisma UTM',
    },
    {
        id: 3,
        name: 'UTMShine Award',
        year: 2004,
        where: 'UTM',
    },
    {
        id: 4,
        name: 'Ciation Award',
        year: 2000,
        where: 'Malaysian Institute of Chemistry',
    },
]

const researches = [
    {
        id: 1,
        name: 'Multi-channel MAC for Wireless Ad hoc Network',
    },
    {
        id: 2,
        name: 'Multi-channel MAC for Vehicular Ad hoc Networks',
    },
    {
        id: 3,
        name: 'Internet of Things',
    },
]

const skills = [
    {
        id: 1,
        name: 'IELTS',
        year: 2006,
        where: 'British Council',
    },
    {
        id: 2,
        name: 'JLPT-level 2.',
        year: 2005,
        where: 'JEES',
    },
    {
        id: 3,
        name: 'TOPIK-level 2',
        year: 2004,
        where: 'NIIED',
    },
]

const countries = [
    {
        code: 'anhndtse150640@fpt.edu.vn',
        label: 'Nguyen Dang Truong Anh',
        img: 'https://www.faceapp.com/static/img/content/compare/beard-example-before@3x.jpg',
    },
    {
        code: 'danhntse150740@fpt.edu.vn',
        label: 'Nguyen Truong Anh',
        img: 'https://goldenmeancalipers.com/wp-content/uploads/2011/12/mirror11.jpg',
    },
    {
        code: 'andtse150331@fpt.edu.vn',
        label: 'Do Thanh An (K15 HCM)',
        img: 'https://images.healthshots.com/healthshots/en/uploads/2022/07/01225819/banana-face-mask-1600x900.jpg',
    },
    {
        code: 'tienthse150669@fpt.edu.vn',
        label: 'Tran Minh Tien (K15 HCM)',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVP1gmGpsaLb1EFpAqMr7lVu5sgBuYw4NJ5A&usqp=CAU',
    },
    {
        code: 'vynhss150784@fpt.edu.vn',
        label: 'Nguyen Ha Vy (K15 HCM)',
        img: 'https://www.cutislaserclinics.com/wp-content/uploads/2018/02/Achieve-Youthful-V-Shape-Face.jpg',
    },
    {
        code: 'chinhtcse150740@fpt.edu.vn',
        label: 'Truong Cong Chinh (K15 HCM)',
        img: 'https://img.freepik.com/free-photo/beautiful-female-face-perfect-clean-skin-face-white_155003-32164.jpg?w=2000',
    },
    {
        code: 'toannhse140240@fpt.edu.vn',
        label: 'Nguyen Huu Toan (K14 HCM)',
        img: 'https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528',
    },
]

const tracks = [
    {
        id: 1,
        label: 'CNTT',
    },
    {
        id: 2,
        label: 'IOT',
    },
    {
        id: 3,
        label: 'AI',
    },
]

const conferenceRole = [
    {
        id: 1,
        label: 'Track Chair',
    },
    {
        id: 2,
        label: 'Chair',
    },
    {
        id: 3,
        label: 'Reviewer',
    },
]

const committees = [
    {
        id: 1,
        name: 'Nguyen Dang Truong Anh',
        email: 'anhndtse150640@fpt.edu.vn',
        imageUrl:
            'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
        grade: 'FPT University',
        topics: [
            {
                id: 1,
                name: 'Wireless',
                numPaper: 2,
            },
            {
                id: 2,
                name: 'Ad Hoc Network',
                numPaper: 3,
            },
            {
                id: 3,
                name: 'VANET ',
                numPaper: 6,
            },
        ],
    },
    {
        id: 2,
        name: 'Nguyen Dang Truong Anh',
        email: 'anhndtse150640@fpt.edu.vn',
        imageUrl:
            'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8&w=1000&q=80',
        grade: 'FPT University',
        topics: [
            {
                id: 1,
                name: 'Wireless',
                numPaper: 2,
            },
            {
                id: 2,
                name: 'Ad Hoc Network',
                numPaper: 3,
            },
            {
                id: 3,
                name: 'VANET ',
                numPaper: 6,
            },
        ],
    },
]

const importantDates = [
    {
        id: 5,
        label: 'Camera-Ready Submissions',
        value: 5,
    },
    {
        id: 6,
        label: 'Workshop Proposals',
        value: 6,
    },
    {
        id: 7,
        label: 'Panel Proposals',
        value: 7,
    },
]

const submissionLimited = [
    {
        id: 10,
        label: '< 10',
        value: 10,
    },
    {
        id: 50,
        label: '< 50',
        value: 50,
    },
    {
        id: 100,
        label: '< 100',
        value: 100,
    },
    {
        id: 500,
        label: '< 500',
        value: 500,
    },
]

const trackChairConsole = [
    {
        paper: 212,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Greate Title Sub',
        firstName: 'Jarret',
        lastName: 'Rau',
        organization: 'FPTU',
        email: 'jarret@gmail.com',
        plagiaCheck: true,
        validNumberPage: 2,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duc',
                lastName: 'Dang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: '',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 1,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: 'individual conflict',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: true,
            },
        ],
    },
    {
        paper: 212,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Greate Title Sub',
        firstName: 'Jarret',
        lastName: 'Rau',
        organization: 'FPTU',
        email: 'jarret@gmail.com',
        plagiaCheck: true,
        validNumberPage: 2,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duc',
                lastName: 'Dang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: '',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 1,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: 'individual conflict',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: true,
            },
        ],
    },
    {
        paper: 212,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Greate Title Sub',
        firstName: 'Jarret',
        lastName: 'Rau',
        organization: 'FPTU',
        email: 'jarret@gmail.com',
        plagiaCheck: true,
        validNumberPage: 2,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duc',
                lastName: 'Dang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: '',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 1,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: 'individual conflict',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: true,
            },
        ],
    },
    {
        paper: 212,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Greate Title Sub',
        firstName: 'Jarret',
        lastName: 'Rau',
        organization: 'FPTU',
        email: 'jarret@gmail.com',
        plagiaCheck: true,
        validNumberPage: 2,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duc',
                lastName: 'Dang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: '',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 1,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: 'individual conflict',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: true,
            },
        ],
    },
    {
        paper: 212,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Greate Title Sub',
        firstName: 'Jarret',
        lastName: 'Rau',
        organization: 'FPTU',
        email: 'jarret@gmail.com',
        plagiaCheck: true,
        validNumberPage: 2,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duc',
                lastName: 'Dang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: '',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 1,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: 'individual conflict',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: true,
            },
        ],
    },
    {
        paper: 212,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: 'Greate Title Sub',
        firstName: 'Jarret',
        lastName: 'Rau',
        organization: 'FPTU',
        email: 'jarret@gmail.com',
        plagiaCheck: true,
        validNumberPage: 2,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duc',
                lastName: 'Dang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: '',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 1,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: 'individual conflict',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: true,
            },
        ],
    },
    {
        paper: 231,
        abstract:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        title: '3D car gallery website',
        firstName: 'Anh',
        lastName: 'Nguyen',
        organization: 'FPTU',
        email: 'anhndtse150640@fpt.edu.vn',
        plagiaCheck: true,
        validNumberPage: 1,
        department: 'FPTU',
        author: [
            {
                firstName: 'Nhu',
                lastName: 'Le Thi Quynh',
                department: 'FPTU',
            },
            {
                firstName: 'Anh',
                lastName: 'Nguyen Dang Truong',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Information Technology',
        secondarySubject: 'Cloud Computing',
        noSubFiles: 2,
        noConflict: 2,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: true,
        discussion: true,
        numberDiscussion: 1,
        requestAuthorFeedback: true,
        authorFeedbackSubmit: false,
        status: 3,
        cameraReady: false,
        cameraSubmit: false,
        presentRequest: true,
        conflicts: 'is/was a colleague (In last 2 years)',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Author',
        multiConflict: [
            {
                name: 'a co-author',
                value: true,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: false,
            },
        ],
    },
    {
        paper: 333,
        abstract:
            'Author Send Email To Track Chair Testing 1\n\nDownload the CMT app to access submissions and reviews on the move and receive notifications:\nhttps://apps.apple.com/us/app/conference-management-toolkit/id1532488001\nhttps://play.google.com/store/apps/details?id=com.microsoft.research.cmt\n\nTo stop receiving conference emails, you can check the Do not send me conference email box from your User Profile.\n\nMicrosoft respects your privacy. To learn more, please read our Privacy Statement.\n\nMicrosoft Corporation\nOne Microsoft Way\nRedmond, WA 98052',
        title: 'Power Supply',
        firstName: 'Thuong',
        lastName: 'Hoang',
        organization: 'FPTU',
        email: 'thuonghthse140087@fpt.edu.vn',
        plagiaCheck: false,
        validNumberPage: 3,
        department: 'FPTU',
        author: [
            {
                firstName: 'Duong',
                lastName: 'Mai Hoang',
                department: 'FPTU',
            },
            {
                firstName: 'Thuong',
                lastName: 'Thi Hoai Hoang',
                department: 'FPTU',
            },
        ],
        noUnregisterdAuthors: 0,
        track: 'Capstone Project',
        primarySubject: 'Artificial Intelligence',
        secondarySubject: 'Information Technology',
        noSubFiles: 1,
        noConflict: 3,
        disputedConflicted: 0,
        reviewers: [
            {
                firstName: 'Hien',
                lastName: 'Bui',
                department: 'FPTU',
            },
            {
                firstName: 'Nhu',
                lastName: 'Le',
                department: 'FPTU',
            },
        ],
        assigned: 2,
        completed: 1,
        percentCompleted: '50%',
        bids: 0,
        readonly: false,
        discussion: false,
        numberDiscussion: 1,
        requestAuthorFeedback: false,
        authorFeedbackSubmit: true,
        status: 2,
        cameraReady: true,
        cameraSubmit: false,
        presentRequest: false,
        conflicts: '',
        sentOn: '2023-05-13 10:18:55',
        expiresOn: '2023-05-13 10:18:55',
        fromRole: 'Track Chair',
        multiConflict: [
            {
                name: 'a co-author',
                value: false,
            },
            {
                name: 'is/was  a colleague (in last 2 years)',
                value: false,
            },
        ],
    },
]

const userConferenceRole = [
    {
        email: 'jarret@gmail.com',
        firstName: 'Micheal',
        lastName: 'Jarret',
        organization: 'FPTU',
        roles: [
            {
                id: 1,
                name: 'Track Chair',
                value: 'track-chair',
                tracks: {
                    tracksEngaged: [
                        {
                            id: 1,
                            name: 'Capstone project',
                        },
                        {
                            id: 2,
                            name: 'Semester 8',
                        },
                    ],
                    tracksAvailable: [
                        {
                            id: 3,
                            name: 'Semester 9',
                        },
                    ],
                },
            },
        ],
        rolesNotAdded: [
            {
                id: 3,
                name: 'Reviewer',
                value: 'reviewer',
                tracks: {
                    tracksEngaged: [],
                    tracksAvailable: [
                        {
                            id: 1,
                            name: 'Capstone project',
                        },
                        {
                            id: 2,
                            name: 'Semester 8',
                        },
                        {
                            id: 3,
                            name: 'Semester 9',
                        },
                    ],
                },
            },
        ],
    },
    {
        email: 'anhndtse150640@fpt.edu.vn',
        firstName: 'Nguyen',
        lastName: 'Anh',
        organization: 'FPTU',
        roles: [],
        rolesNotAdded: [
            {
                id: 1,
                name: 'Track Chair',
                value: 'track-chair',
                tracks: {
                    tracksEngaged: [],
                    tracksAvailable: [
                        {
                            id: 1,
                            name: 'Capstone project',
                        },
                        {
                            id: 2,
                            name: 'Semester 8',
                        },
                        {
                            id: 3,
                            name: 'Semester 9',
                        },
                    ],
                },
            },
            {
                id: 3,
                name: 'Reviewer',
                value: 'reviewer',
                tracks: {
                    tracksEngaged: [],
                    tracksAvailable: [
                        {
                            id: 1,
                            name: 'Capstone project',
                        },
                        {
                            id: 2,
                            name: 'Semester 8',
                        },
                        {
                            id: 3,
                            name: 'Semester 9',
                        },
                    ],
                },
            },
        ],
    },
    {
        email: 'thuonghthse140087@fpt.edu.vn',
        firstName: 'Hoang',
        lastName: 'Thuong',
        organization: 'FPTU',
        roles: [
            {
                id: 3,
                name: 'Reviewer',
                value: 'reviewer',
                tracks: {
                    tracksEngaged: [
                        {
                            id: 1,
                            name: 'Capstone project',
                        },
                    ],
                    tracksAvailable: [
                        {
                            id: 3,
                            name: 'Semester 9',
                        },
                        {
                            id: 2,
                            name: 'Semester 8',
                        },
                    ],
                },
            },
        ],
        rolesNotAdded: [
            {
                id: 1,
                name: 'Track Chair',
                value: 'track-chair',
                tracks: {
                    tracksEngaged: [],
                    tracksAvailable: [
                        {
                            id: 1,
                            name: 'Capstone project',
                        },
                        {
                            id: 2,
                            name: 'Semester 8',
                        },
                        {
                            id: 3,
                            name: 'Semester 9',
                        },
                    ],
                },
            },
        ],
    },
]
const submissionSummary = {
    conferenceName: 'Research Festival 2023 in FPT University',
    track: 'Capstone Project',
    paperId: 221,
    title: 'Paper of Truong Anh 1',
    abstract: 'This is abstract',
    createdOn: '19:43:04 9/5/2023',
    lastModified: '19:43:04 9/5/2023',
    authors: [
        {
            fullName: 'Anh Nguyen',
            organization: 'FPTU',
            email: 'anhndtse150640@fpt.edu.vn',
            isRegistered: true,
        },
    ],
    primarySubject: 'Information Technology',
    domainConflicts: 'hola.fe.vn',
    conflictsOfInterest: [
        {
            fullName: 'Anh Nguyen',
            email: 'anhndtse150640@fpt.edu.vn',
            conflicts: [
                {
                    name: 'a co-author',
                },
            ],
        },
        {
            fullName: 'Nhu Le',
            email: 'nhultqse140703@fpt.edu.vn',
            conflicts: [
                {
                    name: 'is/was a colleague (In last 2 years)',
                },
                {
                    name: 'or I, is / was a Primary Thesis Advisor at anytime',
                },
            ],
        },
    ],
    submissionFiles: [{ name: 'IEEE_Copyright form.pdf' }],
    revisionFiles: [{ name: 'Revision file.pdf' }],
    questionsResponse: [
        {
            id: uuid(),
            required: true,
            text: 'Chọn một đáp án',
            title: 'Đang làm',
            type: 'select',
            typeName: 'Options',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'radio',
                    multiple: false,
                    value: [
                        {
                            id: uuid(),
                            value: 'Đồ án tốt nghiệp',
                        },
                        {
                            id: uuid(),
                            value: 'Capstone project',
                        },
                    ],
                    valueInput: 'Đồ án tốt nghiệp',
                    valueInputType: 'string',
                },
            },
        },
        {
            id: uuid(),
            required: true,
            text: 'Điền điện thoại',
            title: 'Số điện thoại',
            type: 'textarea',
            typeName: 'Comment',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'textarea',
                    value: 2000,
                    valueInput: '0948264856',
                    valueInputType: 'string',
                },
            },
        },
        {
            id: uuid(),
            required: true,
            text: 'Affiliation',
            title: 'Cơ sở đào tạo',
            type: 'select',
            typeName: 'Options',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'checkbox',
                    multiple: true,
                    value: [
                        {
                            id: uuid(),
                            value: 'FU',
                        },
                        {
                            id: uuid(),
                            value: 'FA',
                        },
                    ],
                    valueInput: ['FU', 'FA'],
                    valueInputType: 'array',
                },
            },
        },
        {
            id: uuid(),
            required: true,
            text: 'Yes or No',
            title: 'Will you marry me?',
            type: 'checkbox',
            typeName: 'Agreement',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'checkbox',
                    value: false,
                    valueInput: true,
                    valueInputType: 'boolean',
                },
            },
        },
        {
            id: uuid(),
            required: true,
            text: 'UwU',
            title: 'UwU',
            type: 'select',
            typeName: 'Options',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'select',
                    multiple: false,
                    value: [
                        {
                            id: uuid(),
                            value: 'Ara Ara',
                        },
                        {
                            id: uuid(),
                            value: 'Oni-chan',
                        },
                    ],
                    valueInput: 'Ara Ara',
                    valueInputType: 'string',
                },
            },
        },
        {
            id: uuid(),
            required: true,
            text: 'project mỗi kì',
            title: 'FPT projects',
            type: 'selectWithValue',
            typeName: 'Options with value',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'selectMultiple',
                    multiple: true,
                    value: [
                        {
                            id: uuid(),
                            value: 'Kì 7',
                            point: 1,
                        },
                        {
                            id: uuid(),
                            value: 'Kì 8',
                            point: 2,
                        },
                        {
                            id: uuid(),
                            value: 'Kì 9',
                            point: 3,
                        },
                    ],
                    valueInput: new Array(),
                    valueInputType: 'string',
                },
            },
        },
        {
            id: uuid(),
            required: true,
            text: 'Foods',
            title: 'Choose your favourite food',
            type: 'selectWithValue',
            typeName: 'Options with value',
            visibleToUser: false,
            showAs: {
                result: {
                    render: 'checkbox',
                    multiple: true,
                    value: [
                        {
                            id: uuid(),
                            value: 'Bánh Mì',
                            point: 1,
                        },
                        {
                            id: uuid(),
                            value: 'Phở',
                            point: 2,
                        },
                        {
                            id: uuid(),
                            value: 'Bún bò',
                            point: 3,
                        },
                    ],
                    valueInput: new Array(),
                    valueInputType: 'string',
                },
            },
        },
    ],
}

export {
    awards,
    committees,
    conferenceRole,
    countries,
    importantDates,
    researches,
    scholarShips,
    skills,
    submissionLimited,
    submissionSummary,
    trackChairConsole,
    tracks,
    userConferenceRole,
}
