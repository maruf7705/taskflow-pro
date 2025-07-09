import { writable } from 'svelte/store';

const createTimeBlocks = () => {
  const { subscribe, set, update } = writable(JSON.parse(localStorage.getItem('timeBlocks')) || []);

  return {
    subscribe,
    addTimeBlock: (timeBlock) => {
      update((timeBlocks) => {
        const newTimeBlocks = [...timeBlocks, timeBlock];
        localStorage.setItem('timeBlocks', JSON.stringify(newTimeBlocks));
        return newTimeBlocks;
      });
    },
    clearTimeBlocks: () => {
      set([]);
      localStorage.removeItem('timeBlocks');
    },
  };
};

export const timeBlocks = createTimeBlocks();
