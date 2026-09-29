cat << 'DIFF' > patch.diff
--- Random_Tartan_Generator.js
+++ Random_Tartan_Generator.js
@@ -1510,6 +1510,21 @@
     }
 }

+// Function to match SRT code with examples in the select dropdown
+function matchSrtWithExamples() {
+    let srtInput = domElements.srtDisplay;
+    let srtExamples = document.getElementById('srt-examples');
+    if (!srtInput || !srtExamples) return;
+    let currentCode = srtInput.value.trim().toUpperCase();
+    let found = false;
+    for (let i = 0; i < srtExamples.options.length; i++) {
+        if (srtExamples.options[i].value === currentCode) {
+            srtExamples.selectedIndex = i;
+            found = true;
+            break;
+        }
+    }
+    if (!found) srtExamples.selectedIndex = 0;
+}
+
 // --- LOAD SRT EXAMPLE ---
 let importInputElement = null;
 window.loadExample = function(val) {
@@ -1557,7 +1572,16 @@
         }
     }

+    let domCheckMode = domElements.checkMode;
+
     // Regex for Code/Number (accepts optional slash)
     let regex = /([A-Z]+)\/?(\d+)/g;

     let match;
     let newStripes = [];
     let newPaletteMap = new Map();
@@ -1571,11 +1595,20 @@
     }

+    let isCheckModePattern = true;
+    let firstCount = -1;
+
     while ((match = regex.exec(text)) !== null) {
         let code = match[1];
         let count = parseInt(match[2]);

-        // ⚡ Bolt Optimization: Replace O(N) Array.find with O(1) Map.get
-        let colorObj = srtLookup.get(code);
+        if (firstCount === -1) {
+            firstCount = count;
+        } else if (count !== firstCount) {
+            isCheckModePattern = false;
+        }
+
+        // Allow randomized shade for the color category
+        // Filter variants for this code
+        let variants = SRT_PALETTE.filter(c => c.code === code);
+        let colorObj;
+        if (variants.length > 0) {
+             colorObj = variants[Math.floor(Math.random() * variants.length)];
+        } else {
+            colorObj = srtLookup.get(code); // Fallback to map if something goes wrong
+        }

         if (!colorObj) {
             console.warn(`Unknown color code ignored: ${code}`);
@@ -1597,6 +1630,27 @@
         return;
     }

+    // Update UI constraints
+    if (domElements.targetStripes) domElements.targetStripes.value = newStripes.length;
+
+    let minW = Math.min(...newStripes.map(s => s.count));
+    let maxW = Math.max(...newStripes.map(s => s.count));
+    if (domElements.minWidth) domElements.minWidth.value = minW;
+    if (domElements.maxWidth) domElements.maxWidth.value = maxW;
+
+    if (domCheckMode) {
+        domCheckMode.checked = isCheckModePattern;
+    }
+
     // Save history before modification
     if (typeof pushToHistory === 'function') {
         pushToHistory();
@@ -1607,6 +1661,10 @@
     updateUserPaletteUI();
     redrawTartan();
     updateGeneratedListUI();
+    matchSrtWithExamples();
+    saveState();

 }
DIFF
patch -p0 < patch.diff
