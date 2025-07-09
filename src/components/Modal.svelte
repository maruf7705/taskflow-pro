<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
  <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold"><slot name="header">Modal Title</slot></h2>
      <button on:click={closeModal} class="text-gray-500 hover:text-gray-700">&times;</button>
    </div>
    <div>
      <slot />
    </div>
  </div>
</div>
