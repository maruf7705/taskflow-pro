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
      }
      else {
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

  $: totalSecondsInSession = (() => {
    if (sessionType === 'work') return workTime * 60;
    if (sessionType === 'shortBreak') return shortBreakTime * 60;
    if (sessionType === 'longBreak') return longBreakTime * 60;
    return 0;
  })();

  $: remainingSecondsInSession = minutes * 60 + seconds;
  $: progress = totalSecondsInSession > 0 ? (remainingSecondsInSession / totalSecondsInSession) : 0;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  $: strokeDashoffset = circumference * (1 - progress);
</script>

<div class="text-center p-6 bg-white/80 rounded-lg shadow-lg backdrop-blur-md flex flex-col items-center">
  <div class="relative w-48 h-48 mb-4">
    <svg class="w-full h-full" viewBox="0 0 200 200">
      <circle
        class="text-gray-300"
        stroke-width="10"
        stroke="currentColor"
        fill="transparent"
        r="{radius}"
        cx="100"
        cy="100"
      />
      <circle
        class="text-blue-500 transition-all duration-1000 ease-linear"
        stroke-width="10"
        stroke-dasharray="{circumference}"
        stroke-dashoffset="{strokeDashoffset}"
        stroke-linecap="round"
        stroke="currentColor"
        fill="transparent"
        r="{radius}"
        cx="100"
        cy="100"
        transform="rotate(-90 100 100)"
      />
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-5xl font-bold text-gray-800">{formattedTime}</div>
    </div>
  </div>

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
