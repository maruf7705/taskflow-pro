<script>
  import { tasks } from '../stores/taskStore.js';
  import { timeBlocks } from '../stores/timeBlockStore.js';

  function exportData() {
    const data = {
      tasks: $tasks,
      timeBlocks: $timeBlocks,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-pro-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<button on:click={exportData} class="export-btn glass smooth-transition">
  <span class="icon">💾</span>
  <span>Export Data</span>
</button>

<style>
  .export-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 500;
    color: #4a4a68;
    cursor: pointer;
    border: none;
  }

  .export-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .export-btn:active {
    transform: translateY(0);
  }

  .icon {
    font-size: 1.2rem;
  }
</style>
