<script>
  import { onMount } from 'svelte'
  let p = 0
  let visible = false
  onMount(() => {
    visible = true
    function next() {
      p += 0.1
      const remaining = 1 - p
      if (remaining > 0.15) setTimeout(next, 500 / remaining)
    }
    setTimeout(next, 250)
  })
</script>

{#if visible}
  <div class="fixed top-0 left-0 w-full h-1 z-50">
    <div class="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ease-in-out" style="width: {p * 100}%"></div>
  </div>
{/if}

{#if p >= 0.4}
  <div class="loading-backdrop"></div>
{/if}

<style>
  .loading-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(1px);
    pointer-events: none;
    z-index: 40;
    animation: fade-in 0.4s ease;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>