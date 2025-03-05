<template>
    <svg
        class="icon-sprite"
        :class="className"
    >
        <use :xlink:href="path + '#' + name" />
    </svg>
</template>

<script>
import pathSprite from '@icons/sprite.svg'
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        className: {
            type: String,
            default: '',
        },
    },
    name: 'IconSprite',
    data() {
        return {
            path: pathSprite,
        }
    },
}
</script>
