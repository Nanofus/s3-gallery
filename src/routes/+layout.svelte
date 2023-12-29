<script lang="ts">
    import {PUBLIC_INCORRECT_PASSWORD, PUBLIC_LOGIN_TEXT, PUBLIC_SITE_TITLE} from "$env/static/public";
    import {onMount} from "svelte";
    import {browser} from "$app/environment";

    let loggedIn = false;
    let password: string;

    onMount(() => {
        if (browser) {
            loggedIn = getCookie("password") != null;
        }
    });
    
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts?.pop()?.split(';').shift();
    }

    const login = () => {
        if (password) {
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + btoa(password),
                }
            }).then(res => {
                if (res.ok) {
                    loggedIn = true;
                    if (!getCookie("password")) document.cookie="password=" + btoa(password) + ";path=/;samesite=strict;secure";
                    location.reload();
                } else {
                    alert(PUBLIC_INCORRECT_PASSWORD);
                    password = "";
                }
            });
        }
    }
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
    {#if loggedIn}
        <slot></slot>
    {:else}
        <p>{PUBLIC_LOGIN_TEXT}</p>
        <input bind:value={password} type="password" placeholder="Password"/>
        <button on:click={login}>Login</button>
    {/if}
</main>
