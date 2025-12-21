<script>
  import { onMount, onDestroy } from 'svelte';

  let minutes = 25;
  let seconds = 0;
  let isRunning = false;
  let timer;
  let sessionType = 'Work Session';
  let completedPomodoros = 0;
  let progress = 0;

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  $: totalSeconds = minutes * 60 + seconds;
  $: progress = sessionType === 'Work Session' 
    ? ((WORK_TIME - totalSeconds) / WORK_TIME) * 100
    : ((BREAK_TIME - totalSeconds) / BREAK_TIME) * 100;

  function startTimer() {
    if (!isRunning) {
      isRunning = true;
      timer = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            handleTimerComplete();
          } else {
            minutes--;
            seconds = 59;
          }
        } else {
          seconds--;
        }
      }, 1000);
    }
  }

  function pauseTimer() {
    isRunning = false;
    clearInterval(timer);
  }

  function resetTimer() {
    pauseTimer();
    if (sessionType === 'Work Session') {
      minutes = 25;
      seconds = 0;
    } else {
      minutes = 5;
      seconds = 0;
    }
  }

  function handleTimerComplete() {
    pauseTimer();
    if (sessionType === 'Work Session') {
      completedPomodoros++;
      sessionType = 'Break Time';
      minutes = 5;
      seconds = 0;
    } else {
      sessionType = 'Work Session';
      minutes = 25;
      seconds = 0;
    }
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TaskFlow Pro', {
        body: sessionType === 'Work Session' ? 'Break complete! Ready to work?' : 'Work session complete! Time for a break.',
      });
    }
  }

  onDestroy(() => {
    if (timer) clearInterval(timer);
  });
</script>

<div class="pomodoro-container">
  <div class="timer-card glass-strong">
    <div class="session-type">{sessionType}</div>
    
    <div class="timer-ring-container">
      <svg class="timer-ring" viewBox="0 0 200 200">
        <!-- Background ring -->
        <circle
          class="ring-bg"
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          stroke-width="12"
        />
        
        <!-- Progress ring with glow -->
        <circle
          class="ring-progress"
          class:active={isRunning}
          cx="100"
          cy="100"
          r="85"
          fill="none"
          stroke="url(#gradient)"
          stroke-width="12"
          stroke-linecap="round"
          stroke-dasharray="534"
          stroke-dashoffset={534 - (534 * progress) / 100}
          transform="rotate(-90 100 100)"
        />
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a78bfa" />
            <stop offset="50%" stop-color="#c4b5fd" />
            <stop offset="100%" stop-color="#a78bfa" />
          </linearGradient>
          
          <!-- Glow filter -->
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      
      <!-- Timer display -->
      <div class="timer-display">
        <div class="time-text">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
    </div>

    <div class="controls">
      {#if !isRunning}
        <button on:click={startTimer} class="control-btn primary">
          <span class="btn-icon">▶</span>
          <span>Start</span>
        </button>
      {:else}
        <button on:click={pauseTimer} class="control-btn primary">
          <span class="btn-icon">⏸</span>
          <span>Pause</span>
        </button>
      {/if}
      <button on:click={resetTimer} class="control-btn">
        <span class="btn-icon">↻</span>
        <span>Reset</span>
      </button>
    </div>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-label">Completed Pomodoros</div>
        <div class="stat-value">{completedPomodoros}</div>
      </div>
    </div>
  </div>
</div>

<style>
  .pomodoro-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh;
    padding: var(--space-lg);
  }

  .timer-card {
    max-width: 480px;
    width: 100%;
    padding: var(--space-xl);
    border-radius: var(--radius-xl);
    text-align: center;
  }

  .session-type {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2a2a3e;
    margin-bottom: var(--space-lg);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .timer-ring-container {
    position: relative;
    width: 280px;
    height: 280px;
    margin: 0 auto var(--space-xl);
  }

  .timer-ring {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.3))
            drop-shadow(0 0 40px rgba(167, 139, 250, 0.2));
  }

  .ring-progress {
    transition: stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: url(#glow);
  }

  .ring-progress.active {
    animation: ringPulse 2s ease-in-out infinite;
  }

  @keyframes ringPulse {
    0%, 100% {
      filter: url(#glow) drop-shadow(0 0 15px rgba(167, 139, 250, 0.4));
    }
    50% {
      filter: url(#glow) drop-shadow(0 0 25px rgba(167, 139, 250, 0.6));
    }
  }

  .timer-display {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .time-text {
    font-size: 3.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a78bfa, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.05em;
    text-shadow: 0 4px 12px rgba(167, 139, 250, 0.2);
  }

  .controls {
    display: flex;
    gap: var(--space-md);
    justify-content: center;
    margin-bottom: var(--space-lg);
  }

  .control-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    color: #4a4a68;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow-sm);
  }

  .control-btn.primary {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(196, 181, 253, 0.3));
    color: #fff;
  }

  .control-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--glow-primary);
  }

  .control-btn.primary:hover {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.5), rgba(196, 181, 253, 0.4));
  }

  .control-btn:active {
    transform: translateY(0) scale(0.98);
  }

  .btn-icon {
    font-size: 1.1rem;
  }

  .stats {
    padding-top: var(--space-lg);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .stat-label {
    font-size: 0.9rem;
    color: rgba(74, 74, 104, 0.8);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #a78bfa, #c4b5fd);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 640px) {
    .timer-ring-container {
      width: 240px;
      height: 240px;
    }

    .time-text {
      font-size: 2.75rem;
    }

    .controls {
      flex-direction: column;
    }

    .control-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>
