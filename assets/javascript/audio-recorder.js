export class AudioRecorder {
  constructor() {
    this.constraints = { audio: true };
    this.chunks = [];
    this.isRecording = false;
    this.mediaRecorder = undefined;
  }

  init() {
    this.constraints = { audio: true };
    this.chunks = [];

    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia(this.constraints).then(
        (stream) => {
          this.mediaRecorder = new MediaRecorder(stream);

          this.mediaRecorder.ondataavailable = (event) => {
            this.chunks.push(event.data);
          };

          resolve();
        },
        (err) => {
          console.error("The following error occured: " + err);
          reject(err);
        }
      );
    });
  }

  start() {
    this.mediaRecorder.start();
    this.isRecording = true;
  }

  save() {
    let blob = undefined;

    this.mediaRecorder.onstop = () => {
      blob = new Blob(this.chunks, { type: this.mediaRecorder.mimeType });

      this.chunks = [];
      this.isRecording = false;
    };

    this.mediaRecorder.stop();

    return new Promise((resolve, _) => {
      const interval = setInterval(() => {
        if (!this.isRecording) {
          clearInterval(interval);
          resolve(blob);
        }
      }, 500);
    });
  }
}
