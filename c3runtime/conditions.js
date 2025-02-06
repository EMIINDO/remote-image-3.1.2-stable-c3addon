"use strict";
{
    self.globalThis.C3.Plugins.Sparsha_External_Image.Cnds = {
        OnLoaded()
        {
            return true;
        },

        OnError()
        {
            return true;
        },

        OnSaved()
        {
            return true;
        },

        OnLoadedStorage()
        {
            if (typeof globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + this._objectClass._name] !== "undefined")
            {
                if (globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + this._objectClass._name] === "success")
                {
                    globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + this._objectClass._name] = null;
                    return true;
                }
            }
        },

        OnErrStorage()
        {
            if (typeof globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + this._objectClass._name] !== "undefined")
            {
                if (globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + this._objectClass._name] === "fail")
                {
                    globalThis.Sparsha_REMLocalStorage["Sparsha-Trig-" + this._objectClass._name] = null;
                    return true;
                }
            }
        }
    };
}