// ==UserScript==
// @name         Instagram Image Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add download button for Instagram posts
// @match        https://www.instagram.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Instagram Downloader: Script loaded');
    
    function addDownloadButton() {
        // Find all images that don't have a download button yet
        const images = document.querySelectorAll('img[src*="instagram"]');
        
        images.forEach(img => {
            if (img.dataset.hasDownload) return;
            img.dataset.hasDownload = 'true';
            
            console.log('Found image:', img.src);
            
            // Create download button
            const btn = document.createElement('button');
            btn.innerHTML = '⬇️ Download';
            btn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 9999;
                padding: 10px 15px;
                background: #0095f6;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;
            
            btn.onclick = (e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = img.src;
                a.download = 'instagram_' + Date.now() + '.jpg';
                a.click();
                console.log('Downloaded:', img.src);
            };
            
            // Position relative to parent
            const parent = img.parentElement;
            if (parent) {
                parent.style.position = 'relative';
                parent.appendChild(btn);
            }
        });
    }
    
    // Run initially
    setTimeout(addDownloadButton, 2000);
    
    // Watch for new content
    const observer = new MutationObserver(() => {
        addDownloadButton();
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
})();
