const initAnimation = (input) => {
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
};

const loopAnimation = () => {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");

    const middle = canvas.height / 2;
    const cycles = 100;
    const cycleWidth = canvas.width * .51 / cycles;
    let right = canvas.width * .49;
    let left = canvas.width * .51;
    let sign = 1;
    let multiplier = 2;

    analyser.getByteFrequencyData(frequencyArray);

    ctx.strokeStyle = 'white';
    ctx.moveTo(right, middle);
    for(let x = 0; x <= cycles; x ++) {
        ctx.bezierCurveTo(
            right,
            middle + frequencyArray[x] * sign * multiplier,
            right + cycleWidth,
            middle + frequencyArray[x] * sign * multiplier,
            right + cycleWidth,
            middle
        );
        ctx.stroke();
        right += cycleWidth;
        multiplier -= .02;
        sign *= -1;
    }

    sign = -1;
    multiplier = 2;
    ctx.moveTo(left, middle)
    for(let x = 0; x <= cycles; x ++) {
        ctx.bezierCurveTo(
            left,
            middle + frequencyArray[x] * sign * multiplier,
            left - cycleWidth,
            middle + frequencyArray[x] * sign * multiplier,
            left - cycleWidth,
            middle
        );
        ctx.stroke();
        left -= cycleWidth;
        multiplier -= .02;
        sign *= -1;
    }

    window.requestAnimationFrame(loopAnimation);
};
