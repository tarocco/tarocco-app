let nav_actors = [...document.querySelectorAll('.nav-action')];
let sections = [...document.querySelectorAll('section')];

let section_ids = sections.map((s) => s.id);

let nav_actors_map = nav_actors.reduce(function (map, obj) {
    let key = obj.getAttribute('href').substr(1);
    if (key == '') // Special case
        key = 'home';
    map[key] = obj;
    return map;
}, {});

let nav_sections_map = sections.reduce(function (map, obj) {
    map[obj.id] = obj;
    return map;
}, {});

function show_section(section) {
    for (let s of sections) {
        let visible = s == section;
        s.style.display = visible ? 'block' : 'none';
    }
}

for (let section_id of section_ids) {
    let actor = nav_actors_map[section_id];
    let section = nav_sections_map[section_id];
    actor.addEventListener('click', () => show_section(section));
}

let current_section_id = window.location.hash.substring(1);
let current_section = nav_sections_map[current_section_id];

if(typeof(current_section) !== 'undefined')
    show_section(current_section);

let follow_cursor = (function() {
    var element_ = null;
    var zoom = getZoomLevel();
    
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
        element_.style.display = 'block';
    }
    
    function leave(e)
    {
        element_.style.display = 'none';
    }
    
    function move(e)
    {
        element_.style.left = e.clientX + 'px';
        element_.style.top = e.clientY + 'px';
        apply_zoom(zoom);
    }
    
    return {
        init: function()
        {
            element_ = document.createElement('div');
            element_.setAttribute('class', 'cursor-img');
            element_.style.display = 'none';
            document.body.appendChild(element_);
            window.addEventListener('zoom-change', handle_zoom);
            document.body.addEventListener('mouseenter', enter);
            document.body.addEventListener('mouseleave', leave);
            document.body.addEventListener('mousemove', move);
        }
    };
}());

let follower = follow_cursor.init();