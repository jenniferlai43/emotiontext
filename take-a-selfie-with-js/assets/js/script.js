$(document).ready(()=> {

    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    var streaming = false;

    var canvas = null;
    var photo = null;
    var startbutton = null;

    const constraints = {
        video: true
    };
    
    const video = document.querySelector('video');
    
    navigator.mediaDevices.getUserMedia(constraints).
    then((stream) => {video.srcObject = stream});
        
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');

    startbutton.addEventListener('click', function(ev){
        ev.preventDefault();
        takepicture();
    }, false);


    function takepicture() {
        var context = canvas.getContext('2d');
        height = video.clientHeight;
        width = video.clientWidth;
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
            
            console.log(typeof(canvas));
            var data = canvas.toDataURL('image/png');
            console.log(typeof(data));
            //console.log(data);
            photo.setAttribute('src', data);
        } else {
            clearphoto();
        }
    }

    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }
});