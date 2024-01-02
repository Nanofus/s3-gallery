<script lang="ts">
    import {PUBLIC_SITE_TITLE} from "$env/static/public";
</script>

<svelte:head>
    <title>{PUBLIC_SITE_TITLE}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, sans-serif;
        }
    </style>
</svelte:head>

<h1>{PUBLIC_SITE_TITLE}</h1>
<main>
    <slot></slot>
</main>

<style>
    h1 {
        font-size: 1.5rem;
        margin-left: 1rem;
    }
    
    main {
        margin: 1rem;
    }
</style>