<script lang="ts">
    import {PUBLIC_SITE_TITLE} from "$env/static/public";
</script>

<svelte:head>
    <title>{PUBLIC_SITE_TITLE}</title>
    <style>
        body {
            background-color: darkturquoise;
        }
    </style>
</svelte:head>

<h1>{PUBLIC_SITE_TITLE}</h1>
<main>
    <slot></slot>
</main>
