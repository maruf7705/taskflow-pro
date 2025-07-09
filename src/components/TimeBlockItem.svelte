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

<div class="p-3 my-2 bg-white rounded-lg shadow">
  <div class="font-bold">{timeBlock.description}</div>
  <div class="text-sm text-gray-600">{timeBlock.notes}</div>
  <div class="text-sm text-gray-800">
    {new Date(timeBlock.startTime).toLocaleTimeString()} - {new Date(timeBlock.endTime).toLocaleTimeString()}
    <span class="ml-4 font-bold">{calculateDuration(timeBlock.startTime, timeBlock.endTime)}</span>
  </div>
</div>
