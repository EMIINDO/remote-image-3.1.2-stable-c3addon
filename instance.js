"use strict";
{
    // callMap path/SDK/instance.js
    const SDK = globalThis.SDK;
    const PLUGIN_CLASS = SDK.Plugins.Sparsha_External_Image;

    PLUGIN_CLASS.Instance = class External_ImageInstance extends SDK.IWorldInstanceBase
    {
        constructor(sdkType, inst)
        {
            super(sdkType, inst);
        }

        Release()
        {}

        OnCreate()
        {}

        OnPlacedInLayout()
        {
            // Initialise to size of image
            this.OnMakeOriginalSize();
        }

        Draw(iRenderer, iDrawParams)
        {
            const texture = this.GetTexture();

            if (texture)
            {
                this._inst.ApplyBlendMode(iRenderer);
                iRenderer.SetTexture(texture);
                iRenderer.SetColor(this._inst.GetColor());
                iRenderer.Quad3(this._inst.GetQuad(), this.GetTexRect());
            }
            else
            {
                // render placeholder
                iRenderer.SetAlphaBlend();
                iRenderer.SetColorFillMode();

                if (this.HadTextureError()) iRenderer.SetColorRgba(0.25, 0, 0, 0.25);
                else iRenderer.SetColorRgba(0, 0, 0.1, 0.1);

                iRenderer.Quad(this._inst.GetQuad());
            }

            var orgCombo = parseInt(this._inst.GetPropertyValue("origin"));
            var orgX = [0, 0.5, 1, 0, 0.5, 1, 0, 0.5, 1];
            var orgY = [0, 0, 0, 0.5, 0.5, 0.5, 1, 1, 1];
            this._inst.SetOriginX(orgX[orgCombo]);
            this._inst.SetOriginY(orgY[orgCombo]);

        }

        GetTexture()
        {
            const image = this.GetObjectType().GetImage();
            return super.GetTexture(image);
        }

        IsOriginalSizeKnown()
        {
            return true;
        }

        GetOriginalWidth()
        {
            return this.GetObjectType().GetImage().GetWidth();
        }

        GetOriginalHeight()
        {
            return this.GetObjectType().GetImage().GetHeight();
        }

        OnMakeOriginalSize()
        {
            const image = this.GetObjectType().GetImage();
            this._inst.SetSize(image.GetWidth(), image.GetHeight());
        }

        HasDoubleTapHandler()
        {
            return true;
        }

        OnDoubleTap()
        {
            this.GetObjectType().EditImage();
        }

        OnPropertyChanged(id, value)
        {}

        LoadC2Property(name, valueString)
        {
            return false; // not handled
        }
    };
}