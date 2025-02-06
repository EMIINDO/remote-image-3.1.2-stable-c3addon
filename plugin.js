"use strict";
{
    const SDK = globalThis.SDK;

    const PLUGIN_ID = "Sparsha_External_Image";
    // const PLUGIN_VERSION = "3.1.2";
    const PLUGIN_CATEGORY = "general";

    const PLUGIN_CLASS = SDK.Plugins.Sparsha_External_Image = class External_ImagePlugin extends SDK.IPluginBase
    {
        constructor()
        {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

            this._info.SetName(globalThis.lang(".name"));
            this._info.SetDescription(globalThis.lang(".description"));
            // this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory(PLUGIN_CATEGORY);
            this._info.SetAuthor("Sparsha");
            this._info.SetHelpUrl(globalThis.lang(".help-url"));
            this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
            this._info.SetPluginType("world"); // mark as world plugin, which can draw
            this._info.SetIsResizable(true); // allow to be resized
            this._info.SetIsRotatable(true); // allow to be rotated
            this._info.SetHasImage(true);
            this._info.SetSupportsEffects(true); // allow effects
            this._info.SetMustPreDraw(false);
            this._info.SetCanBeBundled(true);
            this._info.AddCommonPositionACEs();
            this._info.AddCommonSceneGraphACEs();
            this._info.AddCommonAngleACEs();
            this._info.AddCommonAppearanceACEs();
            this._info.AddCommonZOrderACEs();
            this._info.AddCommonSizeACEs();

            this._info.SetSupportedRuntimes(["c3"]);

            SDK.Lang.PushContext(".properties");

            this._info.SetProperties([
                new SDK.PluginProperty("check", "auto-destroy", false),
                new SDK.PluginProperty("combo", "origin",
            {
                "items": ["0Item", "1Item", "2Item", "3Item", "4Item", "5Item", "6Item", "7Item", "8Item"],
                "initialValue": "4Item",
                "interpolatable": false
            }),
                new SDK.PluginProperty("link", "edit-image",
            {
                linkCallback: function(sdkType)
                {
                    sdkType.GetObjectType().EditImage();
                },
                callbackType: "once-for-type"
            }),
                new SDK.PluginProperty("link", "make-original-size",
            {
                linkCallback: function(sdkInst)
                {
                    sdkInst.OnMakeOriginalSize();
                },
                callbackType: "for-each-instance"
            })
            ]);

            this._info.SetDOMSideScripts(["c3runtime/domside.js"]);
            this._info.AddFileDependency(
            {
                filename: "c3runtime/version.js",
                type: "external-dom-script"
            });

            SDK.Lang.PopContext(); //.properties
            SDK.Lang.PopContext();
        }
    };

    PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}