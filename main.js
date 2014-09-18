(function(main){
 if("function"!==typeof main.getElementById){
  console && console.error("No getElementById method!");
 }
 var logo = main.getElementById("logo");
 logo.innerHTML = "Duel Acadenadr";
})(document);
