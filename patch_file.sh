cat << 'DIFF' > patch.diff
--- Random_Tartan_Generator.js
+++ Random_Tartan_Generator.js
@@ -1071,6 +1071,7 @@

         if(typeof redrawTartan === 'function') redrawTartan();
         if(typeof updateGeneratedListUI === 'function') updateGeneratedListUI();
+        saveState();

     }, 50);
 }
@@ -582,6 +583,7 @@
     updateUserPaletteUI();
     updateGeneratedListUI();
     redrawTartan();
+    saveState();
 }

 function removeFromPalette(index) {
@@ -604,6 +606,7 @@

     updateGeneratedListUI();
     redrawTartan();
+    saveState();
 }

 function regenerateColorsOnly() {
@@ -628,12 +631,14 @@

     updateGeneratedListUI();
     redrawTartan();
+    saveState();
 }
 // === DISPLAY ACTUAL VALUES ===

 function updateActualValues() {
@@ -1444,10 +1449,11 @@
     if (!aboutModalElement) aboutModalElement = document.getElementById('about-modal');
     if (aboutModalElement) aboutModalElement.style.display = 'none';
 }
-window.updateZoom = function() { redrawTartan(); }
+window.updateZoom = function() { redrawTartan(); saveState(); }
 window.updateSymmetry = function() {
     // We might need to update SRT text if symmetry changes display
     redrawTartan();
+    saveState();
 }

 // ==========================================
@@ -767,6 +773,7 @@
     redrawTartan();
     updateUndoButton();
     updateActualValues();
+    saveState();
 }

 function updateUndoButton() {
DIFF
patch -p0 < patch.diff
