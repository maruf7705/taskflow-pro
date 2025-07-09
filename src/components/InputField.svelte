<script>
  export let value = '';
  export let label = '';
  export let type = 'text';
  export let placeholder = '';
</script>

<div class="w-full mb-4">
  <label class="block mb-2 text-sm font-bold text-gray-700" for={label}>
    {label}
  </label>
  {#if type === 'datetime-local'}
    <input
      bind:value
      type="datetime-local"
      {placeholder}
      id={label}
      class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    />
  {:else}
    <input
      bind:value
      type="text"
      {placeholder}
      id={label}
      class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
    />
  {/if}
</div>
