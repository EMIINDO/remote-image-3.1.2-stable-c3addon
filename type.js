"use strict";
{
    const SDK = globalThis.SDK;

    const PLUGIN_CLASS = SDK.Plugins.Sparsha_External_Image;

    PLUGIN_CLASS.Type = class External_ImageType extends SDK.ITypeBase
    {
        constructor(sdkPlugin, iObjectType)
        {
            super(sdkPlugin, iObjectType);
        }
    };
}