//fetch data from api and shown it according to the ID
const loadingGear = document.querySelector('#loadingGear');
const mainContainer = document.querySelector('#main');

async function Sync(){
try{
    mainContainer.hidden = true;
    loadingGear.hidden = false;
    const apiDataFetch = await fetch ('https://local-engineer.cyclic.app/multitask/read');
    var apiData = await apiDataFetch.json();
    //console.log(apiData[0].Asset);
    apiData.forEach(item => {
        console.log(item.Asset.name);
    });







    loadingGear.hidden = true;
    mainContainer.hidden = false;
}
catch (error){
 console.log("error geting info from API")
 loadingGear.hidden = false;
 alert(error);
}


};

Sync();













