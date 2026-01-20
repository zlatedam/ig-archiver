// ==UserScript==
// @name         Instagram Post Image Downloader
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add download button for Instagram post images only (excludes profile pics and stories)
// @match        https://www.instagram.com/*
// @exclude      https://www.instagram.com/stories/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('Instagram Post Downloader: Script loaded');
    
    function isPostImage(img) {
        // Exclude story content
        if (window.location.pathname.includes('/stories/')) {
            return false;
        }
        
        // Exclude very small images (profile pics, icons)
        if (img.width < 200 || img.height < 200) {
            return false;
        }
        
        // Exclude profile picture URLs
        const src = img.src || '';
        if (src.includes('/p150x150/') || 
            src.includes('/p75x75/') || 
            src.includes('/s150x150/') ||
            src.includes('/s320x320/') ||
            src.includes('/s640x640/')) {
            return false;
        }
        
        // Check if image is inside a post article element
        const article = img.closest('article');
        if (!article) {
            return false;
        }
        
        // Make sure it's not a profile pic within the post header
        const header = img.closest('header');
        if (header) {
            return false;
        }
        
        // Check for post-specific parent containers
        const postContainer = img.closest('div[class*="_aagv"]') || 
                             img.closest('div[role="presentation"]');
        
        if (!postContainer && !article) {
            return false;
        }
        
        console.log('Valid post image found:', src);
        return true;
    }
    
    function addDownloadButton() {
        // Find all images that don't have a download button yet
        const images = document.querySelectorAll('img[src*="instagram"]');
        
        images.forEach(img => {
            // Skip if already processed
            if (img.dataset.hasDownload) return;
            
            // Check if this is a valid post image
            if (!isPostImage(img)) {
                return;
            }
            
            // Mark as processed
            img.dataset.hasDownload = 'true';
            
            console.log('Adding button to post image:', img.src);
            
            // Create download button
            const btn = document.createElement('button');
            btn.innerHTML = '⬇️';
            btn.title = 'Open in new tab';
            btn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 9999;
                padding: 8px 12px;
                background: #0095f6;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: bold;
                font-size: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                transition: background 0.2s;
            `;
            
            btn.onmouseenter = () => {
                btn.style.background = '#0081d6';
            };
            
            btn.onmouseleave = () => {
                btn.style.background = '#0095f6';
            };
            
            btn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Open in new tab
                const a = document.createElement('a');
                a.href = img.src;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.click();
                
                console.log('Opened post image in new tab:', img.src);
                
                // Visual feedback
                btn.innerHTML = '✓';
                btn.style.background = '#00c853';
                setTimeout(() => {
                    btn.innerHTML = '⬇️';
                    btn.style.background = '#0095f6';
                }, 1000);
            };
            
            // Position relative to parent
            const parent = img.parentElement;
            if (parent) {
                const originalPosition = window.getComputedStyle(parent).position;
                if (originalPosition === 'static') {
                    parent.style.position = 'relative';
                }
                parent.appendChild(btn);
            }
        });
    }
    
    // Run initially after page loads
    setTimeout(addDownloadButton, 2000);
    
    // Watch for new content (scrolling, loading more posts)
    const observer = new MutationObserver(() => {
        // Don't run on stories pages
        if (!window.location.pathname.includes('/stories/')) {
            addDownloadButton();
        }
    });
    
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Also check when scrolling (for lazy loaded images)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (!window.location.pathname.includes('/stories/')) {
                addDownloadButton();
            }
        }, 500);
    }, { passive: true });
    
})();