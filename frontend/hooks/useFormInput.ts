import { useState } from 'react'

interface useFormInputReturn {
    inputProp: {
        value: string
        onChange: any
    },
    reset: () => void
}

/**
 * useFormInput to handle the input change
 * @param {string} initialValue the string initial value
 * @returns {useFormInputReturn} functions to manage the input value
 */
export const useFormInput = (initialValue: string = ''): useFormInputReturn => {
    const [value, setValue] = useState<string>(initialValue)
    const handleChange = (e: { target: { value: any } }) => setValue(e.target.value)

    return {
        inputProp: {
            value,
            onChange: handleChange,
        },
        reset: () => setValue(''),
    }
}