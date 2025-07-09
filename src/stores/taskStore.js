import { writable } from 'svelte/store';

const createTasks = () => {
  const { subscribe, set, update } = writable(JSON.parse(localStorage.getItem('tasks')) || []);

  return {
    subscribe,
    setTasks: (newTasks) => {
      set(newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    },
    addTask: (task) => {
      update((tasks) => {
        const newTasks = [...tasks, task];
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        return newTasks;
      });
    },
    updateTask: (updatedTask) => {
      update((tasks) => {
        const newTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        return newTasks;
      });
    },
    deleteTask: (id) => {
      update((tasks) => {
        const newTasks = tasks.filter((task) => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
        return newTasks;
      });
    },
    clearTasks: () => {
      set([]);
      localStorage.removeItem('tasks');
    },
  };
};

export const tasks = createTasks();
