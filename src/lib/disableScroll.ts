import type { Action } from 'svelte/action';

export default <Action<HTMLElement, boolean>>function (node, disable) {
    function update(disable: boolean) {
        node.style.overflow = disable ? 'hidden' : 'initial';
    }

    update(disable);

    return {
        update,
    };
};
