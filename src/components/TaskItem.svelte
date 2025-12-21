<script>
  import { createEventDispatcher } from 'svelte';
  import { tasks } from '../stores/taskStore.js';

  export let task;
  const dispatch = createEventDispatcher();

  function toggleComplete() {
    tasks.toggleTask(task.id);
  }

  function deleteTask() {
    tasks.deleteTask(task.id);
  }

  function editTask() {
    dispatch('edit', task);
  }
</script>

<div class="task-item glass hover-lift smooth-transition">
  <div class="task-content">
    <input
      type="checkbox"
      checked={task.completed}
      on:change={toggleComplete}
      class="task-checkbox"
    />
    <span class="task-text" class:completed={task.completed}>
      {task.text}
    </span>
  </div>
  <div class="task-actions">
    <button on:click={editTask} class="action-btn" aria-label="Edit">✏️</button>
    <button on:click={deleteTask} class="action-btn delete" aria-label="Delete">🗑️</button>
  </div>
</div>

<style>
  .task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-md) var(--space-lg);
    margin-bottom: var(--space-md);
    border-radius: var(--radius-md);
  }

  .task-content {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    flex: 1;
  }

  .task-checkbox {
    width: 22px;
    height: 22px;
    cursor: pointer;
    accent-color: var(--color-accent);
    border-radius: 6px;
  }

  .task-text {
    font-size: 1rem;
    color: #2a2a3e;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .task-text.completed {
    text-decoration: line-through;
    color: rgba(74, 74, 104, 0.5);
  }

  .task-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .action-btn {
    background: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: var(--radius-sm);
    padding: 8px 12px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.1);
  }

  .action-btn:active {
    transform: scale(0.95);
  }
</style>
