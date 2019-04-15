function ZoomLevel(query_tester_parent, max_depth=9){
    var doc = query_tester_parent.ownerDocument || document
    var previous_level = 0;
    var zoom_tree = null;
    var interval = null;
    
    function CreateQueryTester(style, parent, property_aliases, r, unit, sibling_index)
    {
        let mq_tester = doc.createElement('div');
        parent.appendChild(mq_tester);
        let parent_id = parent.getAttribute('id');
        let rules = [];
        for(let property of property_aliases)
        {
            let rule = `@media ( ${property}: ${r}${unit} ) { #${parent_id} :nth-child(${sibling_index + 1}) { text-decoration: underline; } }`
            style.sheet.insertRule(rule, 0);
            rules.push(rule);
        }
        return mq_tester;
    }
    
    function MediaQueryMatches(mq_tester)
    {
        return window.getComputedStyle(mq_tester, null).textDecoration.indexOf('underline') == 0;
    }
    
    function CreateQueryTree(parent, property_aliases, unit, min, max, max_depth)
    {
        let style = doc.createElement('style');
        doc.body.appendChild(style);
        let order = 0;
        let sibling_index = 0;
        function create(a, b, ply)
        {
            let mid = (a + b) / 2.0;
            let tester = CreateQueryTester(style, parent, property_aliases, mid, unit, sibling_index++);
            let e = { f: () => MediaQueryMatches(tester), mid: mid, left: null, right: null }
            if (ply > 0)
            {
                e.left = create(a, mid, ply - 1);
                e.order = order++;
                e.right = create(mid, b, ply - 1);
            }
            else
            {
                e.order = order++;
            }
            return e;
        }
        return create(min, max, max_depth);
    }

    function GetZoomLevel()
    {
        function search(q, mid)
        {
            if(q == null)
                return mid;
            if(q.f())
                return search(q.right, q.mid);
            else
                return search(q.left, mid);
        }
        return search(zoom_tree, 1);
    }
    
    function OnChanged(level)
    {
        PreviousLevel = level;
        var zoom_event = new CustomEvent('zoom-change', { detail: { level: level } });
        window.dispatchEvent(zoom_event);
    }
    
    function Update()
    {
        let level = GetZoomLevel();
        if(level != this.PreviousLevel)
        {
            PreviousLevel = level;
            OnChanged(level);
        }
    }
    
    function Run(period = 16)
    {
        Stop();
        interval = setInterval(Update, period);
    }
    
    function Stop()
    {
        clearInterval(interval);
        interval = null;
    }
    
    zoom_tree = CreateQueryTree(query_tester_parent, ['-webkit-min-device-pixel-ratio', 'min--moz-device-pixel-ratio'], '', 0, 5, max_depth);
    
    return {
        Run: Run,
        Stop: Stop
    };
}