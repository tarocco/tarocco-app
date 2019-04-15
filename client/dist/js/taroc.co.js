function Tarocco(_document)
{
    var doc = _document || document;
    function FollowCursor(element_) {
        var zoom = null;
        var has_moved = false;
        function apply_zoom(z)
        {
            element_.style.transform = `scale(${1.0 / zoom})`;
            element_.style.transformOrigin = '0% 0%';
        }
        
        function handle_zoom(e)
        {
            zoom = e.detail.level;
            apply_zoom(zoom);
        }
        
        function enter(e)
        {
            if(has_moved && zoom != null)
                element_.style.display = 'block';
            else
                element_.style.display = 'none';
        }
        
        function leave(e)
        {
            element_.style.display = 'none';
        }
        
        function move(e)
        {
            has_moved = true;
            if(zoom != null)
            {
                element_.style.display = 'block';
                element_.style.left = e.clientX + 'px';
                element_.style.top = e.clientY + 'px';
                apply_zoom(zoom);
            }
        }
        
        window.addEventListener('zoom-change', handle_zoom);
        doc.body.addEventListener('mouseenter', enter);
        doc.body.addEventListener('mouseleave', leave);
        doc.body.addEventListener('mousemove', move);
    }
    
    function StartBackgroundTask(func)
    {
        return new Worker(URL.createObjectURL(new Blob(['(' + func + ')()'])));
    }
    
    function eml1()
    {
        var style = doc.createElement('style');
        doc.body.appendChild(style);
        style.sheet.insertRule('.eml-1 { display: block; text-indent: -99999px; line-height: 0; }', 0);
        style.sheet.insertRule('.eml-1::after { display: block; text-indent: 0; line-height: initial; content: "decrypting email address..."; }', 0);
        let task = new Worker('js/eml-1.js');
        task.onmessage = (e) => {
            let pt = e.data;
            emls = doc.querySelectorAll('.eml-1');
            for(let e of emls)
            {    
                e.innerHTML = pt;
                e.setAttribute('href', `mailto:${pt}`)
            }
            doc.body.removeChild(style);
        };
    }
    
    return {
        eml1: eml1,
        FollowCursor: FollowCursor
    };
}