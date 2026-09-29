cat << 'DIFF' > patch.diff
--- Random_Tartan_Generator.js
+++ Random_Tartan_Generator.js
@@ -904,6 +904,7 @@
     }

     if(srtInput) srtInput.value = srtString;
+    if (typeof matchSrtWithExamples === 'function') matchSrtWithExamples();
 }

 // === OFFICIAL SRT CODE CONSTRUCTION ===
DIFF
patch -p0 < patch.diff
