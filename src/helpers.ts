export function getDuration(src: string) {
  return new Promise(function (resolve) {
    var audio = new Audio();
    audio.addEventListener("loadedmetadata", function () {
      resolve(audio.duration);
    });
    audio.src = src;
  });
}
