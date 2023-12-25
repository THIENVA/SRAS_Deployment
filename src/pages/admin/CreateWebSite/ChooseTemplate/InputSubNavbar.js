import { useEffect, useState } from 'react'

import { Box, Button, FormHelperText, TextField } from '@mui/material'

const InputChildNavbar = ({
    childNav,
    handleAddingSubNav,
    openAddSubNav,
    isAdd,
    selectedNavbar,
    subNavbarSelected,
}) => {
    const [navbarName, setNavbarName] = useState(childNav)
    const [error, setError] = useState({ error: false, message: '' })
    const textChangeHandler = (event) => {
        setNavbarName(event.target.value)
        setError({ error: false, message: '' })
    }

    const handleAddNav = () => {
        const isExisted = subNavbarSelected.find((nav) => nav.childLabel.toLowerCase() === navbarName.toLowerCase())
        if (isAdd.status && isExisted) {
            setError({ error: true, message: 'This sub nav is already existed.' })
        } else if (!isAdd.status && childNav.toLowerCase() !== navbarName.toLowerCase() && isExisted) {
            setError({ error: true, message: 'This sub nav is already existed.' })
        } else {
            handleAddingSubNav(navbarName)
            setNavbarName('')
        }
    }

    useEffect(() => {
        setNavbarName(childNav)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [childNav])

    return (
        <Box mb={2}>
            <Box display="flex" alignItems="center" flex={1}>
                <TextField
                    size="small"
                    placeholder="Sub Navbar name"
                    variant="outlined"
                    fullWidth
                    value={navbarName}
                    onChange={textChangeHandler}
                    sx={{ flex: 1 }}
                />
                <Button onClick={handleAddNav} variant="contained" sx={{ ml: 2 }} disabled={!selectedNavbar}>
                    {isAdd.status === true ? 'Add Sub Nav' : 'Edit'}
                </Button>
                {!isAdd.status && (
                    <Button sx={{ ml: 2 }} variant="outlined" color="error" onClick={openAddSubNav}>
                        Cancel
                    </Button>
                )}
            </Box>
            {error.error && <FormHelperText error={error.error}>{error.message}</FormHelperText>}
        </Box>
    )
}

export default InputChildNavbar
