<script>
  export let onClick = () => {};
  export let label = 'Button';
  export let primary = false;
</script>

<button
  on:click={onClick}
  class="w-full px-4 py-2 font-bold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-75"
  class:bg-blue-500={primary}
  class:hover:bg-blue-600={primary}
  class:focus:ring-blue-400={primary}
  class:bg-gray-500={!primary}
  class:hover:bg-gray-600={!primary}
  class:focus:ring-gray-400={!primary}
  aria-label={label}
>
  {label}
</button>
