import { toTypedSchema } from '@vee-validate/zod'
import { object, coerce, array, any, boolean, string } from 'zod'

export function validateSchema() {
    const validationSchema = toTypedSchema(
        object({
            traveller: array(any()).nonempty({ message: 'Командируемый не может быть пустым' }).default([]),
            departureCity: array(any()).nonempty({ message: 'Место отправления не может быть пустым' }).default([]),

            destinations: array(
                object({
                    arrivalCity: object({
                        isActive: boolean().default(false),
                        activeItems: array(any()).nonempty({ message: 'Место назаначения не может быть пустым' }).default([]),
                    }).required(),

                    startDate: string().refine((val) => !isNaN(Date.parse(val)), {
                        message: 'Некорректный формат даты',
                    }),
                    endDate: string().refine((val) => !isNaN(Date.parse(val)), {
                        message: 'Некорректный формат даты',
                    }),

                    destinationCompany: object({
                        isActive: boolean().default(false),
                        activeItems: array(any()).nonempty({ message: 'Компания назначения не может быть пустым' }).default([]),
                    }).required(),

                    additionalCompanies: array(
                        object({
                            isActive: boolean().default(false),
                            activeItems: array(any()).default([]),
                        }),
                    ).default([]),
                }),
            ),

            comment: any(),
        }),
    )
    return validationSchema
}

export function orderCreateValidateSchema({ person }) {
    const validationSchema = toTypedSchema(
        object({
            lastName: string().default(person?.value?.info?.lastName),
            firstName: string().default(person?.value?.info?.firstName),
            middleName: string().default(person?.value?.info?.middleName),
            latinLastName: string().default(person?.value?.info?.latinLastName),
            latinFirstName: string().default(person?.value?.info?.latinFirstName),
            latinMiddleName: string().default(person?.value?.info?.latinMiddleName),
            birthdayDate: coerce
                .date()
                .default(
                    person?.value?.info?.birthdayDate
                        ? new Date(person?.value?.info?.birthdayDate).toISOString().slice(0, 10)
                        : null,
                ),
            gender: string().default(
                !person?.value?.info?.gender ? '' : person?.value?.info?.gender === 'Male' ? 'Мужской' : 'Женский',
            ),

            type: string().min(1, { message: 'Тип документа не может быть пустым' }).default(''),
            phoneNumber: string()
                .length(12, { message: 'Неверный номер телефона' })
                .default(person?.value?.documents?.person?.phoneNumber),
            email: string().email({ message: 'Неверный email' }).default(person?.value?.info?.email),
        }),
    )
    return validationSchema
}

export const validatePersonAddDocumentSchema = {
    russianFederationPassport: toTypedSchema(
        object({
            number: string({ errorMap: () => ({ message: 'Серия и номер паспорта не может быть пустым' }) }).refine(
                (value) => value.replace(/[\s-]/g, '').length === 10,
                { message: 'Серия и номер документа должны содержать 10 цифр' },
            ),
        }),
    ),
    russianInternationalPassport: toTypedSchema(
        object({
            numberInternational: string({ errorMap: () => ({ message: 'Номер документа должен содержать 9 цифр' }) }).refine(
                (value) => String(value).length === 9,
                'Номер документа должен содержать 9 цифр',
            ),
            expirationDateInternational: coerce
                .date({
                    errorMap: () => ({ message: 'Срок действия документа истек ' }),
                })
                .min(new Date(), {
                    errorMap: () => ({ message: 'Срок действия документа истек ' }),
                }),
        }),
    ),
    foreignPassport: toTypedSchema(
        object({
            numberForeign: string({ errorMap: () => ({ message: 'Номер документа не может быть пустым' }) })
                .min(1, 'Номер документа не может быть пустым')
                .max(16, 'Номер документа не должен превышать 16 символов'),
            expirationDateForeign: coerce
                .date({
                    errorMap: () => ({ message: 'Срок действия документа истек ' }),
                })
                .min(new Date(), {
                    errorMap: () => ({ message: 'Срок действия документа истек ' }),
                }),
            toDirectionId: array(any()).nonempty({ message: 'Гражданство не может быть пустым' }).default([]),
        }),
    ),
}

export const validateCreateEmployeeSchema = toTypedSchema(
    object({
        lastName: string({ errorMap: () => ({ message: 'Фамилия должна содержать больше одной буквы' }) })
            .regex(/^[А-Яа-яЁёA-Za-z].*$/, 'Фамилия должна начинаться с буквы')
            .regex(/^[А-Яа-яЁё]+(?:[ -][А-Яа-яЁё]+){0,2}$/, 'Допустима кириллица, не более двух дефисов или пробела')
            .min(2, 'Фамилия должна содержать больше одной буквы'),
        latinLastName: string({ errorMap: () => ({ message: 'Фамилия должна содержать больше одной буквы' }) })
            .regex(/^[a-zA-ZА-Яа-яЁё].*$/, 'Фамилия должна начинаться с буквы')
            .min(2, 'Фамилия должна содержать больше одной буквы')
            .regex(/^[a-zA-Z]+(?:[ -]{0,2}[a-zA-Z]+)*$/, 'Допустима латиница, не более двух дефисов или пробела'),
        firstName: string({ errorMap: () => ({ message: 'Имя должно содержать больше одной буквы' }) })
            .regex(/^[А-Яа-яЁёA-Za-z].*$/, 'Имя должно начинаться с буквы')
            .regex(/^[А-Яа-яЁё]+(?:[ -][А-Яа-яЁё]+){0,2}$/, 'Допустима кириллица, не более двух дефисов или пробела')
            .min(2, 'Имя должно содержать больше одной буквы'),
        latinFirstName: string({ errorMap: () => ({ message: 'Имя должно содержать больше одной буквы' }) })
            .regex(/^[a-zA-ZА-Яа-яЁё].*$/, 'Имя должно начинаться с буквы')
            .min(2, 'Имя должно содержать больше одной буквы')
            .regex(/^[a-zA-Z]+(?:[ -]{0,2}[a-zA-Z]+)*$/, 'Допустима латиница, не более двух дефисов или пробела'),
        middleName: string()
            .refine((val) => val === '' || /^[А-Яа-яЁёA-Za-z]/.test(val), {
                message: 'Отчество должно начинаться с буквы',
            })
            .refine((val) => val === '' || /^[А-Яа-яЁё]+(?:[ -][А-Яа-яЁё]+){0,2}$/.test(val), {
                message: 'Допустима кириллица, не более двух дефисов или пробела',
            })
            .refine((val) => val === '' || val?.length >= 2, {
                message: 'Отчество должно содержать больше одной буквы',
            })
            .optional(),
        latinMiddleName: string({ errorMap: () => ({ message: '' }) })
            .refine((val) => val === '' || /^[А-Яа-яЁёA-Za-z]/.test(val), {
                message: 'Отчество должно начинаться с буквы',
            })
            .refine((val) => val === '' || /^[a-zA-Z]+(?:[ -]{0,2}[a-zA-Z]+)*$/.test(val), {
                message: 'Допустима латиница, не более двух дефисов или пробела',
            })
            .refine((val) => val === '' || val?.length >= 2, {
                message: 'Отчество должно содержать больше одной буквы',
            })
            .optional(),
        dateOfBirth: coerce
            .date({ errorMap: () => ({ message: '' }) })
            .min(new Date('01.01.1920'), 'Дата рождения не может быть меньше, чем 1920 год')
            .max(new Date(), 'Дата рождения не может быть больше текущей'),
        gender: string({ errorMap: () => ({ message: 'Пол не может быть пустым' }) }).nonempty({
            message: 'Пол не может быть пустым',
        }),
        positionId: array(any()).nonempty({ message: 'Должность не может быть пустым' }).default([]),
        departmentId: array(any()).nonempty({ message: 'Подразделение не может быть пустым' }).default([]),
        itn: string({ errorMap: () => ({ message: 'ИНН не может быть пустым' }) })
            .regex(/^\d+$/, 'ИНН состоит из 10 или 12 цифр')
            .refine((value) => String(value).length === 10 || String(value).length === 12, {
                message: 'ИНН состоит из 10 или 12 цифр',
            }),
        personnelNumber: string({ errorMap: () => ({ message: 'Табельный номер не может быть пустым' }) }).nonempty({
            message: 'Табельный номер не может быть пустым',
        }),
        phoneNumber: string({ errorMap: () => ({ message: 'Номер телефона не может быть пустым' }) }).regex(
            /^(?:\+7|7)\(?\d{3}\)?\d{3}-\d{2}-\d{2}$|^(?:\+7|7)\d{10}$/,
            'Номер телефона должен состоять из 10 цифр',
        ),
        email: string({ errorMap: () => ({ message: 'Email не может быть пустым' }) })
            .email('Неверный формат электронной почты')
            .regex(
                /^[a-zA-Z0-9`!;%:?()\-_=+\\.,[\]]+@([a-zA-Z0-9_-]+\.)?[a-zA-Z0-9_-]+\.[a-zA-Z]+$/,
                'Неверный формат электронной почты',
            ),
    }),
)
