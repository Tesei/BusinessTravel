import { customRef } from 'vue'

export function useDebounceRef(value, delay = 350) {
    let timeout
    return customRef((track, trigger) => {
        return {
            get() {
                track()
                return value
            },
            set(newValue) {
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    value = newValue
                    trigger()
                }, delay)
            },
        }
    })
}
