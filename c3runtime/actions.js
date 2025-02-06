"use strict";
{
    globalThis.C3.Plugins.Sparsha_External_Image.Acts = {
        async LoadUrl(url, id, save)
        {
            var self = this;

            var result = await self._MakeURLRequest(url, id, save);

            if (result) self._trigger(self.PluginCnds.OnLoaded);
            else self._trigger(self.PluginCnds.OnError);
        },

        LoadIID(id)
        {
            var self = this;
            self.myObjName = self._objectClass._name;
            self.myID = id;
            self.isLoaded = true;
            self.isNew = true;
            self._runtime.UpdateRender();
        },

        DestroyData(id)
        {
            delete globalThis.Sparsha_RemoteImageBitmap[this._objectClass._name][id];
        },

        DestroyAll()
        {
            delete globalThis.Sparsha_RemoteImageBitmap[this._objectClass._name];
        },

        LoadObject(obj, id)
        {
            var self = this;
            self.myObjName = obj._name;
            self.myID = id;
            self.isLoaded = true;
            self.isNew = true;
            self._runtime.UpdateRender();
        },

        LoadLocalstorage(obj, id)
        {
            var self = this;
            var options_DOM = {
                "action": "getlocal",
                "obj_name": obj._name,
                "myObj": self._objectClass._name,
                "img_id": id,
            };
            self.PostToDOM("doAction", options_DOM);
            //self._inst._runtime.UpdateRender();
            //self._trigger(self.PluginCnds.OnLoaded);
        },

        DestroyId(obj, id)
        {
            delete globalThis.Sparsha_RemoteImageBitmap[obj._name][id];
        },

        DestroyObject(obj)
        {
            delete globalThis.Sparsha_RemoteImageBitmap[obj._name];
        },

        DeleteLocalstorage(obj, id)
        {
            var self = this;
            var options_DOM = {
                "action": "deletelocal",
                "blob_key": "ExtImg-" + obj._name + id,
            };
            self.PostToDOM("doAction", options_DOM);
        },

        PasteStorage()
        {
            var self = this;
            self.myObjName = self._objectClass._name;
            var res = globalThis.Sparsha_REMLocalStorage[self.myObjName];
            self.myID = res["img_id"];
            globalThis.Sparsha_RemoteImageBitmap[self.myObjName][self.myID] = res["response"];
            self.myW = res["response"]["width"];
            self.myH = res["response"]["height"];
            self.isLoaded = true;
            self.isNew = true;
            delete globalThis.Sparsha_REMLocalStorage[self.myObjName];
            self._runtime.UpdateRender();
            self._trigger(self.PluginCnds.OnLoaded);
        },

        ReleaseMemory()
        {
            this.isLoaded = false;
            if (this.texture)
            {
                var renderer = this._runtime.GetWebGLRenderer();
                renderer.DeleteTexture(this.texture);
                this.texture = null;
            }
        }
    };
}