function Tarocco(_document)
{
    var doc = _document || document;
    function FollowCursor(element_) {
        var has_moved = false;
        
        function update(e)
        {
            let rect = doc.body.getBoundingClientRect();
            element_.style.display = 'block';
            element_.style.left = (e.clientX - rect.left) + 'px';
            element_.style.top = (e.clientY - rect.top) + 'px';
            element_.style.transform = `scale(${1.0 / window.devicePixelRatio})`;
            element_.style.transformOrigin = '0% 0%';
        }
        
        function hide()
        {
            element_.style.display = 'none';
        }
        
        function enter(e)
        {
            if(has_moved)
                update(e);
            else
                hide();
        }
        
        function leave(e)
        {
            element_.style.display = 'none';
        }
        
        function move(e)
        {
            has_moved = true;
            update(e);
        }
        
        doc.body.addEventListener('mouseenter', enter);
        doc.body.addEventListener('mouseleave', leave);
        doc.body.addEventListener('mousemove', move);
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