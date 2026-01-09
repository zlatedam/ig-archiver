// ==UserScript==
// @name         Instagram Story Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add download button for Instagram stories
// @match        https://www.instagram.com/stories/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Instagram Story Downloader: Script loaded');
    
    function addStoryDownloadButton() {
        // Check if button already exists
        if (document.querySelector('#story-download-btn')) return;
        
        // Find story media (video or image)
        const video = document.querySelector('video[class*="x1lliihq"]');
        const image = document.querySelector('img[class*="x5yr21d"]');
        
        const mediaElement = video || image;
        if (!mediaElement) {
            console.log('No story media found yet');
            return;
        }
        
        const mediaUrl = video ? video.src : image.src;
        console.log('Found story media:', mediaUrl);
        
        // Create download button
        const btn = document.createElement('button');
        btn.id = 'story-download-btn';
        btn.innerHTML = '⬇️ Download Story';
        btn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            padding: 12px 20px;
            background: #0095f6;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        `;
        
        btn.onclick = async (e) => {
            e.stopPropagation();
            
            const a = document.createElement('a');
            a.href = mediaUrl;
            a.download = 'instagram_story_' + Date.now() + (video ? '.mp4' : '.jpg');
            a.click();
            
            console.log('Downloaded story:', mediaUrl);
            
            // Flash button to show it worked
            btn.innerHTML = '✓ Downloaded!';
            btn.style.background = '#00c853';
            setTimeout(() => {
                btn.innerHTML = '⬇️ Download Story';
                btn.style.background = '#0095f6';
            }, 1500);
        };
        
        document.body.appendChild(btn);
        console.log('Story download button added');
    }
    
    // Remove button when story closes
    function removeButton() {
        const btn = document.querySelector('#story-download-btn');
        if (btn) btn.remove();
    }
    
    // Run when stories load
    setTimeout(addStoryDownloadButton, 1500);
    
    // Watch for story changes
    const observer = new MutationObserver(() => {
        if (window.location.pathname.includes('/stories/')) {
            addStoryDownloadButton();
        } else {
            removeButton();
        }
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Cleanup on navigation away
    window.addEventListener('popstate', removeButton);
    
})();
