<script>
  export let task;
  import { tasks } from '../stores/taskStore.js';

  function toggleComplete() {
    task.completed = !task.completed;
    tasks.updateTask(task);
  }

  function deleteTask() {
    tasks.deleteTask(task.id);
  }
</script>

<div class="flex items-center justify-between p-3 my-2 bg-white rounded-lg shadow">
  <div class="flex items-center">
    <input type="checkbox" bind:checked={task.completed} on:change={toggleComplete} class="mr-3" />
    <span class:line-through={task.completed}>{task.text}</span>
  </div>
  <div>
    <button on:click={() => (showEditModal = true)} class="mr-2 text-blue-500">Edit</button>
    <button on:click={deleteTask} class="text-red-500">Delete</button>
  </div>
</div>

<!-- Note: Edit functionality would require a modal, which is omitted here for brevity -->
<!-- but can be implemented using the Modal component -->
