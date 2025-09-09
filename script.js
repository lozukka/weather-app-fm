console.log("hello")
let openDropdown = document.getElementById("open-units-dropdown");
let dropdown = document.getElementById("dropdown");

openDropdown.addEventListener("click", (event)=>{
    if(dropdown.style.display==="block"){
        dropdown.style.display="none"
    }else{
    dropdown.style.display="block";}
})