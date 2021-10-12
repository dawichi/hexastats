import React from 'react'

const getIndexOfString = (searchStr: string, str: string, caseSensitive: boolean) => {
    if (searchStr.length == 0) {
		return []
    }
    var startIndex = 0, index: number, indices = []
    if (!caseSensitive) {
        str = str.toLowerCase()
        searchStr = searchStr.toLowerCase()
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index)
        startIndex = index + searchStr.length
    }
    return indices
}

export default getIndexOfString