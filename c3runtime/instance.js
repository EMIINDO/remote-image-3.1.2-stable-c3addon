"use strict";
{
    // Porting BY EMI INDO with c3addon-ide-plus
    const tempQuad = C3.New(C3.Quad);
    globalThis.C3.Plugins.Sparsha_External_Image.Instance = class External_ImageInstance extends C3.SDKWorldInstanceBase
    {
        constructor()
        {
            super();

            const properties = this._getInitProperties();

            //this._testProperty = 0;

            if (properties)
            {
                this.clearAll = properties[0];
            }
            this.PluginCnds = globalThis.C3.Plugins.Sparsha_External_Image.Cnds;

            this.isLoaded = false;
            this.isNew = false;

            this.texture = null;
            //this.myImageBitmap = null;
            //this.myIID = null;
            this.myID = null;
            this.myObjName = null;
            this.myW = 0;
            this.myH = 0;
            this.myBlob = null;


            if (globalThis.Sparsha_RemoteImageBitmap == undefined) globalThis.Sparsha_RemoteImageBitmap = {};
            if (globalThis.Sparsha_RemoteImageBitmap[this._objectClass._name] == undefined) globalThis.Sparsha_RemoteImageBitmap[this._objectClass._name] = {}

            if (globalThis.Sparsha_RemoteImageEventHandler == undefined)
            {
                globalThis.Sparsha_RemoteImageEventHandler = true;
                this.AddDOMMessageHandler("on_complete", _OnDOM);
            }
            if (globalThis.Sparsha_REMLocalStorage == undefined) globalThis.Sparsha_REMLocalStorage = {};


            function _OnDOM(e)
            {
                if (e["action"] === "getlocal" && e["err"] === false)
                {
                    fetch(e["blob_text"]).then(res => res.blob()).then(data => funcBlob(data));

                    function funcBlob(BlobNow)
                    {
                        createImageBitmap(BlobNow).then(response => {
                            globalThis.Sparsha_REMLocalStorage[e["myObj"]] = {
                                "response": response,
                                "img_id": e["img_id"],
                            };
                            globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + e["myObj"]] = "success";
                        })
                    }
                }
                else if (e["action"] === "getlocal" && e["err"])
                {
                    globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + e["myObj"]] = "fail";
                }
            }
        }

        _MakeURLRequest(url, id, save)
        {
            var self = this;
            return new Promise(function(resolve, reject)
            {
                var oReq = new XMLHttpRequest();
                oReq.open("GET", url);
                oReq.responseType = "blob";
                oReq.onload = function()
                {
                    if (this.status >= 200 && this.status < 300)
                    {
                        createImageBitmap(oReq.response).then(response => {
                            self.myID = id;
                            self.myObjName = self._objectClass._name;
                            globalThis.Sparsha_RemoteImageBitmap[self.myObjName][self.myID] = response;
                            self.myW = response.width;
                            self.myH = response.height;
                            self.isLoaded = true;
                            self.isNew = true;
                            self._runtime.UpdateRender();

                            if (save)
                            {
                                var reader = new FileReader();
                                reader.readAsDataURL(oReq.response);
                                reader.onloadend = function()
                                {
                                    //self.mybase64 = reader.result;
                                    var options_DOM = {
                                        "action": "setlocal",
                                        "blob_text": reader.result,
                                        "blob_key": "ExtImg-" + self.myObjName + self.myID,
                                    };
                                    self.PostToDOM("doAction", options_DOM);
                                    self._trigger(self.PluginCnds.OnSaved);
                                }
                            }
                            //self._trigger(self.PluginCnds.OnLoaded);
                            resolve(1);
                        })
                    }
                    else
                    {
                        reject(0);
                    }
                };
                oReq.onerror = function()
                {
                    reject(0);
                };
                oReq.send();
            });
        }


        _release()
        {
            if (this.clearAll && this._runtime.GetObjectCount() === 0) delete globalThis.Sparsha_RemoteImageBitmap[this._objectClass._name];

            console.log(this.texture)
            if (this.texture)
            {
                var renderer = this._runtime.GetWebGLRenderer();
                renderer.DeleteTexture(this.texture);
                this.texture = null;
            }
            super._release();
        }

        Draw(renderer)
        {
            var self = this;

            var texture = null
            var rcTex = null
            var imageInfo = null
            var myImageBitmapNow = undefined;
            if (this.isLoaded && this.myObjName !== null && globalThis.Sparsha_RemoteImageBitmap[this.myObjName] !== undefined)
            {
                myImageBitmapNow = globalThis.Sparsha_RemoteImageBitmap[this.myObjName][this.myID];
                if (myImageBitmapNow != undefined)
                {
                    this.myW = myImageBitmapNow.width;
                    this.myH = myImageBitmapNow.height;
                }
            }


            function setOriginImage()
            {
                if (self.texture)
                {
                    renderer.DeleteTexture(self.texture);
                    self.texture = null;
                }
                imageInfo = self._objectClass.GetImageInfo();
                self.myW = imageInfo._width;
                self.myH = imageInfo._height;
                texture = imageInfo.GetTexture();
                rcTex = imageInfo.GetTexRect();
            }

            function setMyImage()
            {
                renderer.UpdateTexture(myImageBitmapNow, self.texture,
                {});
                texture = self.texture;
                rcTex = new C3.Rect(0, 0, 1, 1)
            }

            if (this.isLoaded && this.isNew)
            {
                if (myImageBitmapNow === undefined) setOriginImage()
                else
                {
                    this.isNew = false;
                    if (this.texture)
                    {
                        renderer.DeleteTexture(this.texture);
                    }
                    this.texture = renderer.CreateDynamicTexture(this.myW, this.myH,
                    {
                        mipMap: false
                    });

                    setMyImage();
                }
                //this._trigger(this.PluginCnds.OnLoaded);
            }
            else if (this.isLoaded)
            {
                if (myImageBitmapNow === undefined) setOriginImage()
                else setMyImage();
            }
            else
            {
                setOriginImage();
            }

            if (!texture) return; // dynamic texture load which hasn't completed yet; can't draw anything

            const wi = this.GetWorldInfo();
            const quad = wi.GetBoundingQuad();

            renderer.SetTexture(texture);

            if (this._runtime.IsPixelRoundingEnabled())
            {
                const ox = Math.round(wi.GetX()) - wi.GetX();
                const oy = Math.round(wi.GetY()) - wi.GetY();
                tempQuad.copy(quad);
                tempQuad.offset(ox, oy);
                renderer.Quad3(tempQuad, rcTex);
            }
            else
            {
                renderer.Quad3(quad, rcTex);
            }

        }

        _saveToJson()
        {
            return {
                // data to be saved for savegames
            };
        }

        _loadFromJson(o)
        {
            // load state for savegames
        }

        /* 
GetDebuggerProperties() {
    return [

            {
                title: "External_Image",
                properties: [
                    //{name: ".current-animation",	value: this._currentAnimation.GetName(),	onedit: v => this.CallAction(Acts.SetAnim, v, 0) },
                ]
            }
    ];
} */

        // timeline support
        /* 
GetPropertyValueByIndex(index) {
            return 0;
        }
*/

        /* 
SetPropertyValueByIndex(index, value) {
            //set property value here
        }
*/
    };
}