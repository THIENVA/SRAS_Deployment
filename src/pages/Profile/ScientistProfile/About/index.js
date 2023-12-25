import React, { useState } from 'react'

import PersonalModal from '../../ModalComponent/EditPersonalInfo'
import CardLayout from '../Layout/CardLayout'
import ContentBlock from './ContentBlock'

import { capitalizeFirstLetter, formatFaxNumber, formatPhoneNumber } from '~/utils/commonFunction'

const About = ({
    gender,
    introduction,
    fax,
    mobilePhone,
    phoneNumber,
    dateOfBirth,
    homeAddress,
    userId,
    profile,
    setProfile,
}) => {
    const [openGeneralProfile, setOpenGeneralProfile] = useState(false)
    const handleOpenAcademicInfo = () => setOpenGeneralProfile(true)
    const handleCloseAcademicInfo = () => setOpenGeneralProfile(false)
    return (
        <React.Fragment>
            <CardLayout handleOpenModal={handleOpenAcademicInfo} title="Overview">
                <ContentBlock title="Home Adress" content={capitalizeFirstLetter(homeAddress)} />
                <ContentBlock title="Phone Number" content={formatPhoneNumber(phoneNumber)} />
                <ContentBlock title="Mobile Phone" content={formatPhoneNumber(mobilePhone)} />
                <ContentBlock title="Fax" content={formatFaxNumber(fax)} />
                <ContentBlock title="Date of Birth" content={new Date(dateOfBirth).toLocaleDateString('en-GB')} />
                <ContentBlock title="Gender" content={capitalizeFirstLetter(gender)} />
                <ContentBlock title="Introduction" content={capitalizeFirstLetter(introduction)} />
            </CardLayout>
            {openGeneralProfile && (
                <PersonalModal
                    gender={gender}
                    introduction={introduction}
                    fax={fax}
                    open={openGeneralProfile}
                    phoneNumber={phoneNumber}
                    dateOfBirth={dateOfBirth}
                    homeAddress={homeAddress}
                    mobilePhone={mobilePhone}
                    handleClose={handleCloseAcademicInfo}
                    userId={userId}
                    profile={profile}
                    setProfile={setProfile}
                />
            )}
        </React.Fragment>
    )
}

export default About
