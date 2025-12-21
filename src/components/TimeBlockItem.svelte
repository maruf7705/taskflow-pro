<script>
  import { createEventDispatcher } from 'svelte';
  import { timeBlocks } from '../stores/timeBlockStore.js';

  export let timeBlock;
  const dispatch = createEventDispatcher();

  function deleteTimeBlock() {
    timeBlocks.deleteTimeBlock(timeBlock.id);
  }

  function editTimeBlock() {
    dispatch('edit', timeBlock);
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<div class="time-block glass hover-lift smooth-transition">
  <div class="time-block-header">
    <div class="time-display">
      <span class="time-range">
        {formatTime(timeBlock.startTime)} - {formatTime(timeBlock.endTime)}
      </span>
      <span class="date">{formatDate(timeBlock.startTime)}</span>
    </div>
    <div class="actions">
      <button on:click={editTimeBlock} class="action-btn" aria-label="Edit">✏️</button>
      <button on:click={deleteTimeBlock} class="action-btn delete" aria-label="Delete">🗑️</button>
    </div>
  </div>
  <div class="description">{timeBlock.description}</div>
  {#if timeBlock.notes}
    <div class="notes">{timeBlock.notes}</div>
  {/if}
</div>

<style>
  .time-block {
    padding: var(--space-lg);
    margin-bottom: var(--space-md);
    border-radius: var(--radius-md);
  }

  .time-block-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-md);
  }

  .time-display {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .time-range {
    font-size: 1.1rem;
    font-weight: 600;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-bright));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .date {
    font-size: 0.85rem;
    color: rgba(74, 74, 104, 0.7);
    font-weight: 500;
  }

  .description {
    font-size: 1rem;
    color: #2a2a3e;
    font-weight: 500;
    margin-bottom: var(--space-sm);
  }

  .notes {
    font-size: 0.9rem;
    color: rgba(74, 74, 104, 0.8);
    font-style: italic;
    padding-top: var(--space-sm);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }

  .actions {
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
