function WebRtcCam(optionsObject) {
  this.optionsObject = optionsObject || {};

  if (!this.optionsObject.videoElement || !this.optionsObject.canvasElement) {
    throw new Error('boogers');
  }

  this.videoElement = this.optionsObject.videoElement;
  this.canvas = this.optionsObject.canvasElement;

  this.videoStream = null;
}

WebRtcCam.prototype.init = function() {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if (!navigator.getUserMedia) {
    return;
  }

  var mediaOptions = {
    video: true
  };

  navigator.getUserMedia(
    mediaOptions,
    this.streamInit.bind(this),
    this.streamInitError.bind(this)
  );
};

WebRtcCam.prototype.streamInit = function(stream) {
  this.videoStream = stream;

  this.videoElement.src = (window.URL && window.URL.createObjectURL(stream)) || stream;

  this.streamVideo();
};

WebRtcCam.prototype.streamInitError = function(err) {
  console.log('streaming error');
  console.log(err);
};

WebRtcCam.prototype.streamVideo = function() {
  this.canvas.setAttribute('width', this.optionsObject.width);
  this.canvas.setAttribute('height', this.optionsObject.height);

  this.canvasContext = this.canvas.getContext('2d');

  this.drawInterval = Math.round(1000 / this.optionsObject.fps);

  this.videoElement.play();
  this.draw();
};

WebRtcCam.prototype.draw = function() {

  this.canvasContext.drawImage(this.videoElement, 0, 0, this.videoElement.width, this.videoElement.height);
  this.onFrame(this.canvas);

  setTimeout(this.draw.bind(this), this.drawInterval);
}

WebRtcCam.prototype.onFrame = function(canvas) {

};

WebRtcCam.prototype.initOptions = function() {
  var options = {
    videoElement: document.createElement("video"),
    canvas: document.createElement("canvas"),
    fps: 30,
    width: 640,
    height: 480
  };

  document.body.appendChild(options.canvas);

  return options;
};
