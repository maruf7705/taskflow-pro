<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
  <div class="w-full max-w-md p-6 bg-white/70 border border-gray-200 rounded-lg shadow-lg backdrop-blur-lg">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-800"><slot name="header">Modal Title</slot></h2>
      <button on:click={closeModal} class="text-gray-600 hover:text-gray-900">&times;</button>
    </div>
    <div>
      <slot />
    </div>
  </div>
</div>
