const initPage = () => {
    const input = document.getElementById('upload-input');
    const upload = document.getElementById('upload-button');
    const sample = document.getElementById('sample');

    input.addEventListener('change', handleFile);
    upload.addEventListener('click', uploadFile);
    sample.addEventListener('click', playSample);
    
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const middle = canvas.height / 2;
    ctx.strokeStyle = 'white';
    ctx.moveTo(0, middle);
    ctx.lineTo(canvas.width, middle);
    ctx.stroke();
};

const initAnimation = input => {
    const audio = new Audio();
    const context = new (window.AudioContext || window.webkitAudioContext)();
    analyser = context.createAnalyser();
    audio.crossOrigin = "anonymous";
    audio.src = input;
    const source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    
    frequencyArray = new Uint8Array(analyser.frequencyBinCount);
    audio.play();
    loopAnimation(frequencyArray, analyser);
    changeEventHandlers(audio);
};

const loopAnimation = () => {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const middle = canvas.height / 2;
    const cycles = 100;
    const offset = 5;
    const cycleWidth = canvas.width * .51 / cycles;
    let right = canvas.width * .49;
    let left = canvas.width * .51;
    let sign = 1;
    const initMultiplier = 1.5;
    const multiplierStep = 0.015; 
    let multiplier = initMultiplier;
    const initMax = frequencyArray[offset];
    const maxStep = initMax / cycles;
    let max = initMax;

    analyser.getByteFrequencyData(frequencyArray);

    ctx.strokeStyle = 'white';
    ctx.moveTo(right, middle);
    for(let x = offset; x <= cycles + offset; x ++) {
        let current = frequencyArray[x];
        ctx.bezierCurveTo(
            right,
            middle + ((current + max + max) / 3) * sign * multiplier,
            right + cycleWidth,
            middle + ((current + max + max) / 3) * sign * multiplier,
            right + cycleWidth,
            middle
        );
        ctx.stroke();
        right += cycleWidth;
        multiplier -= multiplierStep;
        sign *= -1;
        max -= maxStep;
    }

    sign = 1;
    multiplier = initMultiplier;
    max = initMax;
    ctx.moveTo(left, middle)
    for(let x = 0; x <= cycles; x ++) {
        let current = frequencyArray[x];
        ctx.bezierCurveTo(
            left,
            middle + ((current + max + max) / 3) * sign * multiplier,
            left - cycleWidth,
            middle + ((current + max + max) / 3) * sign * multiplier,
            left - cycleWidth,
            middle
        );
        ctx.stroke();
        left -= cycleWidth;
        multiplier -= multiplierStep;
        sign *= -1;
        max -= maxStep;
    }

    window.requestAnimationFrame(loopAnimation);
};

const playSample = () => {
    initAnimation('./charlieChaplin.mp3');
}

const uploadFile = () => {
    document.getElementById('upload-input').click();
};

const handleFile = e => {
    e.preventDefault();
    const file = e.currentTarget.files[0];
    const fileName = file.name.split('.');
    
    if (fileName[fileName.length - 1] !== 'mp3') {
        window.alert('Please upload an mp3 file');
        return;
    }

    const fileReader = new FileReader();

    fileReader.onloadend = () => {
        initAnimation(fileReader.result)
    };

    if (file) fileReader.readAsDataURL(file);
};

const changeEventHandlers = audio => {
    const input = document.getElementById('upload-input');
    const upload = document.getElementById('upload-button');
    const sample = document.getElementById('sample');
    const pause = document.getElementById('pause');

    const handleNewFile = e => {
        e.preventDefault();
        const file = e.currentTarget.files[0];
        const fileName = file.name.split('.');
        
        if (fileName[fileName.length - 1] !== 'mp3') {
            window.alert('Please upload an mp3 file');
            return;
        }
    
        const fileReader = new FileReader();
    
        fileReader.onloadend = () => {
            audio.src = fileReader.result;
            audio.load();
            audio.play();
        };
    
        if (file) fileReader.readAsDataURL(file);    
    }

    const uploadNewFile = () => {
        audio.pause();
        input.value = ''
        input.click();
    }

    const replaySample = () => {
        audio.pause();
        audio.src = './charlieChaplin.mp3';
        audio.load();
        audio.play();
    }

    const togglePause = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    input.removeEventListener('change', handleFile);
    upload.removeEventListener('click', uploadFile);
    sample.removeEventListener('click', playSample);
    pause.removeEventListener('click', togglePause);

    input.addEventListener('change', handleNewFile);
    upload.addEventListener('click', uploadNewFile);
    sample.addEventListener('click', replaySample);
    pause.addEventListener('click', togglePause);
};