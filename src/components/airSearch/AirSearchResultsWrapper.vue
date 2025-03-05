<template>
    <div class="air-search-results-wrapper mt-32 flex flex-d-c">
        <div class="header flex ai-c jc-sb">
            <h2 class="Heading_2"><slot name="title"></slot></h2>
            <div class="c-cornflower font-button_S pointer button-back">
                <slot name="button"></slot>
            </div>
        </div>
        <div class="air-search-results-wrapper__form mt-40">
            <slot name="form"></slot>
        </div>
        <div class="air-search-results-wrapper__body mt-40 flex-jcsb-aifs">
            <div class="air-search-results-wrapper__body_filters mr-40">
                <slot name="filters"></slot>
            </div>
            <div class="air-search-results-wrapper__body_results">
                <slot name="results"></slot>
            </div>
        </div>
    </div>
</template>

<script setup></script>

<style scoped lang="scss">
.air-search-results-wrapper {
    min-height: calc(100vh - 103px);

    // .air-search-results-wrapper__body
    &__body {
        flex-grow: 1;
        // .air-search-results-wrapper__body_filters
        &_filters {
            width: calc(35% - 39.5px);
        }

        // .air-search-results-wrapper__body_results
        &_results {
            width: calc(65% - 0.5px);

            & :deep(.ui-login__content) {
                margin: 0;
            }
        }
    }
}
</style>
