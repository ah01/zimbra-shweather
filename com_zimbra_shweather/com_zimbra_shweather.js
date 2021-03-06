
function com_zimbra_shweather_HandlerObject() {}

com_zimbra_shweather_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_shweather_HandlerObject.prototype.constructor = com_zimbra_shweather_HandlerObject;

(function (ShWeather) {
    
    var container,
        prefix = "SH Weather",
        update = 150; // [sec]
    
    ShWeather.prototype.init = function ()
    {
        if (insertContainer()) {
            this.loadValues();
        }
    }; 
    
    function insertContainer () {
    
        var tabBar = document.getElementById("skin_spacing_app_chooser"),
            shell = document.getElementById("z_shell");
        
        if (!tabBar || !shell) return false;
        
        var tabBarTop = findPos(tabBar)[1];
        var tabBarHeight = tabBar.offsetHeight;
        
        container = shell.appendChild(document.createElement('div'));
        
        container.innerHTML = "&nbsp;&hellip;";
        
        container.style.position = "absolute";
        container.style.display = "block";
        container.style.right = "10px";
        container.style.top = (tabBarTop + (tabBarHeight - container.offsetHeight) / 2 - 1) + "px";
        container.style.zIndex = "9000";
        
        // find help link and copy color
        var pattern = getStylePatternElement();
        if (pattern){
            container.style.color = getStyle(pattern, "color");
        } 
        
        // kick off logo in right corner
        var row = document.getElementById("skin_spacing_app_row");
        if (row) {
            var text = getStyle(row, "backgroundImage");
            if (text) {
                if (text.toLowerCase().indexOf("vmwarelogo") >= 0){
                    row.style.backgroundImage = "none";                    
                }
            }
        }
        
        return true;
    }
    
    function getStylePatternElement() {
        var helpBtnTable = document.getElementById("skin_container_help");
        if (helpBtnTable){
            var a = helpBtnTable.getElementsByTagName("a");
            if(a && a.length >= 1)
            {
                return a[0];
            }
        }
        return null; 
    }
    
    ShWeather.prototype.loadValues = function () {
        var url = "http://weather.sh.cvut.cz/export/support.php",
            proxyUrl = ZmZimletBase.PROXY + AjxStringUtil.urlComponentEncode(url);

        AjxRpc.invoke(null, proxyUrl, null, new AjxCallback(this, this._callback));
    };
    
    ShWeather.prototype._callback = function(response) {
    
        if (response.success == false) {
            appCtxt.getAppController().setStatusMsg("Cannot obtain weather information from weather.sh.cvut.cz.", ZmStatusView.LEVEL_WARNING);
            container.innerHTML = "";
            return;
        }

        var data = response.text.split(";");
        if (data.length > 3) {
            var t = data[0],
                h = data[3];
                
            container.innerHTML = prefix + ":&nbsp;<b>" + t + "&deg;C</b>&nbsp;/&nbsp;<b>" + h +"%</b>"; 
            
            var that = this;
            setTimeout(function () {that.loadValues();}, update * 1000);
        }  
    };
    
    
    function findPos(obj) {
        var curleft = curtop = 0;
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        return [curleft,curtop];
    }
    
    function getStyle(el, prop) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            return document.defaultView.getComputedStyle(el, null)[prop];
        } else if (el.currentStyle) {
            return el.currentStyle[prop];
        } else {
            return el.style[prop];
        }
    }

})(com_zimbra_shweather_HandlerObject);

