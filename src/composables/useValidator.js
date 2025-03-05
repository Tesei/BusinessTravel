export function useValidator() {
    const nameRegex = /^[А-Яа-яЁё]+([- ]?[А-Яа-яЁё0-9]+){0,2}$/
    const nameRegexNoDigits = /^[А-Яа-яЁё]+([- ]?[А-Яа-яЁё]+){0,2}$/
    const onlyLatin = /^[A-Za-z]+([- ]?[A-Za-z]+){0,2}$/
    const emailRegex = /^[a-zA-Z0-9`!;%:?()\-_=+/.,[\]]+@[a-zA-Z0-9_-]+\.[a-zA-Z]{2,}$/
    let phoneRegex = /\+\d{11}$/
    const cirillicNameWithOneDasheOrSpace = /^(?=.{2,}$)[А-Яа-яЁё]+(?:[ -][А-Яа-яЁё]+)?$/
    const latinNameWithOneDasheOrSpace = /^(?=.{2,}$)[A-Za-z]+(?:[ -][A-Za-z]+)?$/
    const numbersWithDot = /^\d+(\.\d+)?$/
    const cirillicAndLatin = /^[а-яА-Яa-zA-Z0-9\s-]+$/

    function validateName(inputValues, fieldName, error, errorText) {
        if (nameRegex.test(inputValues[fieldName]) && inputValues[fieldName].length > 1) {
            error[fieldName] = null
        } else {
            if (!inputValues[fieldName].length) {
                error[fieldName] = null
            } else {
                error[fieldName] = errorText
            }
        }
    }

    function validateRegExpr(regExpr, inputValues, fieldName, error, errorText) {
        if (regExpr.test(inputValues[fieldName]) && inputValues[fieldName].length > 1) {
            error[fieldName] = null
        } else {
            if (!inputValues[fieldName].length) {
                error[fieldName] = null
            } else {
                error[fieldName] = errorText
            }
        }
    }

    function compareObjectValues(obj1, obj2) {
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)

        // Проверяем, есть ли одинаковые ключи
        const commonKeys = keys1.filter((key) => keys2.includes(key))

        const results = {}

        const gender =
            (obj1.gender === 'Male' && obj2.gender.value === 'Мужской') ||
            (obj1.gender === 'Female' && obj2.gender.value === 'Женский')
                ? true
                : false
        commonKeys.forEach((key) => {
            if (gender) {
                results.gender = { equal: true, value: obj1.gender }
            }
            if (obj1[key] === obj2[key]) {
                results[key] = { equal: true, value: obj1[key] }
            } else {
                results[key] = { equal: false, value1: obj1[key], value2: obj2[key] }
            }
        })

        return results
    }

    return {
        validateName,
        validateRegExpr,
        compareObjectValues,
        nameRegexNoDigits,
        onlyLatin,
        emailRegex,
        phoneRegex,
        cirillicNameWithOneDasheOrSpace,
        latinNameWithOneDasheOrSpace,
        numbersWithDot,
        cirillicAndLatin,
    }
}
