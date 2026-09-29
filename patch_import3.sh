cat << 'DIFF' > patch.diff
--- Random_Tartan_Generator.js
+++ Random_Tartan_Generator.js
@@ -1555,6 +1555,23 @@
     document.head.appendChild(style);
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
@@ -1598,6 +1615,8 @@
         }
     }

+    let domCheckMode = domElements.checkMode;
+
     // Regex for Code/Number (accepts optional slash)
     let regex = /([A-Z]+)\/?(\d+)/g;

@@ -1611,12 +1630,23 @@
         if (!srtLookup.has(c.code)) srtLookup.set(c.code, c);
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
+        let variants = SRT_PALETTE.filter(c => c.code === code);
+        let colorObj;
+        if (variants.length > 0) {
+             colorObj = variants[Math.floor(Math.random() * variants.length)];
+        } else {
+            colorObj = srtLookup.get(code); // Fallback to map if something goes wrong
+        }

         if (!colorObj) {
@@ -1636,6 +1666,16 @@
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
@@ -1647,6 +1687,8 @@
     updateUserPaletteUI();
     redrawTartan();
     updateGeneratedListUI();
+    matchSrtWithExamples();
+    saveState();

 }
DIFF
patch -p0 < patch.diff
