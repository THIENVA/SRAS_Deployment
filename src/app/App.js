import React, { useEffect } from 'react'

import './App.css'

import useAuth from '~/api/common/auth'
import routes from '~/routes'

function App() {
    const { autoLoginHandler } = useAuth()
    autoLoginHandler()

    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         const isPageRefresh = performance.navigation.type === 1
    //         if (!isPageRefresh) {
    //             LocalStorageUtils.deleteRole()
    //         }
    //     }
    //     window.addEventListener('beforeunload', handleBeforeUnload)
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload)
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    useEffect(() => {
        window.addEventListener('error', (e) => {
            if (e.message === 'ResizeObserver loop limit exceeded') {
                const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay-div')
                const resizeObserverErr = document.getElementById('webpack-dev-server-client-overlay')
                if (resizeObserverErr) {
                    resizeObserverErr.setAttribute('style', 'display: none')
                }
                if (resizeObserverErrDiv) {
                    resizeObserverErrDiv.setAttribute('style', 'display: none')
                }
            }
        })
    }, [])

    return <React.Fragment>{routes}</React.Fragment>
}

export default App
