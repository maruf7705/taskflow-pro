<script>
  import { onMount, onDestroy } from 'svelte';
  import Button from './Button.svelte';

  let minutes = 25;
  let seconds = 0;
  let timer = null;
  let status = 'idle'; // idle, running, paused
  let sessionType = 'work'; // work, shortBreak, longBreak
  let pomodoroCount = 0;

  const workTime = 25;
  const shortBreakTime = 5;
  const longBreakTime = 15;

  let audio;
  onMount(() => {
    audio = new Audio('/notification.mp3'); // Add notification.mp3 to your /public folder
  });

  function startTimer() {
    status = 'running';
    timer = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          nextSession();
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }
    }, 1000);
  }

  function pauseTimer() {
    status = 'paused';
    clearInterval(timer);
  }

  function resetTimer() {
    status = 'idle';
    clearInterval(timer);
    minutes = workTime;
    seconds = 0;
    pomodoroCount = 0;
    sessionType = 'work';
  }

  function nextSession() {
    audio.play();
    clearInterval(timer);
    status = 'idle';

    if (sessionType === 'work') {
      pomodoroCount++;
      if (pomodoroCount % 4 === 0) {
        sessionType = 'longBreak';
        minutes = longBreakTime;
      } else {
        sessionType = 'shortBreak';
        minutes = shortBreakTime;
      }
    } else {
      sessionType = 'work';
      minutes = workTime;
    }
    seconds = 0;
  }

  onDestroy(() => {
    clearInterval(timer);
  });

  $: formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
</script>

<div class="text-center p-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-md">
  <div class="text-6xl font-bold mb-4">{formattedTime}</div>
  <div class="mb-4 text-lg font-semibold">
    {#if sessionType === 'work'}
      <span>Work Session</span>
    {:else if sessionType === 'shortBreak'}
      <span>Short Break</span>
    {:else}
      <span>Long Break</span>
    {/if}
  </div>
  <div class="flex justify-center space-x-4">
    {#if status !== 'running'}
      <Button onClick={startTimer} label="Start" primary />
    {:else}
      <Button onClick={pauseTimer} label="Pause" />
    {/if}
    <Button onClick={resetTimer} label="Reset" />
  </div>
  <div class="mt-4">Completed Pomodoros: {pomodoroCount}</div>
</div>
