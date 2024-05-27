const API="f00fd707ffd8876fe8c9d0d2a7108e7b";

let gps=document.getElementById("search");
let place=document.getElementById("text");
let disp=document.getElementsByClassName("display");
let img=document.getElementById("img");
let info=document.getElementById("info");
let forC=document.getElementsByClassName("Forcast");
let NxDay=document.getElementById("next");
let prvDay=document.getElementById("prev");
let curr=document.getElementById("curr");

const GetWeather=(response)=>{
    const fL=response.main.feels_like;
    const humid=response.main.humidity;
    const press=response.main.pressure;
    const temp=response.main.temp;
    const vis=response.visibility/1000;
    const wSpeed=response.wind.speed;

    const iconImgURL=`https://openweathermap.org/img/wn/${response.weather[0].icon}@4x.png`;

    const main=response.weather[0].description;

    img.getElementsByTagName("img")[0].src=(iconImgURL);

    if(response.name!=undefined)
    img.getElementsByTagName("div")[0].innerText=`${response.name}`;
    info.innerText=
    `
    ${main} | Feels like ${Math.floor(fL)}⁰

    Wind Speed:${Math.floor(wSpeed*3.6)}Km/h

    Temp: ${Math.floor(temp)}⁰

    Visibility: ${vis}km

    Humidity: ${humid}

    Pressure: ${press}Mb
    
    `
}

const ForcDisplay=()=> {
    let forcData=document.querySelectorAll(".Forcast input");

        forcData.forEach(element => {
            element.addEventListener("change",(e)=>{
                let d=JSON.parse(e.target.labels[0].childNodes[3].innerText);
                GetWeather(d);
            })
        });
    
}

let fetchedData;

const Forcating=async(day,month,year)=>{
    
    document.getElementById("date").textContent=`Date: ${day}-${month}-${year}`;
    let child=forC[0].lastElementChild;
    while (child) {
        forC[0].removeChild(child);
        child=forC[0].lastElementChild;
    }

    const URLF=`https://api.openweathermap.org/data/2.5/forecast?q=${place.value}&appid=${API}&units=metric`;

    forC[0].innerText="Loading...";
    let responseF=await fetch(URLF);
    responseF=await responseF.json();
    fetchedData=responseF.list;
    forC[0].innerText="";
    let i=0;
    let fragment=document.createDocumentFragment();

    while (i<responseF.list.length) {
        let wDate= responseF.list[i].dt_txt.split(" ")[0];
        
        wDate=wDate.split("-");

        if ((year==Number(wDate[0]))&&(day==Number(wDate[2]))&&(month==Number(wDate[1]))) {

            let d=document.createElement("input");
            d.type="radio";
            d.name="same";
            d.id=`${i}`;
            let l=document.createElement("label");
            l.htmlFor=`${i}`;
            l.appendChild(document.createElement('p'));
            l.appendChild(document.createElement("div"));
            l.appendChild(document.createElement("img"));
            l.getElementsByTagName("p")[0].innerText=`Time: ${responseF.list[i].dt_txt.split(" ")[1]}`;
            l.getElementsByTagName("div")[0].innerText=`${responseF.list[i].weather[0].description}
            Feels like ${Math.floor(responseF.list[i].main.feels_like)}⁰
            Temp: ${Math.floor(responseF.list[i].main.temp)}⁰
            `
            l.appendChild(document.createElement('span'));
            l.getElementsByTagName('span')[0].innerText=JSON.stringify(responseF.list[i]);
            l.getElementsByTagName('span')[0].style.display="none";

            l.getElementsByTagName("img")[0].src=`https://openweathermap.org/img/wn/${responseF.list[i].weather[0].icon}@2x.png`;
            
            fragment.appendChild(d);
            fragment.appendChild(l);
        }
        i++
    }

    forC[0].appendChild(fragment);
    ForcDisplay();
}

let Currdate;
let Currmonth;
let Curryear;

gps.addEventListener("click",()=>{
    if (!navigator.onLine) {
        alert("No internet connection");
        place.value="" ;
        return;
    }

    if(navigator.geolocation)
    {navigator.geolocation.getCurrentPosition(async(position)=>{
        
        const URL=`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API}&units=metric`;

        gps.style.display="none";
        info.innerText="Loading...";
        info.style.fontSize="2rem";
        forC[0].innerText="Loading.";
        let response=await fetch(URL);
        response=await response.json();
        gps.style.display="block";
        place.value=response.name;
        GetWeather(response);
        info.style.fontSize="1rem";
        
        Currdate=new Date().getDate();
        Currmonth=new Date().getMonth()+1;
        Curryear=new Date().getFullYear();

        Forcating(Currdate,Currmonth,Curryear);
    },
    (error)=>{
        alert(error.message);
        return;
    }
);}
})

place.addEventListener("input",change=async()=>{
    
    if (!navigator.onLine) {
        alert("No internet connection");
        place.value="" ;
        return;
    }

    if(place.value!=""){

    let str=place.value;

    if(str[0]!=str[0].toUpperCase()){
    str=str.split('');
    str[0]=str[0].toUpperCase();
    str=str.join('');
    }

    else if(str.length!=1&&str[str.length-1]==str[str.length-1].toUpperCase()){
    str=str.split('');
    str[str.length-1]=str[str.length-1].toLowerCase();
    str=str.join('');
    }

    place.value=str;

    const URL2=`https://api.openweathermap.org/data/2.5/weather?q=${place.value}&appid=${API}&units=metric`;

    info.innerText="Loading...";
    info.style.fontSize="2rem";
    forC[0].innerText="Loading.";
    img.getElementsByTagName("img")[0].src="";
    img.getElementsByTagName("div")[0].innerText="";
    let response2=await fetch(URL2);
    if (!response2.ok) {
        info.innerText=undefined;
        forC[0].innerText=`
        Please enter correct 
        name of city`;
        return;
    }
    response2=await response2.json();
    info.style.fontSize="1rem";
    fetchedData=response2;
    GetWeather(response2);
    
    Currdate=new Date().getDate();
    Currmonth=new Date().getMonth()+1;
    Curryear=new Date().getFullYear();

    Forcating(Currdate,Currmonth,Curryear);
}
else if(place.value==""){
info.innerText="";
forC[0].innerText="";
}

})

const checkDate=(dummydate,dummymonth,dummyyear)=>{
    let i=0;
    while (i<fetchedData.length) {
        let wDate= fetchedData[i].dt_txt.split(" ")[0];
        
        wDate=wDate.split("-");

        if ((dummyyear==Number(wDate[0]))&&(dummydate==Number(wDate[2]))&&(dummymonth==Number(wDate[1]))){
            return true;
        }
        i++;
    }
return false;
}

NxDay.addEventListener("click",()=>{
    let dummydate=Currdate; 
    let dummymonth=Currmonth;
    let dummyyear=Curryear;
    dummydate++;
    if((new Date(`${dummyyear}-${dummymonth-1}-${dummydate}`))=="Invalid Date"){
        dummydate=1;
        dummymonth++;
        if((new Date(`${dummyyear}-${dummymonth-1}-${dummydate}`))=="Invalid Date"){
            dummyyear++;
            dummymonth=1;
        }
    }
    
    if(checkDate(dummydate,dummymonth,dummyyear)){
        Currdate=dummydate;
        Currmonth=dummymonth;
        Curryear=dummyyear;
        Forcating(Currdate,Currmonth,Curryear);
    }

})

prvDay.addEventListener("click",()=>{
    let dummydate=Currdate; 
    let dummymonth=Currmonth;
    let dummyyear=Curryear;
    dummydate--;
    if(dummydate==0){
        console.log(dummydate,dummymonth,dummyyear);
        dummydate=new Date(dummyyear,dummymonth-1,dummydate).getDate();
        dummymonth--;

        if(dummymonth==0){
            dummyyear--;
            dummymonth=12;
        }
    }
    
    if(checkDate(dummydate,dummymonth,dummyyear)){
        Currdate=dummydate;
        Currmonth=dummymonth;
        Curryear=dummyyear;
        Forcating(Currdate,Currmonth,Curryear);
    }
})

curr.addEventListener("click",()=>{
    Curryear=new Date().getFullYear();
    Currdate=new Date().getDate();
    Currmonth=new Date().getMonth()+1;
    change();
    Forcating(Currdate,Currmonth,Curryear);
})