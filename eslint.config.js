import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ['src/**/*.{js,mjs,cjs,vue}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {
        rules: {
            'no-unused-vars': ['error', { varsIgnorePattern: '^(props|ref|emit|apiClient)$' }],
            'no-undef': 'error',

            'vue/no-shared-component-data': 'error',
            'vue/no-deprecated-destroyed-lifecycle': 'error',
            'vue/require-v-for-key': 2, //  обязательный key в директиве v-for
            'vue/no-use-v-if-with-v-for': 2, //  запрет применения v-for и v-if к одному элементу
            'vue/no-side-effects-in-computed-properties': 2, //  запрет кода, который приводит к побочным эффектам в выч. свойствах
            'vue/no-unused-components': 2, // запрет на добавление компонентов, которые не используются в шаблоне
            'vue/multi-word-component-names': 0, //  обязательная многословность в названиях кастомных компонентов
            'vue/no-reserved-component-names': 2, //  предотвращение конфликтов имен между кастомными компонентами и html-элементами
            'no-useless-escape': 1, //  уведомления о ненужных escape "/" в строках и регулярных выражениях
            'no-case-declarations': 2, //  запрет на объявление переменных в switch case и default
            'vue/no-mutating-props': 2, //  запрет на мутирование props
            'vue/valid-v-bind-sync': 2, //  проверка валидности .sync на v-bind
            'vue/no-reserved-props': 2, //  запрет на использование зарезервированных имен в props
            'no-constant-condition': ['error', { checkLoops: false }], // Позволяет использовать константные выражения (true) в циклах
            indent: [
                'error',
                4, // изменено на 4 пробела
                {
                    SwitchCase: 1,
                },
            ],
            // 'linebreak-style': [
            //     'error',
            //     'unix'
            // ],
            quotes: ['error', 'single'],
            semi: ['error', 'never'],
        },
    },
    {
        ignores: ['dist/**/*'],
    },
]
