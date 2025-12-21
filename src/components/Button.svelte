<script>
  export let onClick = () => {};
  export let label = '';
  export let primary = false;
  export let disabled = false;
</script>

<button
  on:click={onClick}
  {disabled}
  class="glass hover-lift smooth-transition font-medium px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  class:primary
  style="border-radius: var(--radius-md);"
>
  {label}
</button>

<style>
  button {
    position: relative;
    overflow: hidden;
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  button.primary {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(196, 181, 253, 0.3));
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  button:not(.primary) {
    background: var(--glass-bg);
    color: #4a4a68;
  }

  button:hover:not(:disabled) {
    box-shadow: var(--glow-primary);
  }

  button.primary:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.5), rgba(196, 181, 253, 0.4));
  }

  button:active:not(:disabled) {
    transform: translateY(-2px) scale(0.98);
  }
</style>
