console.log("start index.js")
document.getElementById('thisButton').addEventListener('click', function() {
    console.log("you clicked a button at"+Date.now());
    Mic.audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
    });
});
console.log("end index.js")

