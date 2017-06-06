rm takeitover.apk
rm takeitover_singed.apk
cd android && ./gradlew assembleRelease
cd ../
mv ./android/app/build/outputs/apk/app-release.apk ./
mv app-release.apk takeitover.apk
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore takeitover.keystore -storepass takeitover takeitover.apk takeitover
zipalign -v 4 takeitover.apk  takeitover_singed.apk
adb install -r takeitover_singed.apk
adb shell am start -n com.banner.takeitover/.MainActivity