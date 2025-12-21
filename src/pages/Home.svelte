<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
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
    timeBlockToEdit = { ...e.detail };
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

<div class="app-container">
  <header class="header">
    <h1 class="title">TaskFlow Pro</h1>
    <p class="subtitle">Antigravity Minimalist</p>
  </header>

  <!-- Main Content Area -->
  <main class="main-content">
    <!-- Pomodoro Tab -->
    {#if currentTab === 'pomodoro'}
      <div transition:fade={{ duration: 200 }}>
        <PomodoroTimer />
      </div>
    {/if}

    <!-- Tasks Tab -->
    {#if currentTab === 'tasks'}
      <div class="content-section" transition:fade={{ duration: 200 }}>
        <div class="section-header glass">
          <h2 class="section-title">My Tasks</h2>
          <Button onClick={() => (showTaskModal = true)} label="+ Add Task" primary />
        </div>
        
        <div class="filter-bar glass">
          <button 
            on:click={() => (taskFilter = 'all')} 
            class="filter-btn"
            class:active={taskFilter === 'all'}
          >
            All
          </button>
          <button 
            on:click={() => (taskFilter = 'incomplete')} 
            class="filter-btn"
            class:active={taskFilter === 'incomplete'}
          >
            Active
          </button>
          <button 
            on:click={() => (taskFilter = 'completed')} 
            class="filter-btn"
            class:active={taskFilter === 'completed'}
          >
            Completed
          </button>
        </div>

        <div class="tasks-container" use:dndzone={{ items: $tasks }} on:consider={handleDnd} on:finalize={handleDnd}>
          {#each filteredTasks as task (task.id)}
            <div transition:slide={{ duration: 200 }}>
              <TaskItem {task} on:edit={openEditTaskModal} />
            </div>
          {/each}
          {#if filteredTasks.length === 0}
            <div class="empty-state glass">
              <div class="empty-icon">📝</div>
              <p>No tasks yet. Create your first task!</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Time Blocks Tab -->
    {#if currentTab === 'timeblocks'}
      <div class="content-section" transition:fade={{ duration: 200 }}>
        <div class="section-header glass">
          <h2 class="section-title">Time Blocks</h2>
          <div class="header-actions">
            <Button onClick={openAddTimeBlockModal} label="+ Add Block" primary />
            {#if $timeBlocks.length > 0}
              <Button onClick={confirmClearTimeBlocks} label="Clear All" />
            {/if}
          </div>
        </div>

        <div class="time-blocks-container">
          {#each $timeBlocks as timeBlock (timeBlock.id)}
            <div transition:slide={{ duration: 200 }}>
              <TimeBlockItem {timeBlock} on:edit={openEditTimeBlockModal} />
            </div>
          {/each}
          {#if $timeBlocks.length === 0}
            <div class="empty-state glass">
              <div class="empty-icon">📅</div>
              <p>No time blocks yet. Schedule your first block!</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Export Button -->
    <div class="export-section">
      <ExportButton />
    </div>
  </main>

  <!-- Floating Bottom Navigation Dock -->
  <nav class="floating-dock glass-strong">
    <button 
      class="dock-item smooth-transition"
      class:active={currentTab === 'tasks'}
      on:click={() => (currentTab = 'tasks')}
    >
      <span class="dock-icon">✓</span>
      <span class="dock-label">Tasks</span>
    </button>
    <button 
      class="dock-item smooth-transition"
      class:active={currentTab === 'timeblocks'}
      on:click={() => (currentTab = 'timeblocks')}
    >
      <span class="dock-icon">📅</span>
      <span class="dock-label">Blocks</span>
    </button>
    <button 
      class="dock-item smooth-transition"
      class:active={currentTab === 'pomodoro'}
      on:click={() => (currentTab = 'pomodoro')}
    >
      <span class="dock-icon">⏱</span>
      <span class="dock-label">Timer</span>
    </button>
  </nav>
</div>

<!-- Modals -->
{#if showTaskModal}
  <Modal on:close={() => (showTaskModal = false)}>
    <h2 slot="header">Add New Task</h2>
    <InputField bind:value={newTaskText} label="Task" placeholder="What needs to be done?" />
    <Button onClick={addTask} label="Add Task" primary />
  </Modal>
{/if}

{#if showEditTaskModal}
  <Modal on:close={() => (showEditTaskModal = false)}>
    <h2 slot="header">Edit Task</h2>
    <InputField bind:value={taskToEdit.text} label="Task" />
    <Button onClick={updateTask} label="Update Task" primary />
  </Modal>
{/if}

{#if showTimeBlockModal}
  <Modal on:close={() => (showTimeBlockModal = false)}>
    <h2 slot="header">Add Time Block</h2>
    <InputField bind:value={newTimeBlock.description} label="Description" placeholder="What are you working on?" />
    <InputField bind:value={newTimeBlock.startTime} label="Start Time" type="datetime-local" />
    <InputField bind:value={newTimeBlock.endTime} label="End Time" type="datetime-local" />
    <InputField bind:value={newTimeBlock.notes} label="Notes (Optional)" placeholder="Add any notes" />
    <Button onClick={addTimeBlock} label="Add Time Block" primary />
  </Modal>
{/if}

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

{#if showClearTimeBlocksConfirm}
  <Modal on:close={() => (showClearTimeBlocksConfirm = false)}>
    <h2 slot="header">Clear All Time Blocks?</h2>
    <p class="confirm-text">Are you sure you want to clear all time blocks? This action cannot be undone.</p>
    <div class="modal-actions">
      <Button onClick={() => (showClearTimeBlocksConfirm = false)} label="Cancel" />
      <Button onClick={clearAllTimeBlocks} label="Clear All" primary />
    </div>
  </Modal>
{/if}

<style>
  .app-container {
    min-height: 100vh;
    padding-bottom: 120px;
  }

  .header {
    text-align: center;
    padding: var(--space-xl) var(--space-md) var(--space-lg);
  }

  .title {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a78bfa, #c4b5fd, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: var(--space-sm);
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 0.9rem;
    color: rgba(74, 74, 104, 0.7);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  .main-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 var(--space-md);
  }

  .content-section {
    margin-bottom: var(--space-xl);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-lg);
    margin-bottom: var(--space-lg);
    border-radius: var(--radius-lg);
    gap: var(--space-md);
    flex-wrap: wrap;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2a2a3e;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: var(--space-sm);
  }

  .filter-bar {
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-sm);
    margin-bottom: var(--space-lg);
    border-radius: var(--radius-md);
    justify-content: center;
  }

  .filter-btn {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    font-weight: 500;
    color: #4a4a68;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .filter-btn:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .filter-btn.active {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(196, 181, 253, 0.2));
    border-color: rgba(167, 139, 250, 0.4);
    color: #2a2a3e;
  }

  .tasks-container,
  .time-blocks-container {
    margin-top: var(--space-md);
  }

  .empty-state {
    text-align: center;
    padding: var(--space-xl);
    border-radius: var(--radius-lg);
    color: rgba(74, 74, 104, 0.7);
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: var(--space-md);
    opacity: 0.5;
  }

  .export-section {
    display: flex;
    justify-content: center;
    margin-top: var(--space-xl);
  }

  /* Floating Bottom Navigation Dock */
  .floating-dock {
    position: fixed;
    bottom: var(--space-lg);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-sm);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-xl);
    z-index: 100;
    animation: float 3s ease-in-out infinite;
  }

  .dock-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 14px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    color: #4a4a68;
    min-width: 80px;
  }

  .dock-item:hover {
    background: rgba(255, 255, 255, 0.35);
    transform: translateY(-4px) scale(1.05);
  }

  .dock-item.active {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(196, 181, 253, 0.3));
    border-color: rgba(167, 139, 250, 0.5);
    box-shadow: var(--glow-primary);
    color: #fff;
  }

  .dock-icon {
    font-size: 1.5rem;
  }

  .dock-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .confirm-text {
    margin-bottom: var(--space-lg);
    color: #4a4a68;
    line-height: 1.6;
  }

  .modal-actions {
    display: flex;
    gap: var(--space-md);
    justify-content: flex-end;
  }

  @media (max-width: 640px) {
    .title {
      font-size: 2.25rem;
    }

    .section-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-actions {
      width: 100%;
      justify-content: stretch;
    }

    .header-actions :global(button) {
      flex: 1;
    }

    .floating-dock {
      bottom: var(--space-md);
      width: calc(100% - var(--space-lg) * 2);
      max-width: 100%;
    }

    .dock-item {
      flex: 1;
      min-width: 0;
      padding: 12px 8px;
    }

    .dock-icon {
      font-size: 1.25rem;
    }

    .dock-label {
      font-size: 0.7rem;
    }
  }
</style>
