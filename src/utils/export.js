export function exportData(tasks, timeBlocks) {
  let report = 'TaskFlow Pro Report\n\n';

  report += '== Tasks ==\n';
  tasks.forEach((task) => {
    report += `[${task.completed ? 'x' : ' '}] ${task.text}\n`;
  });

  report += '\n== Time Blocks ==\n';
  timeBlocks.forEach((block) => {
    report += `${block.description} (${new Date(block.startTime).toLocaleTimeString()} - ${new Date(
      block.endTime
    ).toLocaleTimeString()})\n`;
    if (block.notes) {
      report += `  Notes: ${block.notes}\n`;
    }
  });

  // Create a blob and download it
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'taskflow-pro-report.txt';
  a.click();
  URL.revokeObjectURL(url);
}
