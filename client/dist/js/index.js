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
        let e = new Event(visible ? 'show' : 'hide');
        s.dispatchEvent(e);
    }
    for(let key in nav_actors_map) {
        let actor = nav_actors_map[key];
        let s = nav_sections_map[key]
        let selected = s == section;
        if(selected)
            actor.classList.add('selected');
        else
            actor.classList.remove('selected');
        console.log(actor)
    }
}

for (let section_id of section_ids) {
    let actor = nav_actors_map[section_id];
    let section = nav_sections_map[section_id];
    actor.addEventListener('click', () => show_section(section));
}

// Adapted from https://alligator.io/js/lazy-loading-scripts/
function load_script(key, url) {
    let id = `load-script--${key}`;
    let is_loaded = document.getElementById(id);
    if(is_loaded)
        return null;
    let script = document.createElement('script');
    script.src = url;
    script.id = id;
    document.body.appendChild(script);
    return script;
}

function load_css(key, url)
{
    let id = `load-css--${key}`;
    let is_loaded = document.getElementById(id);
    if(is_loaded)
        return null;
    var link = document.createElement('link');
    link.href = url;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(link);
}

function load_media_player() {
    // TODO
    //load_script('jquery', 'js/jquery.js');
}

function unload_media_player() {
    // TODO
}

function handle_show_media_section(e) {
    load_media_player();
}

function handle_hide_media_section(e) {
    unload_media_player();
}

let current_section_id = window.location.hash.substring(1);
let current_section = nav_sections_map[current_section_id] || document.querySelector('section#home');
let media_section = document.querySelector('section#media');
media_section.addEventListener('show', handle_show_media_section);
show_section(current_section);

let tarocco = Tarocco();
let cursor_follower = document.querySelector('#cursor-0');
tarocco.FollowCursor(cursor_follower);



tarocco.eml1();