package org.brunolemos.devhub;

import android.app.Application;
import android.util.Log;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import im.shimo.react.prompt.RNPromptPackage;
import com.walmartreact.ReactOrientationListener.ReactOrientationListener;
import io.fullstack.oauth.OAuthManagerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.smixx.fabric.FabricPackage;
import com.bugsnag.BugsnagReactNative;
import com.smixx.fabric.FabricPackage;
import com.bugsnag.BugsnagReactNative;
import com.oblador.vectoricons.VectorIconsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import io.fabric.sdk.android.Fabric;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPromptPackage(),
            new ReactOrientationListener(),
            new OAuthManagerPackage(),
            new LinearGradientPackage(),
            new FabricPackage(),
            BugsnagReactNative.getPackage(),
            new VectorIconsPackage(),
            new LinearGradientPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
