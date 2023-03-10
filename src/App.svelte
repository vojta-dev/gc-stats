<script lang="ts">
  import { getHtml, type Chart } from './cache';

  let username = '';

  let loading = false;
  let stats: { chart: Chart } = null;
  let error: string = null;

  $: html = stats === null ? '' : getHtml(stats);

  async function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      error = null;
      loading = true;
      const body = await (await fetch('/api/stats?name=' + username)).json();
      loading = false;
      if (body.success) stats = body.stats;
      else error = body.error;
    }
  }

  function copyHtml() {
    navigator.clipboard.writeText(html);
  }
</script>

<h1>geocaching stats thing</h1>
<input bind:value={username} on:keypress={handleKeyPress} placeholder="Enter a username..." />

{#if loading === true}
  <h2>Loading</h2>
{/if}

{#if error !== null}
  <h2>{error}</h2>
{/if}

<button on:click={copyHtml}>copy html</button>

{@html html}

<footer>
  <small>
    &copy; {new Date().getFullYear()} Vojta | <a href="https://github.com/vojta-dev/gc-stats">GitHub</a> | Colors from
    <a href="https://tailwindcss.com/docs/customizing-colors#default-color-palette">Tailwind</a>
  </small>
</footer>

<style>
  input {
    font-size: 2rem;
    padding: 0.5rem;
  }

  button {
    margin: 1rem;
    font-size: 1.5rem;
  }

  footer {
    position: absolute;
    text-align: center;
    bottom: 1rem;
    width: 100%;
  }
  footer a {
    color: #0ea5e9;
    text-decoration: none;
  }
  footer a:hover {
    text-decoration: underline;
  }
</style>
