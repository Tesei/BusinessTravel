export const uiRouts = {
    path: '/ui',
    name: 'ui',
    meta: { canEnterUnauthorized: true },
    children: [
        {
            path: 'table',
            name: 'ui/table',
            component: () => import('@/views/contracts/UIContractsPage.vue'),
        },
        {
            path: 'phone',
            name: 'ui/phone',
            component: () => import('@/views/ui-example/UIPhoneInput.vue'),
        },
        {
            path: 'checkbox',
            name: 'ui/checkbox',
            component: () => import('@/views/ui-example/UIPageCheckbox.vue'),
        },
        {
            path: 'input',
            name: 'ui/input',
            component: () => import('@/views/ui-example/UIPageInput.vue'),
        },
        {
            path: 'button',
            name: 'ui/button',
            component: () => import('@/views/ui-example/UIPageButton.vue'),
        },
        {
            path: 'popup',
            name: 'ui/popup',
            component: () => import('@/views/ui-example/UIPagePopup.vue'),
        },
        {
            path: 'expanded',
            name: 'ui/expanded',
            component: () => import('@/views/ui-example/UIBaseSearchExpanded.vue'),
        },
        {
            path: 'header',
            name: 'TheHeader',
            component: () => import('@/views/ui-example/TheHeader.vue'),
        },
        {
            path: 'tabs',
            name: 'ui/tabs',
            component: () => import('@/views/ui-example/UITabs.vue'),
        },
        {
            path: 'tooltip',
            name: 'ui/tooltip',
            component: () => import('@/views/ui-example/UIPageTooltip.vue'),
        },
        {
            path: 'pagination',
            name: 'ui/pagination',
            component: () => import('@/views/ui-example/UIPagination.vue'),
        },
        {
            path: 'switcher',
            name: 'ui/switcher',
            component: () => import('@/views/ui-example/UIPageSwitcher.vue'),
        },
        {
            path: 'switcherlabel',
            name: 'ui/switcherlabel',
            component: () => import('@/views/ui-example/UIPageSwitcherLabel.vue'),
        },
        {
            path: 'droplist',
            name: 'ui/droplist',
            component: () => import('@/views/ui-example/UIPageDroplist.vue'),
        },
        {
            path: 'data-not-available',
            name: 'ui/data-not-available',
            component: () => import('@/views/ui-example/UIPageDataNotAvailable.vue'),
        },
        {
            path: 'skeleton',
            name: 'ui/skeleton',
            component: () => import('@/views/ui-example/UISkeleton.vue'),
        },
        {
            path: 'dropdown-with-api',
            name: 'ui/dropdown-with-api',
            component: () => import('@/views/ui-example/UIPageDropdownWithApi.vue'),
        },
        {
            path: 'base-wrapper-component',
            name: 'ui/BaseWrapperComponent',
            component: () => import('@/views/ui-example/UIBaseWrapperComponent.vue'),
        },
        {
            path: 'textarea',
            name: 'ui/textarea',
            component: () => import('@/views/ui-example/UIPageTextarea.vue'),
        },
        {
            path: 'range-input',
            name: 'ui/range-input',
            component: () => import('@/views/ui-example/UIRangeInput.vue'),
        },
        {
            path: 'status-stepper',
            name: 'ui/status-stepper',
            component: () => import('@/views/ui-example/UIPageStatusStepper.vue'),
        },
        {
            path: 'filters',
            name: 'ui/filters',
            component: () => import('@/views/ui-example/UIAirFilter.vue'),
        },
        {
            path: 'stepper',
            name: 'ui/stepper',
            component: () => import('@/views/ui-example/UIBaseStepperInput.vue'),
        },
    ],
}
