import { onMount } from 'svelte';
import { derived, type Readable, writable } from 'svelte/store';
import type {
    BlurParams,
    DrawParams,
    FadeParams,
    FlyParams,
    ScaleParams,
    SlideParams,
    TransitionConfig,
} from 'svelte/transition';

type Animation = (
    node: Element | (SVGElement & { getTotalLength(): number }),
    params?: BlurParams | FadeParams | FlyParams | SlideParams | ScaleParams | DrawParams
) => TransitionConfig;

export default function reduceAnimation<R = Animation, N = Animation>(
    reducedAnimation: R,
    normalAnimation: N
): Readable<R | N> {
    const reducedStore = writable(true);

    function getAnimation(reduced = true) {
        return reduced ? reducedAnimation : normalAnimation;
    }

    onMount(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedStore.set(mediaQuery.matches);
        mediaQuery.addEventListener('change', e => {
            reducedStore.set(e.matches);
        });
    });

    return derived(reducedStore, getAnimation, reducedAnimation);
}
