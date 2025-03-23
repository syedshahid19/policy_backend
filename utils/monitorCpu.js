const os = require("os");

function getCpuLoad() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach((core) => {
    for (const type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });

  const idle = idleMs / cpus.length;
  const total = totalMs / cpus.length;

  return (1 - idle / total) * 100;
}

function monitorCPU(threshold = 70) {
  setInterval(() => {
    const cpuLoad = getCpuLoad().toFixed(2);
    // console.log(`Current CPU Load: ${cpuLoad}%`);

    if (cpuLoad > threshold) {
      console.log("CPU usage exceeded threshold! Restarting server...");
      process.exit(1); // Let nodemon restart
    }
  }, 5000); // Checking every 5 seconds
}

module.exports = monitorCPU;
