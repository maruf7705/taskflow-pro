<script>
  import { createEventDispatcher } from 'svelte';
  export let task;
  import { tasks } from '../stores/taskStore.js';

  const dispatch = createEventDispatcher();

  function toggleComplete() {
    // The task.completed value is already updated by the bind:checked directive
    tasks.updateTask(task);
  }

  function deleteTask() {
    tasks.deleteTask(task.id);
  }

  function editTask() {
    dispatch('edit', task);
  }
</script>

<div class="flex items-center justify-between p-4 my-2 bg-white/80 rounded-lg shadow-md backdrop-blur-md">
  <div class="flex items-center">
    <input type="checkbox" bind:checked={task.completed} on:change={toggleComplete} class="w-5 h-5 mr-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
    <span class:line-through={task.completed} class:text-gray-500={task.completed}>{task.text}</span>
  </div>
  <div>
    <button on:click={editTask} class="mr-2 text-blue-500 hover:text-blue-700">Edit</button>
    <button on:click={deleteTask} class="text-red-500 hover:text-red-700">Delete</button>
  </div>
</div>
