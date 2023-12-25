import jwt_decode from 'jwt-decode'

import { LOCALSTORAGE_ROLE, LOCALSTORAGE_TOKEN_NAME } from '../config'

class LocalStorageUtils {
    getItem(key) {
        if (typeof localStorage !== 'undefined') {
            let item = localStorage.getItem(key)
            if (!item) {
                this.setItem(key)
                return localStorage.getItem(key)
            }
            return JSON.parse(item || '{}')
        }
        return undefined
    }

    setItem(key, value = '') {
        if (typeof localStorage !== 'undefined' && value !== '') {
            localStorage.setItem(key, JSON.stringify(value))
        }
    }

    removeItem(key) {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key)
        }
    }

    clear() {
        if (typeof localStorage !== 'undefined') {
            localStorage.clear()
        }
    }

    setUser(token) {
        if (typeof localStorage !== 'undefined') {
            this.setItem(LOCALSTORAGE_TOKEN_NAME, token)
        }
        return undefined
    }

    getUser() {
        if (typeof localStorage !== 'undefined') {
            const token = this.getItem(LOCALSTORAGE_TOKEN_NAME)
            try {
                if (token) return jwt_decode(token)
                else return token
            } catch (error) {
                return token
            }
        }
        return undefined
    }

    deleteUser() {
        this.removeItem(LOCALSTORAGE_TOKEN_NAME)
    }

    getToken() {
        return this.getItem(LOCALSTORAGE_TOKEN_NAME)
    }

    getRoleConference() {
        if (typeof localStorage !== 'undefined') {
            const role = this.getItem(LOCALSTORAGE_ROLE)
            try {
                return role
            } catch (error) {
                return role
            }
        }
        return undefined
    }

    setRoleConference(role) {
        if (typeof localStorage !== 'undefined') {
            this.setItem(LOCALSTORAGE_ROLE, role)
        }
        return undefined
    }

    deleteRole() {
        this.removeItem(LOCALSTORAGE_ROLE)
    }

    getPreviewContent(key) {
        if (typeof localStorage !== 'undefined') {
            const content = this.getItem(key)
            try {
                return content
            } catch (error) {
                return content
            }
        }
        return undefined
    }

    setPreviewContent(key, content) {
        if (typeof localStorage !== 'undefined') {
            this.setItem(key, content)
        }
        return undefined
    }

    deletePreviewContent(key) {
        this.removeItem(key)
    }
}

export default new LocalStorageUtils()
