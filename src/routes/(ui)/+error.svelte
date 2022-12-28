<script lang="ts">
    import { page } from '$app/stores';
    import { dev } from '$app/env';

    $: ({ error, status } = $page);

    let errorStuff: {
            status: number;
            errorTitle: string;
            userExplanation: string;
            image?: Image;
        };

    $: switch (
        status // Error message text
    ) {
        case 400: // Bad Request
            errorStuff = {
                status: status,
                errorTitle: 'Bad Request',
                userExplanation: `The server could not understand the request due to invalid syntax. Check your request and try again`,
            };
            break;

        case 401: // Unauthenticated
            errorStuff = {
                status: status,
                errorTitle: 'Unauthorized',
                userExplanation: `You must log in to access this page.`,
            };
            break;

        case 403: // Forbidden (bad permissions)
            errorStuff = {
                status: status,
                errorTitle: 'Forbidden',
                userExplanation: `You don't have permission to access this page. If you think this is a mistake, contact the administrator.`,
            };
            break;

        case 404: // Not Found
            errorStuff = {
                status: status,
                errorTitle: 'Not found',
                userExplanation: `We couldn't find the page you're looking for. Check the URL and try again. If you think this is a mistake, contact the administrator.`,
            };
            break;

        case 418: // Teapot
            errorStuff = {
                status: status,
                errorTitle: `I'm a teapot`,
                userExplanation: `The requested page is short and stout. Tip it over and pour it out.`,
            };
            break;

        case 429: // Rate Limit
            errorStuff = {
                status: status,
                errorTitle: 'Too many requests',
                userExplanation: `You've made too many requests recently; try again later. If you think this is a mistake, contact the administrator.`,
            };
            break;

        case 451: // Unavailable for legal reasons (uh oh)
            errorStuff = {
                status: status,
                errorTitle: 'Unavailable for legal reasons',
                userExplanation: `The requested page cannot legally be provided.`,
            };
            break;

        case 500: // Server Error
            errorStuff = {
                status: status,
                errorTitle: 'Internal server error',
                userExplanation: `Something went wrong on our end; try again later. If the issue persists, contact the administrator.${
                    dev ? `<br>Developer Details:<pre>${error?.message}</pre>` : ''
                }`,
            };
            break;

        case 501: // Not Implemented
            errorStuff = {
                status: status,
                errorTitle: 'Not implemented',
                userExplanation: `How'd you end up here? This feature isn't ready yet. Try again later.`,
            };
            break;

        case 502: // Bad Gateway
            errorStuff = {
                status: status,
                errorTitle: 'Bad gateway',
                userExplanation: `Something went wrong on our end; try again later. If the issue persists, contact the administrator`,
            };
            break;

        case 503: // Unavailable
            errorStuff = {
                status: status,
                errorTitle: 'Service unavailable',
                userExplanation: `Something went wrong on our end; try again later. If the issue persists, contact the administrator`,
            };
            break;

        case 504: // Gateway Timeout
            errorStuff = {
                status: status,
                errorTitle: 'Gateway timeout',
                userExplanation: `Something went wrong on our end; try again later. If the issue persists, contact the administrator`,
            };
            break;

        default: // Catch-all
            errorStuff = {
                status: status,
                errorTitle: 'Something went wrong',
                userExplanation: `Something went wrong; try again later. If the issue persists, contact the administrator.${
                    dev ? `<br>Developer Details:<pre>${error?.message}</pre>` : ''
                }`,
            };
            break;
    }
    $: switch (
        status // Images
    ) {
        case 401: // Unauthenticated
        case 403: // Forbidden (bad permissions)
            errorStuff.image = {
                uri: 'https://unsplash.com/photos/BjD3KhnTIkg/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Zm9yYmlkZGVufGVufDB8fHx8MTY0NDM2MDEyNA&force=true&w=1920',
                blurhash: 'LLEoul%M5RZ}T#o#baITysoz#;e,',
                aspect: {
                    width: 6709,
                    height: 4473,
                },
                caption: 'Photo by Dim Hou on Unsplash',
            };
            break;

        case 404: // Not Found
            errorStuff.image = {
                uri: 'https://unsplash.com/photos/G85VuTpw6jg/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Nnx8bG9zdHxlbnwwfDB8fHwxNjQ0NDI0Nzgw&force=true&w=1920',
                blurhash: 'L54:c6iKROkTy:jGaye:SvfjtRof',
                aspect: {
                    width: 4,
                    height: 3,
                },
                caption: 'Photo by David Kovalenko on Unsplash',
            };
            break;

        case 418: // Teapot
            errorStuff.image = {
                uri: 'https://unsplash.com/photos/lJHhM4D0wCU/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8dGVhcG90fGVufDB8fHx8MTY0NDQyODE0NA&force=true&w=1920',
                blurhash: 'LeL;gP9FRPIU~qt7M{RPD%kCWBog',
                aspect: {
                    width: 5307,
                    height: 4543,
                },
                caption: 'Photo by laura adai on Unsplash',
            };
            break;

        case 429: // Rate Limit
            errorStuff.image = {
                uri: 'https://unsplash.com/photos/aECGWofxVkw/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQ0NDI4MDk1&force=true&w=1920',
                blurhash: 'LFGRen~otQxs0~%Lxtxu-:NIoLoy',
                aspect: {
                    width: 6,
                    height: 4,
                },
                caption: 'Photo by Ralph (Ravi) Kayden on Unsplash',
            };
            break;

        case 451: // Unavailable for legal reasons
            errorStuff.image = {
                uri: 'https://unsplash.com/photos/6sl88x150Xs/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8bGVnYWx8ZW58MHx8fHwxNjQ0NDE2Njk2&force=true&w=1920',
                blurhash: 'LBN,*,x_?wWAxaadkCo#?vRiDixu',
                aspect: {
                    width: 5700,
                    height: 3800,
                },
                caption: 'Photo by Tingey Injury Law Firm on Unsplash',
            };
            break;

        default: // Catch-all
            errorStuff.image = {
                uri: 'https://unsplash.com/photos/s0XabTAKvak/download?ixid=MnwxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNjQ0NDI3ODQy&force=true&w=1920',
                blurhash: 'LTBp^VWUIVt84nWB-=kC_NaxRkj?',
                aspect: {
                    width: 4747,
                    height: 3165,
                },
                caption: 'Photo by Paul Hanaoka on Unsplash',
            };
    }

    
    import Header from '$lib/components/Header.svelte';
    import { siteName } from '$lib/sitename';

    $: ({ errorTitle, userExplanation, image } = errorStuff);
</script>

<svelte:head>
    {#if errorStuff}
        <title>{status} {errorTitle} - {siteName}</title>
    {/if}
</svelte:head>

{#if errorStuff}
    <Header titleLine1={`${status}`} titleLine2={errorTitle} description={userExplanation} {image} />
{/if}
