// Grab elements, create settings, etc.
var video = document.getElementById('video');

// Get access to the camera!
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Trigger photo take
document.getElementById("snap").addEventListener("click", function () {
    context.drawImage(video, 0, 0, 640, 480);

    let img = new Image();

    sendImage(canvas.toDataURL()).then(() => {
        document.getElementById('result').src = '/rec/image.png';
    });

});

function sendImage(image) {
    return new Promise(resolve => {
        $.ajax({
            contentType: 'application/json',
            data: JSON.stringify({ image: image }),
            url: 'http://localhost:3000/rec',
            type: 'POST',
            success: function (response) {
                console.log(response);
                resolve();
            }
        });
    });
}