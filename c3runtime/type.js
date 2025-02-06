"use strict";
{
    // callMap path/c3runtime/type.js

    const C3 = globalThis.C3;
    C3.Plugins.Sparsha_External_Image.Type = class External_ImageType extends globalThis.ISDKObjectTypeBase
    {
        constructor()
        {
            super();
        }
        _onCreate() {
            this.GetImageInfo().LoadAsset(this._runtime);
        }

        LoadTextures(renderer)
        {
            return this.GetImageInfo().LoadStaticTexture(renderer,
            {
                linearSampling: this._runtime.IsLinearSampling()
            });
        }

        ReleaseTextures()
        {
            this.GetImageInfo().ReleaseTexture();
        }
    };
}