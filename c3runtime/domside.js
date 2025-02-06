"use strict";
{
    //const DOM_COMPONENT_ID = "sparsha-externalimage";
    function StopPropagation(e) {
        e.stopPropagation();
    }
    const HANDLER_CLASS = class External_ImageDOMHandler extends self.DOMHandler {
        constructor(iRuntime) {
            super(iRuntime);
            var self = this;
            
            function DoActionFunc(e){
            	if(e.action==="setlocal"){
            		/*var myob={
            			"blob_text": e.blob_text,
            			"blob_type": e.blob_type,
            		}
            		localStorage.setItem(e.blob_key, JSON.stringify(myob));*/
            		localStorage.setItem(e.blob_key, e.blob_text);
            	}
            	else if(e.action==="getlocal"){
            		/*var myResult=JSON.parse(localStorage.getItem(e.blob_key));
            		myResult["action"]="getlocal";*/
            		var LocImg= localStorage.getItem("ExtImg-" + e.obj_name + e.img_id)
            		if (LocImg !== null) {
            			var myResult={
            				"blob_text":LocImg,
            				"obj_name": e.obj_name,
        					"img_id": e.img_id,
        					"myObj": e.myObj,
            				"action":"getlocal",
            				"err": false,
            			}
					}
					else{
						var myResult={
            				"action":"getlocal",
            				"myObj": e.myObj,
            				"err": true,
            			}
					}
            		
            		self.PostToRuntime("on_complete", myResult)
            	}
            	else if(e.action==="deletelocal"){
            		localStorage.removeItem(e.blob_key);
            	}
            };
            this.AddRuntimeMessageHandler("doAction", DoActionFunc);
            //this.AddRuntimeMessageHandler("removeCaptcha", RemoveCaptcha);
        }
    };
    self.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}