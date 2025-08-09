<script>
  import { onMount } from 'svelte';
  import { tasks } from '../stores/taskStore.js';
  import { timeBlocks } from '../stores/timeBlockStore.js';
  import { setupNotifications } from '../utils/notifications.js';
  import { dndzone } from 'svelte-dnd-action';

  import Button from '../components/Button.svelte';
  import InputField from '../components/InputField.svelte';
  import Modal from '../components/Modal.svelte';
  import TaskItem from '../components/TaskItem.svelte';
  import TimeBlockItem from '../components/TimeBlockItem.svelte';
  import ExportButton from '../components/ExportButton.svelte';
  import PomodoroTimer from '../components/PomodoroTimer.svelte';

  let currentTab = 'pomodoro'; // 'tasks', 'timeblocks', or 'pomodoro'

  // Task state
  let showTaskModal = false;
  let showEditTaskModal = false;
  let taskToEdit = null;
  let newTaskText = '';
  let taskFilter = 'all'; // 'all', 'completed', 'incomplete'

  // Time block state
  let showTimeBlockModal = false;
  let showEditTimeBlockModal = false;
  let timeBlockToEdit = null;
  let newTimeBlock = {
    description: '',
    startTime: '',
    endTime: '',
    notes: '',
  };
  let showClearTimeBlocksConfirm = false;

  onMount(() => {
    setupNotifications();
  });

  function addTask() {
    if (newTaskText.trim()) {
      tasks.addTask({ id: Date.now(), text: newTaskText, completed: false });
      newTaskText = '';
      showTaskModal = false;
    }
  }

  function openEditTaskModal(e) {
    taskToEdit = e.detail;
    showEditTaskModal = true;
  }

  function updateTask() {
    if (taskToEdit) {
      tasks.updateTask(taskToEdit);
      showEditTaskModal = false;
      taskToEdit = null;
    }
  }

  function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function openAddTimeBlockModal() {
    const now = new Date();
    newTimeBlock = {
      description: '',
      startTime: formatDateTime(now),
      endTime: formatDateTime(now),
      notes: '',
    };
    showTimeBlockModal = true;
  }

  function addTimeBlock() {
    if (newTimeBlock.description && newTimeBlock.startTime && newTimeBlock.endTime) {
      timeBlocks.addTimeBlock({ ...newTimeBlock, id: Date.now() });
      showTimeBlockModal = false;
    }
  }

  function openEditTimeBlockModal(e) {
    timeBlockToEdit = { ...e.detail }; // Create a copy to avoid direct mutation
    timeBlockToEdit.startTime = formatDateTime(new Date(timeBlockToEdit.startTime));
    timeBlockToEdit.endTime = formatDateTime(new Date(timeBlockToEdit.endTime));
    showEditTimeBlockModal = true;
  }

  function updateTimeBlock() {
    if (timeBlockToEdit) {
      timeBlocks.updateTimeBlock(timeBlockToEdit);
      showEditTimeBlockModal = false;
      timeBlockToEdit = null;
    }
  }

  function confirmClearTimeBlocks() {
    showClearTimeBlocksConfirm = true;
  }

  function clearAllTimeBlocks() {
    timeBlocks.clearTimeBlocks();
    showClearTimeBlocksConfirm = false;
  }

  function handleDnd(e) {
    const { items } = e.detail;
    tasks.setTasks(items);
  }

  $: filteredTasks = $tasks.filter((task) => {
    if (taskFilter === 'completed') return task.completed;
    if (taskFilter === 'incomplete') return !task.completed;
    return true;
  });
</script>

<div class="container mx-auto p-4 min-h-screen">
  <header class="text-center my-8">
    <h1 class="text-5xl font-bold text-gray-800">TaskFlow Pro</h1>
  </header>

  <!-- Tabs -->
  <div class="flex justify-center mb-8 bg-white/60 rounded-lg p-1 shadow-inner backdrop-blur-md">
    <button
      on:click={() => (currentTab = 'tasks')}
      class="w-full py-2 rounded-lg font-semibold transition-colors"
      class:bg-white={currentTab === 'tasks'}
      class:text-blue-500={currentTab === 'tasks'}
      class:text-gray-600={currentTab !== 'tasks'}
      >Tasks</button
    >
    <button
      on:click={() => (currentTab = 'timeblocks')}
      class="w-full py-2 rounded-lg font-semibold transition-colors"
      class:bg-white={currentTab === 'timeblocks'}
      class:text-blue-500={currentTab === 'timeblocks'}
      class:text-gray-600={currentTab !== 'timeblocks'}
      >Time Blocks</button
    >
    <button
      on:click={() => (currentTab = 'pomodoro')}
      class="w-full py-2 rounded-lg font-semibold transition-colors"
      class:bg-white={currentTab === 'pomodoro'}
      class:text-blue-500={currentTab === 'pomodoro'}
      class:text-gray-600={currentTab !== 'pomodoro'}
      >Pomodoro</button
    >
  </div>

  <!-- Pomodoro Tab -->
  {#if currentTab === 'pomodoro'}
    <PomodoroTimer />
  {/if}

  <!-- Tasks Tab -->
  {#if currentTab === 'tasks'}
    <div class="mb-4">
      <Button onClick={() => (showTaskModal = true)} label="Add New Task" primary />
    </div>
    <div class="flex justify-center space-x-4 my-4">
      <button on:click={() => (taskFilter = 'all')} class:font-bold={taskFilter === 'all'}>All</button>
      <button on:click={() => (taskFilter = 'completed')} class:font-bold={taskFilter === 'completed'}>Completed</button>
      <button on:click={() => (taskFilter = 'incomplete')} class:font-bold={taskFilter === 'incomplete'}>Incomplete</button>
    </div>
    <div use:dndzone={{ items: $tasks }} on:consider={handleDnd} on:finalize={handleDnd}>
      {#each filteredTasks as task (task.id)}
        <TaskItem {task} on:edit={openEditTaskModal} />
      {/each}
    </div>
  {/if}

  <!-- Time Blocks Tab -->
  {#if currentTab === 'timeblocks'}
    <div class="mb-4 flex justify-between">
      <Button onClick={openAddTimeBlockModal} label="Add New Time Block" primary />
      <Button onClick={confirmClearTimeBlocks} label="Clear All" />
    </div>
    <div>
      {#each $timeBlocks as timeBlock (timeBlock.id)}
        <TimeBlockItem {timeBlock} on:edit={openEditTimeBlockModal} />
      {/each}
    </div>
  {/if}

  <div class="mt-8">
    <ExportButton />
  </div>
</div>

<!-- Add Task Modal -->
{#if showTaskModal}
  <Modal on:close={() => (showTaskModal = false)}>
    <h2 slot="header">Add New Task</h2>
    <InputField bind:value={newTaskText} label="Task" placeholder="Enter a new task" />
    <Button onClick={addTask} label="Add Task" primary />
  </Modal>
{/if}

<!-- Edit Task Modal -->
{#if showEditTaskModal}
  <Modal on:close={() => (showEditTaskModal = false)}>
    <h2 slot="header">Edit Task</h2>
    <InputField bind:value={taskToEdit.text} label="Task" />
    <Button onClick={updateTask} label="Update Task" primary />
  </Modal>
{/if}

<!-- Add Time Block Modal -->
{#if showTimeBlockModal}
  <Modal on:close={() => (showTimeBlockModal = false)}>
    <h2 slot="header">Add New Time Block</h2>
    <InputField bind:value={newTimeBlock.description} label="Description" placeholder="What are you working on?" />
    <InputField bind:value={newTimeBlock.startTime} label="Start Time" type="datetime-local" />
    <InputField bind:value={newTimeBlock.endTime} label="End Time" type="datetime-local" />
    <InputField bind:value={newTimeBlock.notes} label="Notes (Optional)" placeholder="Add any notes" />
    <Button onClick={addTimeBlock} label="Add Time Block" primary />
  </Modal>
{/if}

<!-- Edit Time Block Modal -->
{#if showEditTimeBlockModal}
  <Modal on:close={() => (showEditTimeBlockModal = false)}>
    <h2 slot="header">Edit Time Block</h2>
    <InputField bind:value={timeBlockToEdit.description} label="Description" />
    <InputField bind:value={timeBlockToEdit.startTime} label="Start Time" type="datetime-local" />
    <InputField bind:value={timeBlockToEdit.endTime} label="End Time" type="datetime-local" />
    <InputField bind:value={timeBlockToEdit.notes} label="Notes (Optional)" />
    <Button onClick={updateTimeBlock} label="Update Time Block" primary />
  </Modal>
{/if}

<!-- Clear Time Blocks Confirmation Modal -->
{#if showClearTimeBlocksConfirm}
  <Modal on:close={() => (showClearTimeBlocksConfirm = false)}>
    <h2 slot="header">Confirm Clear All Time Blocks</h2>
    <p class="mb-4">Are you sure you want to clear all time blocks? This action cannot be undone.</p>
    <div class="flex justify-end space-x-2">
      <Button onClick={() => (showClearTimeBlocksConfirm = false)} label="Cancel" />
      <Button onClick={clearAllTimeBlocks} label="Clear All" primary />
    </div>
  </Modal>
{/if}
