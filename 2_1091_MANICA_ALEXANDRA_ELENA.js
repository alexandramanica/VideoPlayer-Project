//functie care raspunde in momentul cand toate resursele paginii web s-au incarcat
window.addEventListener('load',function(){

    //Declarere variabile folosite
    //1.creare canvas si canvas auxiliar pentru a permite aplicarea de efecte
    //1.1 canvas normal
    let mainCanvas=document.querySelector('#canvasMain');
    mainCanvas.width=1000;
    mainCanvas.height=500;
    let context=mainCanvas.getContext('2d');
    //1.2 canvas auxiliar 
    let auxCanvas = document.createElement('canvas');
    auxCanvas.width = mainCanvas.width;
    auxCanvas.height = mainCanvas.height;
    let auxContext = auxCanvas.getContext('2d');
    //2.creare element video
    let mainVideo= document.createElement("video");
    mainVideo.setAttribute('src','media/132017643-open-shelf-warehouse-files-sto.mp4')
    mainVideo.load();
    mainVideo.setAttribute('width', mainCanvas.width);
    mainVideo.setAttribute('height', mainCanvas.height);
    //3.declarare variabile auxiliare si alte elemente html
    //3.1 variabile
    let visible=false; //declarare variabiala folosita pentru a verifica pozitia mouse-ului
    let index=0; //stocheaza pozitia din playlist a video ului curent
    let pinkEf=false; //variabila folosita pentru a verifica efectul de roz
    let thermalEf=false; //variabila folosita pentru a verifica efectul de thermal
    let grainEf=false; //variabila folosita pentru a verifica efectul de grain
    //manipulare butoane pentru aplicarea efectelor, stergere si modificare ordine in playlist
    let pinkButton = document.getElementById('idBtnEfectRoz');
    let thermalButton = document.getElementById('idBtnEfectThermal');
    let grainButton = document.getElementById('idBtnEfectGrain');
    let mUpButton = document.getElementById('idBtnMoveUp');
    let mDownButton = document.getElementById('idBtnMoveDown');
    let deleteButton = document.getElementById('idBtnDelete');
    //adaugarea de noi filme in playlist
    let input = document.querySelector('input');
    //4.initializare lista de videoclipuri
    let videos=[
        'media/132017643-open-shelf-warehouse-files-sto.mp4',
        'media/068550753-1960s-happy-african-american-b.mp4',
        'media/044560185-light-refracting-rotating-blue.mp4',
        'media/011894288-4th-july-fireworks-display-196.mp4'
    ]
    
    //5. creare video player 
    //apel functie pentru desenare videoplayer - include apelul functiilor de desenare controale
    //desenareElemente();
    
    //6. tratarea evenimentelor aparute
    //6.1 atasam conditiilor aferente evenimentului de click pe fiecare dintre controalele desenate
    mainCanvas.addEventListener('click',event=>{
        let offX=event.offsetX;
        let offY=event.offsetY;
        
        //eveniment de click pentru controlul play/stop 
        playFunct(offX,offY);
        //eveniment de click pentru controlul de previous
        playPrevFunc(offX,offY);
        //eveniment de click pentru controlul de next
        playNextFunc(offX,offY);
        //eveniment de navigare prin progress bar 
        navigareProgressBarFunc(offX,offY);
        //eveniment de navigare pentru control de volum
        manipulareVolumFunc(offX,offY);
    })

    //6.2 atasam un eveniment pentru a verifica daca videoclipul este incarcat
    mainVideo.addEventListener('loadedmetadata', function() {
        desenareElemente(); 
    });

    //6.3 atasam un eveniment pentru cazul in care userul va pozitiona mouse-ul pe canvas 
    mainCanvas.addEventListener("mouseenter", event => {
        visible = true;
        pinkEf = false; 
        thermalEf=false;
        grainEf=false;
        desenareElemente(); //controalele vor fi desenate
    });

    //6.4 atasam un eveniment pentru cazul in care videoclipul s-a terminat, se va activa trecerea la urmatorul
    mainVideo.addEventListener("ended", () => mainVideo.src !== null && nextVideo());

    //6.5 manipularea de evenimente pentru a permite efecte
    //6.5.1 Efect Roz
    pinkButton.addEventListener('click', pink);
    pinkButton.addEventListener('mousedown', function () {
        pinkEf = true;
        pink();
    });
    //6.5.2 Efect Thermal
    thermalButton.addEventListener('click', thermal);
    thermalButton.addEventListener('mousedown', function () {
        thermalEf = true;
        thermal();
    });
    //6.5.3 Efect Grain
    grainButton.addEventListener('click', grain);
    grainButton.addEventListener('mousedown', function () {
        grainEf = true;
        grain();
    });

    //6.6 atasam evenimente de stergere si modificare in playlist
    deleteButton.addEventListener('click',deleteFunc);
    mUpButton.addEventListener('click',moveUpFunc);
    mDownButton.addEventListener('click',moveDownFunc);

    //6.7 atasam eveniment pentru incarcarea unui video in controlol de input
    input.addEventListener('change',function(event){
        let videoFiles = event.target.files; //extrage fisiere - creeaza o lista
        manipulareVideo(videoFiles);
    });

    //FUNCTII AUXILIARE
    //1.functie pentru desenare control de play
    function desenarePlayButton() {
        let dimensiune = Math.round(mainCanvas.height/ 25);
        context.lineJoin = 'round';
        context.lineCap = 'round'; //cap rotund linie
    
        //Desenare cerc pentru simbolul de redare
        context.fillStyle = "#F7E1D7";
        context.beginPath(); //se incepe traseu nou
        context.arc(Math.round(mainCanvas.width/15- dimensiune / 5), Math.round(mainCanvas.height - dimensiune * 2 - 5 + dimensiune/2.5), Math.round(dimensiune * 1.1), 0, 2 * Math.PI, false);
        context.fill();
        //Desenare contur cerc pentru simbolul de redare
        context.lineWidth = 1; 
        context.strokeStyle = "#4A5759"; 
        context.stroke(); 
        context.closePath();
        // Desenare triunghi pentru simbolul de redare
        context.beginPath();
        context.moveTo(Math.round(mainCanvas.width / 15 - dimensiune / 2), Math.round(mainCanvas.height - dimensiune * 2-17)); 
        context.lineTo(Math.round(mainCanvas.width / 15 - dimensiune / 2 + dimensiune), Math.round(mainCanvas.height - dimensiune * 2 + dimensiune-17));
        context.lineTo(Math.round(mainCanvas.width / 15 - dimensiune / 2), Math.round(mainCanvas.height - dimensiune * 2 + dimensiune * 2-17));
        context.fillStyle = "#B0C4B1";
        //Desenare contur triunghi pentru simbolul de redare
        context.lineWidth=0.5;
        context.stroke();
        context.fill();
        context.closePath();
    }
    //2.functie pentru desenare control de next
    function desenareNextButton(){
        let dimensiune = Math.round(mainCanvas.height / 25);
        // Desenare sageata + contur
        context.beginPath();
        context.fillStyle = "#B0C4B1";
        context.lineWidth = 0.5;
        context.strokeStyle = "4A5759"
        context.moveTo(Math.round(mainCanvas.width / 9 + dimensiune * 2.5), Math.round(mainCanvas.height - dimensiune * 2 - 10));
        context.lineTo(Math.round(mainCanvas.width / 9 + dimensiune * 2.5 + dimensiune), Math.round(mainCanvas.height - dimensiune * 2 + dimensiune - 10));
        context.lineTo(Math.round(mainCanvas.width / 9 + dimensiune * 2.5), Math.round(mainCanvas.height - dimensiune * 2 + dimensiune * 2 - 10));
        context.stroke();
        context.fill();
        // Desenare dreptunghi + contur
        context.fillRect(Math.round(mainCanvas.width / 7 + dimensiune*2 ),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,40);
        context.strokeRect(Math.round(mainCanvas.width / 7 + dimensiune*2 ),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,40);
        context.lineWidth = 0.1;
        context.closePath();
    }

    //3.functie pentru desenare control de back
    function desenareBackButton() {
        let dimensiune = Math.round(mainCanvas.height / 25);
        // Desenare sageata + contur
        context.beginPath();
        context.fillStyle = "#B0C4B1";
        context.lineWidth = 0.5;
        context.strokeStyle = "#4A5759";
        context.moveTo(Math.round(mainCanvas.width / 11 + dimensiune * 2.5), Math.round(mainCanvas.height - dimensiune * 2 - 10));
        context.lineTo(Math.round(mainCanvas.width / 11 + dimensiune * 2.5 - dimensiune), Math.round(mainCanvas.height - dimensiune * 2 + dimensiune - 10));
        context.lineTo(Math.round(mainCanvas.width / 11 + dimensiune * 2.5), Math.round(mainCanvas.height - dimensiune * 2 + dimensiune * 2 - 10));
        context.stroke();
        context.fill();
            // Desenare dreptunghi + contur
        context.fillRect(Math.round(mainCanvas.width / 9),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,40);
        context.strokeRect(Math.round(mainCanvas.width / 9),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,40);
        context.lineWidth = 0.1;
        context.closePath();
    }      
    
    //4.functie desenare control aferent progressbar
    function desenareProgressBar(){
        let loc;
        //navigare prin progress bar
        if (!isNaN(mainVideo.currentTime) && !isNaN(mainVideo.duration) && mainVideo.duration !== 0) {
            loc = (mainVideo.currentTime / mainVideo.duration);
        } else {
        loc = 0;}
        //desenare progressbar
        let dimensiune = Math.round(mainCanvas.height/ 25);
        context.fillStyle="#B0C4B1";
        context.strokeStyle="#4A5759";
        context.lineWidth=2;
        context.fillRect(Math.round(mainCanvas.width / 6 + dimensiune * 2.5), Math.round(mainCanvas.height - dimensiune * 2 - 10),750*loc,30);
        context.strokeRect(Math.round(mainCanvas.width / 6 + dimensiune * 2.5), Math.round(mainCanvas.height - dimensiune * 2 - 10),750,30);
        // context.fillRect( mainCanvas.width / 3.15 - mainCanvas.width / 40 -mainCanvas.width/4,  mainCanvas.height-55,40,40);
    }  
    
    //5.functie pentru desenare control de play
    function desenareStopButton() {
        let dimensiune = Math.round(mainCanvas.height/ 25);
        context.lineJoin = 'round';
        context.lineCap = 'round';

        //Desenare cerc pentru simbolul de redare
        context.fillStyle = "#F7E1D7";
        context.beginPath();
        context.arc(Math.round(mainCanvas.width/15- dimensiune / 5), Math.round(mainCanvas.height - dimensiune * 2 - 5 + dimensiune/2.5), Math.round(dimensiune * 1.1), 0, 2 * Math.PI, false);
        context.fill();
        //Desenare contur cerc pentru simbolul de redare
        context.lineWidth = 1; 
        context.strokeStyle = "#4A5759"; 
        context.stroke(); 
        context.closePath();
        // Desenare linii pentru simbolul de stop
        context.beginPath();
        context.lineWidth = 0.1;
        context.fillStyle = "#B0C4B1";
        context.fillRect(Math.round(mainCanvas.width / 16 - dimensiune / 2),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,30);
        context.strokeRect(Math.round(mainCanvas.width / 16 - dimensiune / 2),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,30);
        context.fillRect(Math.round(mainCanvas.width / 13 - dimensiune / 2),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,30);
        context.strokeRect(Math.round(mainCanvas.width / 13 - dimensiune / 2),Math.round(mainCanvas.height - dimensiune * 3 + dimensiune-10),8,30);
        context.closePath();
    }

    //6.functie pentru desenare control de volum
    function desenareVolumeButton() {
        let loc=mainVideo.volume;
        // Desenare dreptunghi + contur
        let dimensiune = Math.round(mainCanvas.height / 25);
        context.fillStyle = "rgba(222, 219, 210,0.5)";
        context.lineWidth = 0.5;
        context.strokeStyle = "#4A5759";
        context.fillRect(Math.round(mainCanvas.width / 1.04),Math.round(mainCanvas.height/6 -10),25,80);
        context.strokeRect(Math.round(mainCanvas.width / 1.04),Math.round(mainCanvas.height/6 -10),25,80);
        context.lineWidth = 0.1;
        // Desenare bara + contur
        context.fillStyle = "#B0C4B1";
        context.fillRect(Math.round(mainCanvas.width / 1.032),Math.round(mainCanvas.height / 3.5 - 50 * loc),10,loc*50 );
        context.strokeRect(Math.round(mainCanvas.width / 1.032),Math.round(mainCanvas.height/6 ),10,60);
        context.closePath();
        
        //Desenare simbol
        // Desenare sageata + contur
        context.beginPath();
        context.fillStyle = "#B0C4B1";
        context.lineWidth = 0.5;
        context.strokeStyle = "#4A5759";
        context.moveTo(Math.round(mainCanvas.width/1.015 ), Math.round(mainCanvas.height/6 - dimensiune/2 * 3 - 19));
        context.lineTo(Math.round(mainCanvas.width/1.015 - dimensiune), Math.round(mainCanvas.height/6 - dimensiune/2 * 3 + dimensiune/2 - 19));
        context.lineTo(Math.round(mainCanvas.width /1.015 ), Math.round(mainCanvas.height/6 - dimensiune/2 * 3 + dimensiune - 19));
        context.stroke();
        context.fill();
        // Desenare dreptunghi + contur
        context.fillRect(Math.round(mainCanvas.width / 1.04),Math.round(mainCanvas.height/6 - dimensiune/2 * 3 -14),10,10);
        context.strokeRect(Math.round(mainCanvas.width / 1.04),Math.round(mainCanvas.height/6 - dimensiune/2 * 3 -14),10,10);
        context.lineWidth = 0.1;
        context.closePath();
    }

    //7.functie pentru desenare videoplayer
    function desenareElemente(){
        if(visible===true){
            //desenare contur video player
            context.strokeStyle="#4A5759";
            context.strokeRect(0,0,mainCanvas.width,mainCanvas.height);
            context.lineWidth = 10;
            context.globalAlpha=1;
            context.lineJoin = 'round';
            context.lineCap = 'round';
            
            //desenare video
            context.drawImage(mainVideo, 0, 0, mainCanvas.width, mainCanvas.height);            
            //desenare elemente de control
            //1 + 5 -> desenare buton de play/stop
            if(mainVideo.paused){
                desenarePlayButton();
            } else{ 
                desenareStopButton();}
            //2->buton de next - navigare playlist
            desenareNextButton();
            //3->buton de back - navigare playlist
            desenareBackButton();
            //4->desenare progress bar
            desenareProgressBar();
            //5->desenare control volum
            desenareVolumeButton();

            requestAnimationFrame(desenareElemente); //
    }}

    //8.functie de redare a urmatorului videoclip din playlist
    function nextVideo() {
        if (index < videos.length - 1) {
            index++;
        } else {
            index = 0; 
            alert("Ultimul videoclip din playlist")
        }
        playMainVideo();
    }

    //9.functie de redare a videoclipului anterior din playlist
    function prevVideo() {
        if (index > 0) {
            index--;
        } else {
            index = videos.length - 1;
            alert("Primul videoclip din playlist")
        }
        playMainVideo();
    }

    //10.functie pentru redarea videoclipului curent
    function playMainVideo() {
        if (videos.length > 0) {
            mainVideo.src = videos[index];
            mainVideo.load();
            mainVideo.play();
        } else {
            alert("Playlist-ul este gol!");
        }
    }
    
    //11. functie care se va executa atunci cand este apasat butonul de redare video-ului
    function playFunct(offX,offY){
        if (
            Math.round(mainCanvas.width / 3.15 - mainCanvas.width / 40 -mainCanvas.width/4)<= offX &&
            offX <=  Math.round(mainCanvas.width / 3.15 - mainCanvas.width / 40 -mainCanvas.width/4+ mainCanvas.width / 30) &&
            Math.round(mainCanvas.height-55)<= offY &&
            offY <=  Math.round(mainCanvas.height-55 + 30)
        ) {
        if (mainVideo.paused) {
            mainVideo.play();
        } else {
            mainVideo.pause();
        }}
    }

    //12. functie care se va executa atunci cand este apasat butonul de previous al playerului video
    function playPrevFunc(offX,offY){
        if (
            Math.round(mainCanvas.width / 2.65 - mainCanvas.width / 40 -mainCanvas.width/4)<= offX &&
            offX <=  Math.round(mainCanvas.width / 2.65 - mainCanvas.width / 40 -mainCanvas.width/4+ mainCanvas.width / 30) &&
            Math.round(mainCanvas.height-55)<= offY &&
            offY <=  Math.round(mainCanvas.height-55 + 30)
        ) { prevVideo();}
    }

    //13. functie care se va executa atunci cand este apasat butonul de next al playerului video
    function playNextFunc(offX,offY){
        if (
            Math.round(mainCanvas.width / 2.3 - mainCanvas.width / 40 -mainCanvas.width/4)<= offX &&
            offX <=  Math.round(mainCanvas.width / 2.3 - mainCanvas.width / 40 -mainCanvas.width/4+ mainCanvas.width / 30) &&
            Math.round(mainCanvas.height-55)<= offY &&
            offY <=  Math.round(mainCanvas.height-55 + 30)
        ) { nextVideo();}
    }

    //14. functie care se va executa atunci cand vom naviga prin progress bar
    function navigareProgressBarFunc(offX,offY){
        if (
            Math.round(mainCanvas.width / 6 + mainCanvas.height / 10) <= offX &&
            offX <= Math.round(mainCanvas.width / 6 + mainCanvas.height / 10 + 750) &&
            Math.round(mainCanvas.height - mainCanvas.height / 25 * 2 - 10) <= offY &&
            offY <= Math.round(mainCanvas.height - mainCanvas.height / 25 * 2 - 10 + 30)
        ) {     
            mainVideo.currentTime = ((offX - Math.round(mainCanvas.width / 6 + mainCanvas.height / 10 )) / 750) * mainVideo.duration;
        }
    }

    //15. functie care se va executa atunci cand este apasat butonul de volum
    function manipulareVolumFunc(offX,offY) {
    if (offX > Math.round(mainCanvas.width / 1.06) && 
        offX <= Math.round(mainCanvas.width / 1.06) + 45 &&
        offY >= Math.round(mainCanvas.height / 5 - mainCanvas.width / 25 * 2) && 
        offY <= Math.round(mainCanvas.height / 5) + 200)
     {
        const percentage = 1 - (offY -  Math.round(mainCanvas.height / 5 )) / 45; //poz relativa a controlului volum la click
       // console.log(percentage);
        mainVideo.volume = Math.max(0, Math.min(percentage, 1)); //ajusteaza volumul si se asigura ca procentajul e intre 0 si 1
    }}

    //FUNCTII APLICARE AFECTE - Un efect ramane valabil pana cand se trece la videoclipul urmator/ userul va pune cursorul pe canvas
    //16. functie necesare pentru aplicarea efectului roz
    function pink() {
            auxContext.drawImage(mainVideo, 0, 0, mainCanvas.width, mainCanvas.height);
            const imageData = auxContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
            const data = imageData.data;

            if(pinkEf===true){               
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
    
                    data[i] = Math.min(255, r * 1.5);
                    data[i + 1] = Math.max(0, g * 0.5);
                    data[i + 2] = 150;
                }
            }
                context.putImageData(imageData, 0, 0);
                requestAnimationFrame(pink);
    }

    //17. functie necesare pentru aplicarea efectului thermal
    function thermal() {
        auxContext.drawImage(mainVideo, 0, 0, mainCanvas.width, mainCanvas.height);
        const imageData = auxContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        const data = imageData.data;

        if(thermalEf===true){ 
        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            data[i] = 250 - avg;        
            data[i + 1] = 250;                
            data[i + 2] = avg;           
            }
        }
        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(thermal);
    }

    //18. functie necesare pentru aplicarea efectului grain
    function grain() {
        auxContext.drawImage(mainVideo, 0, 0, mainCanvas.width, mainCanvas.height);
        const imageData = auxContext.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
        const data = imageData.data;
        let intensity = 75;

        if(grainEf===true){ 
            for (let i = 0; i < data.length; i += 4) {
                data[i] +=  Math.random() * intensity; 
                data[i + 1] +=  Math.random() * intensity; 
                data[i + 2] +=  Math.random() * intensity; 
            }                    
        }
        context.putImageData(imageData, 0, 0);
        requestAnimationFrame(grain);
    }

    //FUNCTII MANIPULARE VIDEOPLAYER
    //19. functie stergere video din playlist
    function deleteFunc() {
        if (videos.length > 1) {
            videos.splice(index, 1); 
            if (index === videos.length) {
                index--; 
            }
            alert("Ati sters videoclipul de pe pozitia"+(index+1));
            playMainVideo();
        } else {
            alert("Ai ajuns la ultimul film! Nu il poti sterge!");
        }
    }

    //20. functie modificare pozitiei video din playlist - functia care va duce videoclipul cu o pozitie mai sus
    function moveUpFunc(){
        if (index < videos.length - 1) {
            interschimba(index, index + 1);
            index++; 
            playMainVideo();
            alert("Videoclipul a ajuns pe pozitia"+(index+1));
        }
    }

    //21. functie modificare pozitiei video din playlist - functia care va duce videoclipul cu o pozitie mai jos
    function moveDownFunc(){
        if (index > 0) {
            interschimba(index, index - 1);
            index--; 
            playMainVideo();
            alert("Videoclipul a ajuns pe pozitia"+(index+1));
        }
    }

    //22. functia care interschimba videoclipurile intre ele
    function interschimba(a, b) {
        let aux = videos[a];
        videos[a] = videos[b];
        videos[b] = aux;
    }

    //23. functia de adaugare a unui nou video in playlist
    function manipulareVideo(videoFiles) {
        for (const vid of videoFiles) { 
            if (vid.type.startsWith('video/')) { //verificam ca tipul sa fie video
                videos.push(URL.createObjectURL(vid)); //adaugam in lista
            } else {
                alert('Fisierul incarcat nu e un fisier video! Alegeti altul!');
            }
        }
       // desenareElemente();
    }
});