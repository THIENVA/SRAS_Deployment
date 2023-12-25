import { get, patch, post, put } from '~/utils/ApiCaller'

const useProfile = () => {
    const checkHasProfile = (userId, firstSignal) =>
        get({ endpoint: `/researcher-profile/${userId}/hasResearcherProfile`, signal: firstSignal })

    const checkPrimaryEmail = (userId, email) =>
        get({ endpoint: `/researcher-profile/send-link-confirm-and-check-duplicate/${userId}/${email}` })

    const verifyEmail = (userId, email, signal) =>
        get({ endpoint: `/researcher-profile/confirm-primary-email/${userId}/${email}`, signal })

    const createGeneralProfile = (generalProfile) => post({ endpoint: '/researcher-profile', body: generalProfile })

    const getGeneralProfile = (userId, signal) => get({ endpoint: `/researcher-profile/${userId}`, signal })

    const updateWebSocialLinks = (userId, links) =>
        patch({ endpoint: `/researcher-profile/update-website-social-links/${userId}`, body: links })

    const updateOtherIds = (userId, links) =>
        patch({ endpoint: `/researcher-profile/update-others-id/${userId}`, body: links })

    const updateAlsoKnownAs = (userId, names) =>
        patch({ endpoint: `/researcher-profile/update-also-known-as/${userId}`, body: names })

    const getWorkplace = (userId, signal) => get({ endpoint: `/researcher-profile/get-workplace/${userId}`, signal })

    const updateWorkplace = (userId, workplace) =>
        patch({ endpoint: `/researcher-profile/update-workplace/${userId}`, body: workplace })

    const getAcademicDegree = (signal) =>
        get({ endpoint: '/researcher-profile/get-academic-degree-level-json', signal })

    const getEducations = (userId, signal) => get({ endpoint: `/researcher-profile/get-education/${userId}`, signal })

    const updateEducation = (userId, educations) =>
        patch({ endpoint: `/researcher-profile/update-education/${userId}`, body: educations })

    const getEmployment = (userId, signal) => get({ endpoint: `/researcher-profile/get-employment/${userId}`, signal })

    const updateEmployment = (userId, employments) =>
        patch({ endpoint: `/researcher-profile/update-employment/${userId}`, body: employments })

    const getScholarships = (userId, signal) =>
        get({ endpoint: `/researcher-profile/get-scholarships/${userId}`, signal })

    const updateScholarship = (userId, scholarships) =>
        patch({ endpoint: `/researcher-profile/update-scholarships/${userId}`, body: scholarships })

    const getAwards = (userId, signal) => get({ endpoint: `/researcher-profile/get-award/${userId}`, signal })

    const updateAward = (userId, awards) =>
        patch({ endpoint: `/researcher-profile/update-award/${userId}`, body: awards })

    const getSkills = (userId, signal) => get({ endpoint: `/researcher-profile/get-skill/${userId}`, signal })

    const updateSkill = (userId, skills) =>
        patch({ endpoint: `/researcher-profile/update-skill/${userId}`, body: skills })

    const getResearch = (userId, signal) =>
        get({ endpoint: `/researcher-profile/get-research-direction/${userId}`, signal })

    const updateResearch = (userId, research) =>
        patch({ endpoint: `/researcher-profile/update-research-direction/${userId}`, body: research })

    const getPublications = (userId, signal) =>
        get({ endpoint: `/researcher-profile/get-publication/${userId}`, signal })

    const updatePublications = (userId, publication) =>
        patch({ endpoint: `/researcher-profile/update-publication/${userId}`, body: publication })

    const getWorkType = (signal) => get({ endpoint: `/researcher-profile/get-work-type-reference-json`, signal })

    const updateScienceProfile = (userId, profile) =>
        put({ endpoint: `/researcher-profile/update-science-profile/${userId}`, body: profile })

    const updateGeneralProfile = (userId, profile) =>
        put({ endpoint: `/researcher-profile/update-personal-profile/${userId}`, body: profile })

    return {
        checkHasProfile,
        checkPrimaryEmail,
        verifyEmail,
        createGeneralProfile,
        getGeneralProfile,
        updateWebSocialLinks,
        updateOtherIds,
        updateAlsoKnownAs,
        getWorkplace,
        updateWorkplace,
        getAcademicDegree,
        getEducations,
        updateEducation,
        getEmployment,
        updateEmployment,
        getScholarships,
        updateScholarship,
        getAwards,
        updateAward,
        getSkills,
        updateSkill,
        getResearch,
        updateResearch,
        getPublications,
        updatePublications,
        getWorkType,
        updateScienceProfile,
        updateGeneralProfile,
    }
}

export default useProfile
