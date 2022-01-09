import { useState } from 'react'

// useFormInput to handle the input change
const useFormInput = (initialValue: any) => {
    const [value, setValue] = useState(initialValue)
    const handleChange = (e: { target: { value: any } }) => setValue(e.target.value)
    return {
        inputProp: {
            value,
            onChange: handleChange,
        },
        reset: () => setValue(''),
    }
}

export default useFormInput
