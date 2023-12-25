import React, { useEffect, useState } from 'react'

import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import { Container, Grid } from '@mui/material'

import AdminPage from '../AdminPage'
import Navbars from './Navbars'
import SubNavbars from './SubNavbars'

import useNavbar from '~/api/admin/navbar'
import Loading from '~/pages/Loading'

const CreateNavBar = () => {
    const { conferenceId } = useParams()
    const { getNavbar } = useNavbar()
    const [navbar, setNavbar] = useState({ isEditing: false, name: '' })
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [subNavbarSelected, setSubNavbarSelected] = useState([])
    const [selectedNavbar, setSelectedNavbar] = useState('')
    const [navbars, setNavbars] = useState([])
    const [loading, setLoading] = useState(true)

    const handleSelectNav = (parentId) => {
        const getNav = navbars.find((nav) => nav.parentId === parentId)
        const childs = cloneDeep(getNav).childs
        setSubNavbarSelected(childs)
        setSelectedNavbar(parentId)
    }

    const cancelEditingHandler = () => {
        setNavbar(() => ({ name: '', isEditing: false }))
        setIsAdd({ status: true, id: null })
    }

    const modifyNavbarHandler = (value) => {
        if (isAdd.status) {
            const newNavbar = {
                parentId: uuid(),
                parentLabel: value.trim().toUpperCase(),
                href: '',
                childs: [],
            }
            setNavbars((prev) => [...prev, newNavbar])
        } else {
            const position = navbars.findIndex((item) => item.parentId === isAdd.id)
            const updatedNavbars = cloneDeep(navbars)
            updatedNavbars[position].parentLabel = value.toUpperCase()
            setNavbars(updatedNavbars)
        }
        setNavbar(() => ({ name: '', isEditing: false }))
        setIsAdd({ status: true, id: null })
    }

    const openEditNavbarHandler = (id) => {
        const navbarItem = navbars.find((item) => item.parentId === id)
        setNavbar({ isEditing: true, name: navbarItem.parentLabel })
        setIsAdd({ status: false, id })
    }

    const modifySubNavHandler = (value, parentId, isAdd) => {
        const parentIndex = navbars.findIndex((item) => item.parentId === parentId)
        if (isAdd.status) {
            const childId = uuid()
            const updatedNavbars = cloneDeep(navbars)
            const newSubNav = { childId: childId, childLabel: value.toUpperCase(), href: `${parentId}@${childId}` }
            updatedNavbars[parentIndex].childs.push(newSubNav)
            setSubNavbarSelected(updatedNavbars[parentIndex].childs)
            setNavbars(updatedNavbars)
        } else {
            const updatedNavbars = cloneDeep(navbars)
            const position = navbars[parentIndex].childs.findIndex((child) => child.childId === isAdd.id)
            updatedNavbars[parentIndex].childs[position].childLabel = value.toUpperCase()
            setSubNavbarSelected(updatedNavbars[parentIndex].childs)
            setNavbars(updatedNavbars)
        }
    }

    const deleteNavbar = (id, closeAlert) => {
        if (navbar.isEditing) {
            isAdd.id === id && setNavbar(() => ({ name: '', isEditing: false }))
        }
        const updatedNavbars = navbars.filter((item) => item.parentId !== id)
        setNavbars(updatedNavbars)
        setSelectedNavbar('')
        setSubNavbarSelected([])
        closeAlert()
    }

    const deleteSubNav = (subNavId, closeAlert) => {
        const updatedNavbars = cloneDeep(navbars)
        const parentIndex = updatedNavbars.findIndex((item) => item.parentId === selectedNavbar)
        const childIndex = updatedNavbars[parentIndex].childs.findIndex((item) => item.childId === subNavId)
        updatedNavbars[parentIndex].childs.splice(childIndex, 1)
        setNavbars(updatedNavbars)
        setSubNavbarSelected(updatedNavbars[parentIndex].childs)
        closeAlert()
    }

    // const handleSelectingTemplate = (event) => {
    //     setTemplateId(event.target.value)
    // }

    // const handleSubmitted = () => {
    // const submittedNavbars = cloneDeep(navbars)
    // submittedNavbars.forEach((parentNav) => {
    //     if (parentNav.childs.length > 0) {
    //         const parentHref = parentNav.childs[0].childId.trim().replace(/\s/g, '').toLowerCase()
    //         parentNav.href = `${parentHref}.html`
    //     } else {
    //         const parentHref = parentNav.parentId.trim().replace(/\s/g, '').toLowerCase()
    //         parentNav.href = `${parentHref}.html`
    //     }
    //     parentNav.childs.forEach((subNav) => {
    //         const subNavHref = subNav.childId.trim().replace(/\s/g, '').toLowerCase()
    //         subNav.href = `${subNavHref}.html`
    //     })
    // })

    //     updateNavbar(conferenceId, templateId, { navbar: submittedNavbars }).then(() => {
    //         showSnackbar({
    //             severity: 'success',
    //             children: 'Update Navbar successfully',
    //         })
    //         history.push('/admin')
    //     })
    // }

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal

        getNavbar(conferenceId, signal)
            .then((response) => {
                const getNavbars = response.data
                setNavbars(getNavbars.navbar)
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conferenceId])

    return (
        <AdminPage>
            <Container maxWidth="lg">
                {loading ? (
                    <Loading height="70vh" />
                ) : (
                    <Grid container columnSpacing={3} mt={8}>
                        <React.Fragment>
                            <Grid item lg={6}>
                                <Navbars
                                    navbars={navbars}
                                    handleSelectNav={handleSelectNav}
                                    selectedNavbar={selectedNavbar}
                                    openEditNavbarHandler={openEditNavbarHandler}
                                    cancelEditingHandler={cancelEditingHandler}
                                    navbar={navbar}
                                    isAdd={isAdd}
                                    modifyNavbarHandler={modifyNavbarHandler}
                                    deleteNavbar={deleteNavbar}
                                />
                            </Grid>
                            <Grid item lg={6}>
                                <SubNavbars
                                    subNavbarSelected={subNavbarSelected}
                                    selectedNavbar={selectedNavbar}
                                    modifySubNavHandler={modifySubNavHandler}
                                    deleteSubNav={deleteSubNav}
                                />
                            </Grid>
                        </React.Fragment>
                    </Grid>
                )}
            </Container>
        </AdminPage>
    )
}

export default CreateNavBar
