cat << 'DIFF' > patch.diff
--- Random_Tartan_Generator.js
+++ Random_Tartan_Generator.js
@@ -1645,11 +1645,15 @@
             isCheckModePattern = false;
         }

-        let variants = SRT_PALETTE.filter(c => c.code === code);
-        let colorObj;
-        if (variants.length > 0) {
-             colorObj = variants[Math.floor(Math.random() * variants.length)];
+        let colorObj;
+        if (newPaletteMap.has(code)) {
+            colorObj = newPaletteMap.get(code);
         } else {
-            colorObj = srtLookup.get(code); // Fallback to map if something goes wrong
+            let variants = SRT_PALETTE.filter(c => c.code === code);
+            if (variants.length > 0) {
+                 colorObj = variants[Math.floor(Math.random() * variants.length)];
+            } else {
+                colorObj = srtLookup.get(code); // Fallback to map if something goes wrong
+            }
         }

         if (!colorObj) {
DIFF
patch -p0 < patch.diff
