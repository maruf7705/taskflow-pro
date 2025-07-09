<script>
  import { tasks } from '../stores/taskStore.js';
  import { timeBlocks } from '../stores/timeBlockStore.js';
  import { exportData } from '../utils/export.js';
  import Button from './Button.svelte';

  function handleExport() {
    exportData($tasks, $timeBlocks);
  }
</script>

<Button onClick={handleExport} label="Export Data" />
