const isEmpty = (value) => value.trim().length === 0

const buildNavBars = (navbars) => {
    let html = '<ul class="nav-list">'

    for (let item of navbars) {
        html += '<li class="nav-list__item">'
        html += `<a href="${item.href}">${item.parentLabel}</a>`

        if (item.childs && item.childs.length > 0) {
            html += '<ul class="hide-items">'
            for (let child of item.childs) {
                html += '<li class="hide-items-dropdown">'
                html += `<a href="${child.href}">${child.childLabel}</a>`
                html += '</li>'
            }
            html += '</ul>'
        }

        html += '</li>'
    }

    html += '</ul>'
    return html
}

const buildNavBarsPreview = (navbars) => {
    let html = '<ul class="nav-list">'

    for (let item of navbars) {
        html += '<li class="nav-list__item">'
        html += `<a style='pointer-events: none; cursor: text !important' href="${item.href}">${item.parentLabel}</a>`

        if (item.childs && item.childs.length > 0) {
            html += '<ul class="hide-items">'
            for (let child of item.childs) {
                html += '<li class="hide-items-dropdown">'
                html += `<a style='pointer-events: none; cursor: text !important' href="${child.href}">${child.childLabel}</a>`
                html += '</li>'
            }
            html += '</ul>'
        }

        html += '</li>'
    }

    html += '</ul>'
    return html
}

const generateConferenceHeader = (conference) => {
    const startDate = new Date(conference.startDate)
    const endDate = new Date(conference.endDate)

    const logoHtml = `<img class="logo" src="${conference.logo}" alt="logo">`
    const infoHtml = `
      <p class="name-conference">${conference.fullName}</p>
      <p class="date">${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()} // ${conference.city}, ${
        conference.country
    }</p>
    `

    const leftHtml = `
      <div class="header__left">
        <div class="header__left-logo">
          ${logoHtml}
        </div>
        <div class="header__left-info">
          ${infoHtml}
        </div>
      </div>
    `

    const rightHtml = `
      <div class="header__right">
        <div class="header__right-logo">
          ${logoHtml}
        </div>
      </div>
    `

    return leftHtml + rightHtml
}

const getClosedIndex = (array, index) => {
    let beforeIndex = null
    let afterIndex = null

    // Find beforeIndex
    let i = index - 1
    while (i >= 0) {
        if (array[i].status === 'Disabled') {
            i--
        } else {
            beforeIndex = i
            break
        }
    }

    // Find afterIndex
    let j = index + 1
    while (j < array.length) {
        if (array[j].status === 'Disabled') {
            j++
        } else {
            afterIndex = j
            break
        }
    }

    return { beforeIndex, afterIndex }
}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const getTurnOffDeadline = (value, updatedDeadlines, targetPhaseIndices, index) => {
    if (index === targetPhaseIndices[0] || index === targetPhaseIndices[1]) {
        updatedDeadlines[targetPhaseIndices[0]].status = value
        updatedDeadlines[targetPhaseIndices[1]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[0]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[0]].error = false
            updatedDeadlines[targetPhaseIndices[0]].helperText = ''
            updatedDeadlines[targetPhaseIndices[1]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[1]].error = false
            updatedDeadlines[targetPhaseIndices[1]].helperText = ''
        }
    } else if (index === targetPhaseIndices[2] || index === targetPhaseIndices[3]) {
        updatedDeadlines[targetPhaseIndices[2]].status = value
        updatedDeadlines[targetPhaseIndices[3]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[2]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[2]].error = false
            updatedDeadlines[targetPhaseIndices[2]].helperText = ''
            updatedDeadlines[targetPhaseIndices[3]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[3]].error = false
            updatedDeadlines[targetPhaseIndices[3]].helperText = ''
        }
    } else if (index === targetPhaseIndices[4] || index === targetPhaseIndices[5]) {
        updatedDeadlines[targetPhaseIndices[4]].status = value
        updatedDeadlines[targetPhaseIndices[5]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[4]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[4]].error = false
            updatedDeadlines[targetPhaseIndices[4]].helperText = ''
            updatedDeadlines[targetPhaseIndices[5]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[5]].error = false
            updatedDeadlines[targetPhaseIndices[5]].helperText = ''
        }
    } else if (index === targetPhaseIndices[6] || index === targetPhaseIndices[7]) {
        updatedDeadlines[targetPhaseIndices[6]].status = value
        updatedDeadlines[targetPhaseIndices[7]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[6]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[6]].error = false
            updatedDeadlines[targetPhaseIndices[6]].helperText = ''
            updatedDeadlines[targetPhaseIndices[7]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[7]].error = false
            updatedDeadlines[targetPhaseIndices[7]].helperText = ''
        }
    } else if (index === targetPhaseIndices[8] || index === targetPhaseIndices[9]) {
        updatedDeadlines[targetPhaseIndices[8]].status = value
        updatedDeadlines[targetPhaseIndices[9]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[8]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[8]].error = false
            updatedDeadlines[targetPhaseIndices[8]].helperText = ''
            updatedDeadlines[targetPhaseIndices[9]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[9]].error = false
            updatedDeadlines[targetPhaseIndices[9]].helperText = ''
        }
    } else if (index === targetPhaseIndices[10] || index === targetPhaseIndices[11]) {
        updatedDeadlines[targetPhaseIndices[10]].status = value
        updatedDeadlines[targetPhaseIndices[11]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[10]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[10]].error = false
            updatedDeadlines[targetPhaseIndices[10]].helperText = ''
            updatedDeadlines[targetPhaseIndices[11]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[11]].error = false
            updatedDeadlines[targetPhaseIndices[11]].helperText = ''
        }
    } else if (index === targetPhaseIndices[12] || index === targetPhaseIndices[13]) {
        updatedDeadlines[targetPhaseIndices[12]].status = value
        updatedDeadlines[targetPhaseIndices[13]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[12]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[12]].error = false
            updatedDeadlines[targetPhaseIndices[12]].helperText = ''
            updatedDeadlines[targetPhaseIndices[13]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[13]].error = false
            updatedDeadlines[targetPhaseIndices[13]].helperText = ''
        }
    } else if (index === targetPhaseIndices[14] || index === targetPhaseIndices[15]) {
        updatedDeadlines[targetPhaseIndices[14]].status = value
        updatedDeadlines[targetPhaseIndices[15]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[14]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[14]].error = false
            updatedDeadlines[targetPhaseIndices[14]].helperText = ''
            updatedDeadlines[targetPhaseIndices[15]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[15]].error = false
            updatedDeadlines[targetPhaseIndices[15]].helperText = ''
        }
    } else if (index === targetPhaseIndices[16] || index === targetPhaseIndices[17]) {
        updatedDeadlines[targetPhaseIndices[16]].status = value
        updatedDeadlines[targetPhaseIndices[17]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[16]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[16]].error = false
            updatedDeadlines[targetPhaseIndices[16]].helperText = ''
            updatedDeadlines[targetPhaseIndices[17]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[17]].error = false
            updatedDeadlines[targetPhaseIndices[17]].helperText = ''
        }
    } else if (index === targetPhaseIndices[18] || index === targetPhaseIndices[19]) {
        updatedDeadlines[targetPhaseIndices[18]].status = value
        updatedDeadlines[targetPhaseIndices[19]].status = value
        if (value === 'Disabled') {
            updatedDeadlines[targetPhaseIndices[18]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[18]].error = false
            updatedDeadlines[targetPhaseIndices[18]].helperText = ''
            updatedDeadlines[targetPhaseIndices[19]].planDeadline = null
            updatedDeadlines[targetPhaseIndices[19]].error = false
            updatedDeadlines[targetPhaseIndices[19]].helperText = ''
        }
    } else {
        updatedDeadlines[index].status = value
        if (value === 'Disabled') {
            updatedDeadlines[index].planDeadline = null
            updatedDeadlines[index].error = false
            updatedDeadlines[index].helperText = ''
        }
    }

    return updatedDeadlines
}

const generateLink = (string) => {
    if (string.includes('https') || string.includes('http')) return string
    else return `http://${string}`
}

function removeProtocol(url) {
    return url.replace(/^https?:\/\//, '')
}

const checkDuplicated = (array) => {
    const set = new Set(array)
    return set.size === array.length
}

const replaceLineBreak = (string) => string.replace(new RegExp('\\r?\\n', 'g'), '<br/>')

const splitEveryFirstLetterOfWord = (fullName) =>
    fullName
        .split(' ')
        .map((name) => name.charAt(0).toUpperCase())
        .join('')

const blockInvalidChar = (event) => ['e', 'E', '+', '-', '.'].includes(event.key) && event.preventDefault()

const formatPhoneNumber = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '')

    const formattedNumber = digits.replace(/(\d{2})(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3 $4')

    return formattedNumber
}

const formatFaxNumber = (faxNumber) => {
    const digits = faxNumber.replace(/\D/g, '')

    const formattedNumber = digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')

    return formattedNumber
}

const formatGuidForDisplay = (input) => {
    const digitsOnly = input.replace(/\D/g, '')

    const formattedNumber = digitsOnly.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4')

    return formattedNumber
}

const checkForErrors = (array) => {
    for (let i = 0; i < array.length; i++) {
        const item = array[i]
        if (item.errorEarly || item.errorRegular || item.errorOption) {
            return true
        }
    }
    return false
}

const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr)
    const day = date.getDate()
    const month = date.getMonth() + 1 // Months are 0-based, so add 1
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ampm = hours >= 12 ? 'PM' : 'AM'

    // Convert to 12-hour time format
    const formattedHours = hours % 12 || 12

    // Ensure leading zeros if necessary
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`
    const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`

    return `${formattedDate} ${formattedTime}`
}

// Helper function to check if two objects have the same properties and values
const propertiesMatch = (obj1, obj2) => {
    for (const key in obj1) {
        if (obj1.hasOwnProperty.call(key) && obj2.hasOwnProperty.call(key)) {
            if (obj1[key] !== obj2[key]) {
                return false
            }
        }
    }
    return true
}

const addLeadingZero = (number) => {
    if (number < 10) {
        return '0' + number
    } else {
        return number.toString()
    }
}
export {
    blockInvalidChar,
    buildNavBars,
    buildNavBarsPreview,
    capitalizeFirstLetter,
    checkDuplicated,
    generateConferenceHeader,
    generateLink,
    getClosedIndex,
    getTurnOffDeadline,
    isEmpty,
    removeProtocol,
    replaceLineBreak,
    splitEveryFirstLetterOfWord,
    formatPhoneNumber,
    formatFaxNumber,
    formatGuidForDisplay,
    checkForErrors,
    formatDateTime,
    propertiesMatch,
    addLeadingZero,
}
