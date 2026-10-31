package com.tubs.digitalustaad;

import android.content.Intent;
import android.content.pm.PackageManager;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "WhatsAppLauncher")
public class WhatsAppLauncherPlugin extends Plugin {
    private static final String WHATSAPP = "com.whatsapp";
    private static final String WHATSAPP_BUSINESS = "com.whatsapp.w4b";

    @PluginMethod
    public void isNative(PluginCall call) {
        JSObject result = new JSObject();
        result.put("native", true);
        result.put("platform", "android");
        call.resolve(result);
    }

    @PluginMethod
    public void checkApps(PluginCall call) {
        PackageManager packageManager = getContext().getPackageManager();
        JSObject result = new JSObject();
        result.put("whatsapp", isInstalled(packageManager, WHATSAPP));
        result.put("whatsappBusiness", isInstalled(packageManager, WHATSAPP_BUSINESS));
        call.resolve(result);
    }

    @PluginMethod
    public void openWhatsApp(PluginCall call) {
        boolean preferBusiness = Boolean.TRUE.equals(call.getBoolean("preferBusiness", false));
        PackageManager packageManager = getContext().getPackageManager();

        String[] packageOrder = preferBusiness
            ? new String[] { WHATSAPP_BUSINESS, WHATSAPP }
            : new String[] { WHATSAPP, WHATSAPP_BUSINESS };

        for (String packageName : packageOrder) {
            if (!isInstalled(packageManager, packageName)) {
                continue;
            }

            Intent launchIntent = packageManager.getLaunchIntentForPackage(packageName);
            if (launchIntent == null) {
                continue;
            }

            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(launchIntent);

            JSObject result = new JSObject();
            result.put("opened", true);
            result.put("app", packageName);
            call.resolve(result);
            return;
        }

        JSObject result = new JSObject();
        result.put("opened", false);
        result.put("app", "");
        result.put(
            "reason",
            "WhatsApp is not installed. Install WhatsApp or WhatsApp Business, then try again."
        );
        call.resolve(result);
    }

    private boolean isInstalled(PackageManager packageManager, String packageName) {
        try {
            packageManager.getPackageInfo(packageName, 0);
            return true;
        } catch (PackageManager.NameNotFoundException error) {
            return false;
        }
    }
}
