// Add to the script above, replacing the button code:

img.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    // Create custom context menu
    const menu = document.createElement('div');
    menu.innerHTML = `
        <div style="position:fixed;background:white;border:1px solid #ccc;padding:10px;z-index:10000;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
            <div style="cursor:pointer;padding:5px;" id="dl-full">Download Full Resolution</div>
        </div>
    `;
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
    
    document.body.appendChild(menu);
    
    document.getElementById('dl-full').onclick = () => {
        const a = document.createElement('a');
        a.href = highestRes;
        a.download = 'instagram_' + Date.now() + '.jpg';
        a.click();
        menu.remove();
    };
    
    setTimeout(() => menu.remove(), 5000);
});
