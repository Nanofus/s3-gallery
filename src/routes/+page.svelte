<script lang="ts">
    import type {Album} from "$lib/types";
    import {onMount} from "svelte";
    import {browser} from "$app/environment";

    let loggedIn = false;
    
    onMount(() => {
        if (browser) {
            loggedIn = localStorage.getItem("password") != null;
        }
    })
    
    export let data: { albums: Album[] };
    let password: string;
    
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
                    localStorage.setItem("password", password);
                } else {
                    alert("Incorrect password");
                    password = "";
                }
            });
        }
    }
</script>

<main>
  <h1>Albums</h1>
  {#if loggedIn}<ul>
    {#each data.albums as album}
      <li>
        <a href="/album/{album.slug}">
          {album.name}
        </a>
      </li>
    {/each}
  </ul>
  {:else}
    <p>You need to be logged in to view this page.</p>
    <input bind:value={password} type="password" placeholder="Password" />
    <button on:click={login}>Login</button>
  {/if}
</main>
