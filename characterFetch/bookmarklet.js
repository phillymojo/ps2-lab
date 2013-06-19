
PS2CharWidget = {
    myWidget: null,

    initBookmarklet: function(){
        _this = this;

        if(this.myWidget){
            this.myWidget.parentNode.removeChild(this.myWidget);
            this.myWidget = null;
        } else {

            /* only put the CSS Styles on the page once */
            if(!document.getElementById('PS2CharWidgetStyle')) {
                var myCSS, 
                    myStyleNode,
                /* add the css */
                myCSS  = '#my_unique_id, #my_unique_id *{font-family:Courier,"Courier New",sans-serif;color:#333;line-height:1.5em;font-size:15px;margin:0;padding:0;text-shadow:none;}';
                myCSS += '#my_unique_id {overflow: hidden;width: 200px; height: 400px; z-index:10000;position:fixed;top:10px;right:0;background-color:#ccc;}';
                myCSS += '#my_unique_id .c {}';
                myCSS += '#my_unique_id h1 {font-size:20px; margin-bottom:0.5em;color:#0080C0}';
                myCSS += '#my_unique_id p {margin-bottom:0.5em;}';
                /* then insert it */
                myStyleNode =  document.createElement('style');
                myStyleNode.id = 'PS2CharWidgetStyle';
                myStyleNode.innerHTML = myCSS;
                document.body.appendChild(myStyleNode);
            }

            var myHTML, 
                myHTMLNode;
            /* build the HTML element */
            myHTML  = '<div class="c">';
            myHTML += '<h1>Boring Widget</h1>';
            myHTML += '</div>';
            /* and create the node */
            myHTMLNode = document.createElement('div');
            myHTMLNode.id = 'my_unique_id';
            myHTMLNode.innerHTML = myHTML;
         
            /* add js functionality to it */
            closeMe = function(){
                _this.myWidget.parentNode.removeChild(_this.myWidget);
                _this.myWidget = null;
            };
         
            if (myHTMLNode.addEventListener) {
              myHTMLNode.addEventListener('click', closeMe, false);
            } else if (el.attachEvent) {
              myHTMLNode.attachEvent('onclick', closeMe);
            }
         
            /* to add MORE scripts */
        //    var myScriptNode=document.createElement('script');
        //    myScriptNode.setAttribute('src','http://some.js/file.more.js');
        //    document.head.appendChild(myScriptNode);
         
            /* inject the node, with the event attached */
            document.body.appendChild(myHTMLNode);
            this.myWidget = document.getElementById("my_unique_id");

            jQuery.ajax({
                url: 'https://census.soe.com/get/ps2/single_character_by_id/?id=5428013610387904065',
                dataType: 'jsonp'
            }).done(function(data, textStatus, jqXHR) {
                if(textStatus == 'success'){
                    PS2CharWidget.loadChar(data);
                } else {
                    console.log('data error');
                }
            })
        }
    },

    loadChar: function(response){
        var chardata = response.single_character_by_id_list[0];
        console.log(chardata);
        var frag = '<div>Name: ' + chardata.name.first + '</div>' + 
                   '<div>ID: ' + chardata.id + '</div>' +
                   '<div>BR: ' + chardata.battle_rank.value + '</div>' +
                   '<div>Percent to Next: '+ chardata.battle_rank.percent_to_next + '</div>'
                   /*
            <div class='lvl-1' id="lastlogin"><label>Last Login:</label> <%= UTILS.timestampToDate(times.last_login, true) %></div>
            <div class='lvl-1' id="lastsave"><label>Last Save:</label> <%= UTILS.timestampToDate(times.last_save, true) %></div>
            <div class='lvl-1' id="createddate"><label>Created On:</label> <%= UTILS.timestampToDate(times.creation, true) %></div>
            <div class='lvl-1' id="logincount"><label>Logins:</label> <%= times.login_count %></div>
            <div class='lvl-1' id="timeplayed"><label>Time Played:</label> <%= UTILS.convertMilliToTime(times.minutes_played * 60 * 1000, true) %></div>
            <div class='lvl-1' id="certsavailable"><label>Cert Available:</label> <%= certs.available_points %></div>
            <div class='lvl-1' id="certstotal"><label>Cert Total:</label> <%= certs.earned_points %></div>
*/
        + divWrapper({'content': 'New Content', 'class': 'new_class', 'id': 'new_id', 'asText': true});
        jQuery('#my_unique_id .c').append(frag);
    }
}

// Only do anything if jQuery isn't defined
if (typeof jQuery == 'undefined' || jqueryLessThan('1.8.0') ) {
    function getScript(url, success) {    
        var script = document.createElement('script');
        script.src = url;
        
        var head = document.getElementsByTagName('head')[0],
            done = false;
        
        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                done = true;                
                // callback function provided as param
                success();                
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);                
            };        
        };        
        head.appendChild(script);    
    };
    
    getScript('http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function() {    
            // jQuery loaded! Make sure to use .noConflict just in case
            PS2CharWidget.initBookmarklet(); 
    });
    
} else { // jQuery was already loaded
    PS2CharWidget.initBookmarklet();
}

function jqueryLessThan(version){
    if(typeof jQuery == 'undefined') return true;

    var installedVersion = jQuery.fn.jquery.split('.');
    var minVersion = version.split('.');

    for(var i = 0, len = minVersion.length; i < len ; i++){
        if(parseInt(installedVersion[i]) < parseInt(minVersion[i])){
            return true;
        }
    }

    return false;
}

/**options
    -content [string]
    -class [string]
    -id [string]
    -asText [boolean]
*/
function divWrapper(options){
    var divcontent = options.content || null;
    var divclass = options.class || null;
    var divid = options.id || null;

    var newdiv = document.createElement('div');
    if(divid) newdiv.id = divid;
    if(divclass) newdiv.class = divclass;
    if(divcontent) newdiv.innerHTML = divcontent;

    if(options.asText){
        var tmp = document.createElement('div');
        tmp.appendChild(newdiv);
        return tmp.innerHTML;
    } else {
        return newdiv
    }
}

