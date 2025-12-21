<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  
  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

<div class="modal-backdrop" on:click={close} transition:fade={{ duration: 200 }}>
  <div class="modal-content glass-strong" on:click|stopPropagation transition:scale={{ duration: 300, start: 0.9 }}>
    <div class="modal-header">
      <slot name="header" />
    </div>
    <div class="modal-body">
      <slot />
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(167, 139, 250, 0.15);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-md);
  }

  .modal-content {
    max-width: 500px;
    width: 100%;
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    box-shadow: var(--shadow-xl);
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    margin-bottom: var(--space-lg);
  }

  .modal-header :global(h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2a2a3e;
    margin: 0;
  }

  .modal-body {
    color: #4a4a68;
  }

  /* Custom scrollbar for modal */
  .modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: var(--glass-bg-strong);
    border-radius: var(--radius-full);
  }
</style>
