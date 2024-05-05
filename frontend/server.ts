// server.ts
import { spawn } from 'child_process';

const trimVideo = (inputFile, startTime, endTime, outputFile) => {
  const ffmpeg = spawn('ffmpeg', [
    '-i', inputFile,
    '-ss', startTime,
    '-to', endTime,
    outputFile
  ]);

  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

export default trimVideo;