const formDiv = document.getElementById("form");
const icon = document.getElementById("icon");
const message = document.getElementById("message");
const loadingMessage = document.getElementById("loadingMessage");

var forms = document.querySelectorAll('form');
forms.forEach((form) => form.onsubmit = onsubmit);

function onsubmit(e){
    e.preventDefault();
    var form = e.target;
    var formData = new FormData(form);
    var encodedData = new URLSearchParams(formData);
    console.log(encodedData);

    formDiv.style.opacity = "0";
    formDiv.style.pointerEvents = "none";
    icon.style.width = "80%";
    icon.style.position = "absolute";
    icon.style.left = "10%";
    icon.style.paddingTop = "33%";
    loadingMessage.style.opacity = "100"

    fetch('https://messageiab.herokuapp.com/', {method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
    body: encodedData})
        .then((response) => {
        message.style.opacity = "100";
        message.style.width = "100%";
        message.style.height = "100%";
        icon.style.width = "0%";
        icon.style.paddingTop = "0%";
        loadingMessage.style.opacity = "0"
        message.style.pointerEvents = "auto";
        return response.json();
    })
        .then((data) => {
        document.getElementById("senderName").innerHTML = data.name;
        document.getElementById("response").innerHTML = data.message;
    });
    return false;
    //await results
    //fade in <div id = "message">
    //display results in <div id = "message">
}
function closeMessage(){
    console.log("message closed")
    formDiv.style.opacity = "100";
    formDiv.style.pointerEvents = "auto";
    message.style.opacity = "0";
    message.style.width = "0%";
    message.style.height = "0%";
    icon.style.width = "20%";
    icon.style.left = "0%;";
    icon.style.paddingTop = "0%;";
    icon.style.position = "relative";
    message.style.pointerEvents = "none";
    loadingMessage.style.opacity = "0"
    //fade out <div id = "message">
    //fade in <div id = "form"
}