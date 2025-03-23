const path = require("path");
const { Worker } = require("worker_threads");

const uploadCSV = (req, res) => {
  const filePath = path.resolve(__dirname, `../${req.file.path}`);

  const worker = new Worker(
    path.resolve(__dirname, "../utils/uploadWorker.js"),
    {
      workerData: { filePath },
    }
  );

  worker.on("message", (msg) => {
    res.status(200).json({ message: msg });
  });

  worker.on("error", (err) => {
    console.error("Worker error:", err);
    res.status(500).json({ error: "Error processing file" });
  });

  worker.on("exit", (code) => {
    if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
  });
};

module.exports = { uploadCSV };
