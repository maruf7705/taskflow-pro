<script>
  export let value = '';
  export let label = '';
  export let type = 'text';
  export let placeholder = '';
</script>

<div class="input-wrapper">
  <label class="input-label">{label}</label>
  {#if type === 'datetime-local'}
    <input
      bind:value
      type="datetime-local"
      class="glass-input smooth-transition"
    />
  {:else if type === 'number'}
    <input
      bind:value
      type="number"
      {placeholder}
      class="glass-input smooth-transition"
    />
  {:else}
    <input
      bind:value
      type="text"
      {placeholder}
      class="glass-input smooth-transition"
    />
  {/if}
</div>

<style>
  .input-wrapper {
    margin-bottom: var(--space-md);
  }

  .input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a4a68;
    margin-bottom: var(--space-sm);
    letter-spacing: 0.02em;
  }

  .glass-input {
    width: 100%;
    padding: 14px 18px;
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: 'Inter', sans-serif;
    color: #2a2a3e;
    box-shadow: 0 2px 8px rgba(167, 139, 250, 0.08),
                inset 0 1px 3px rgba(0, 0, 0, 0.05);
    outline: none;
  }

  .glass-input::placeholder {
    color: rgba(74, 74, 104, 0.5);
  }

  .glass-input:focus {
    border-color: rgba(167, 139, 250, 0.5);
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1),
                0 4px 16px rgba(167, 139, 250, 0.15),
                inset 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .glass-input:hover:not(:focus) {
    border-color: rgba(255, 255, 255, 0.4);
  }
</style>
