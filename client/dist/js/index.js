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


let tarocco = Tarocco();
let cursor_follower = document.querySelector('#cursor-0');
tarocco.FollowCursor(cursor_follower);

tarocco.eml1();