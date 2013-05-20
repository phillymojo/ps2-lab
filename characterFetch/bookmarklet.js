if(typeof jQuery != 'undefined'){
	console.log(jQuery().jquery);
}
console.log(ps2char_id);
var mywidget = document.getElementById("my_unique_id");

if(mywidget){
	mywidget.parentNode.removeChild(mywidget);
} else {

var myCSS, 
	myStyleNode,
    myHTML, 
    myHTMLNode,
   	sayHello;
 
    /* add the css */
    myCSS  = '#my_unique_id, #my_unique_id *{font-family:Courier,"Courier New",sans-serif;color:#333;line-height:1.5em;font-size:15px;margin:0;padding:0;text-shadow:none;}';
    myCSS += '#my_unique_id {z-index:10000;position:fixed;top:0;right:300px;background-color:#ccc;}';
    myCSS += '#my_unique_id .c {width:200px; padding:20px;}';
    myCSS += '#my_unique_id h1 {font-size:20px; margin-bottom:0.5em;color:#0080C0}';
    myCSS += '#my_unique_id p {margin-bottom:0.5em;}';
    /* then insert it */
    myStyleNode =  document.createElement('style');
    myStyleNode.innerHTML = myCSS;
    document.body.appendChild(myStyleNode);
 
    /* build the HTML element */
    myHTML  = '<div class="c">';
    myHTML += '<h1>Boring Widget</h1>';
    myHTML += '<p>That says hello when you click it.</p>';
    myHTML += '</div>';
    myHTML += '<div>';
    myHTML += document.cookie;
    myHTML += '</div>';
    /* and create the node */
    myHTMLNode = document.createElement('div');
    myHTMLNode.id = 'my_unique_id';
    myHTMLNode.innerHTML = myHTML;
 
    /* add js functionality to it */
    sayHello = function() {
      var who = window.prompt('who?'); alert('hello '+who);
    };
 
    if (myHTMLNode.addEventListener) {
      myHTMLNode.addEventListener('click', sayHello, false);
    } else if (el.attachEvent) {
      myHTMLNode.attachEvent('onclick', sayHello);
    }
 
    /* to add MORE scripts */
//    var myScriptNode=document.createElement('script');
//    myScriptNode.setAttribute('src','http://some.js/file.more.js');
//    document.head.appendChild(myScriptNode);
 
    /* inject the node, with the event attached */
    document.body.appendChild(myHTMLNode);
}