    const video = document.getElementById('video')

    const canvas = document.getElementById('canvas-video')
    const ctx = canvas.getContext('2d');

    let width =window.innerWidth;
    let height = window.innerHeight;

    let gradient;
    let scaler;

    let isPaused;

video.onpause = ()=>
{
    isPaused = true;
}

video.onplay = ()=>
{
    isPaused = false;
}

function setScaler()
{
    let switcher = width*height;

    if(switcher >= 8000000)
        return 30;
    if(switcher >= 3000000 && switcher < 8000000)
        return 16;
    if(switcher >= 1500000 && switcher < 3000000)
        return 9;
    if(switcher >= 50000 && switcher < 1500000)
        return 6;
    if(switcher <= 50000)
        return 1;
}

function setGradient(scaler)
{    
    return (scaler > 7)? "▮▯M#@$::,-_. ":"█▓▒░Mo:.    ";      
}


function setCanvasWindow()
{
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    scaler =  setScaler();
     gradient = setGradient(scaler);


}

window.onload += setCanvasWindow();
window.addEventListener("resize", setCanvasWindow);

function getPixels()
{
    ctx.drawImage(video, 0, 0,  canvas.width,  canvas.height);        
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
    let row = 0;
    let col = 0;

    const pixels = new Array(height).fill(0).map(() => []);      
    let curr = pixels[row];

    for (let i = 0; i < imageData.data.length; i += 4)
    {
        const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        curr = pixels[row]
        curr.push(avg)
            
        col++;                    
        if (col >= width)
        {
            col = 0;
            row++;
        }
    }
    return pixels;
}

function getCharByScale(scale) 
{
    let pos = Math.floor(scale / 255 * (gradient.length - 1));
    return gradient[pos];
}
window.addEventListener("keydown", (event)=>{ switch(event.key)
    { case"m":{
        video.muted = !video.muted
    }break;
    case"p":{
        isPaused?video.play():video.pause();   
        
     }break;
}
});

function render(textDarkScale)
{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'black';

    for (let i = 0; i < textDarkScale.length; i+=scaler) 
        for (let k = 0; k < textDarkScale[i].length; k+=scaler) 
            ctx.fillText(getCharByScale(textDarkScale[i][k]), k, i);                
}

function frame()
{
    render(getPixels());
    requestAnimationFrame(frame);
}
frame();
