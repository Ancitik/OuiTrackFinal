cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "pluginId": "cordova-plugin-inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "id": "cordova-plugin-network-information.network",
        "file": "plugins/cordova-plugin-network-information/www/network.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "id": "cordova-plugin-network-information.Connection",
        "file": "plugins/cordova-plugin-network-information/www/Connection.js",
        "pluginId": "cordova-plugin-network-information",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "id": "cordova-plugin-spinner.SpinnerPlugin",
        "file": "plugins/cordova-plugin-spinner/www/spinner-plugin.js",
        "pluginId": "cordova-plugin-spinner",
        "clobbers": [
            "SpinnerPlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-inappbrowser": "1.7.0",
    "cordova-plugin-network-information": "1.3.2",
    "cordova-plugin-spinner": "1.1.0",
    "cordova-plugin-whitelist": "1.3.1"
};
// BOTTOM OF METADATA
});