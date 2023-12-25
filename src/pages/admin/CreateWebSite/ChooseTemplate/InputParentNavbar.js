import React, { useEffect, useState } from 'react'

import { Box, Button, FormHelperText, TextField } from '@mui/material'

const InputParentNavbar = ({ parentNav, modifyNavbarHandler, cancelEditingHandler, isAdd, template, navbars }) => {
    const { id } = template
    const [navbarName, setNavbarName] = useState(parentNav.name)
    const [error, setError] = useState({ error: false, message: '' })

    const textChangeHandler = (event) => {
        setNavbarName(event.target.value)
        setError({ error: false, message: '' })
    }

    const handleAddNav = () => {
        const isExisted = navbars.find((nav) => nav.parentLabel.toLowerCase() === navbarName.toLowerCase())
        if (isAdd.status && isExisted) {
            setError({ error: true, message: 'This nav is already existed.' })
        } else if (!isAdd.status && parentNav.name.toLowerCase() !== navbarName.toLowerCase() && isExisted) {
            setError({ error: true, message: 'This nav is already existed.' })
        } else {
            modifyNavbarHandler(navbarName)
            setNavbarName('')
        }
    }

    useEffect(() => {
        setNavbarName(parentNav.name)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentNav])

    return (
        <React.Fragment>
            <Box mb={2}>
                <Box display="flex" alignItems="center" flex={1}>
                    <TextField
                        size="small"
                        placeholder="Navbar name"
                        variant="outlined"
                        fullWidth
                        value={navbarName}
                        onChange={textChangeHandler}
                        sx={{ flex: 1 }}
                    />
                    <Button disabled={!id} variant="contained" sx={{ ml: 1 }} onClick={handleAddNav}>
                        {isAdd.status === true ? 'Add Nav' : 'Edit'}
                    </Button>
                    {!isAdd.status && (
                        <Button sx={{ ml: 1 }} variant="outlined" color="error" onClick={cancelEditingHandler}>
                            Cancel
                        </Button>
                    )}
                </Box>
                {error.error && <FormHelperText error={error.error}>{error.message}</FormHelperText>}
            </Box>
        </React.Fragment>
    )
}

export default InputParentNavbar
