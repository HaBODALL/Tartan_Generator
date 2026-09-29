cat << 'DIFF' > patch.diff
--- Random_Tartan_Generator.js
+++ Random_Tartan_Generator.js
@@ -643,6 +643,7 @@
     updateUserPaletteUI();
     updateGeneratedListUI();
     redrawTartan();
+    saveState();
 }

 function removeFromPalette(index) {
@@ -665,6 +666,7 @@

     updateGeneratedListUI();
     redrawTartan();
+    saveState();
 }

 function regenerateColorsOnly() {
@@ -689,6 +691,7 @@

     updateGeneratedListUI();
     redrawTartan();
+    saveState();
 }
 // === DISPLAY ACTUAL VALUES ===

@@ -828,6 +831,7 @@
     redrawTartan();
     updateUndoButton();
     updateActualValues();
+    saveState();
 }

 function updateUndoButton() {
@@ -1132,6 +1136,7 @@

         if(typeof redrawTartan === 'function') redrawTartan();
         if(typeof updateGeneratedListUI === 'function') updateGeneratedListUI();
+        saveState();

     }, 50);
 }
@@ -1505,10 +1510,11 @@
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
DIFF
patch -p0 < patch.diff
