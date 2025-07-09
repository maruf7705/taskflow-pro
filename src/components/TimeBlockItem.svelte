<script>
  export let timeBlock;

  function calculateDuration(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${hours}h ${minutes}m`;
  }
</script>

<div class="p-4 my-2 bg-white/80 rounded-lg shadow-md backdrop-blur-md">
  <div class="font-bold text-gray-800">{timeBlock.description}</div>
  <div class="text-sm text-gray-600">{timeBlock.notes}</div>
  <div class="mt-2 text-sm text-gray-800">
    {new Date(timeBlock.startTime).toLocaleTimeString()} - {new Date(timeBlock.endTime).toLocaleTimeString()}
    <span class="ml-4 font-bold text-blue-500">{calculateDuration(timeBlock.startTime, timeBlock.endTime)}</span>
  </div>
</div>
