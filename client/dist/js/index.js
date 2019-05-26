let nav_actors = [...document.querySelectorAll('.nav-action')];
let sections = [...document.querySelectorAll('section')];

let section_ids = sections.map((s) => s.id);

let nav_actors_map = nav_actors.reduce(function (map, obj) {
    let key = obj.getAttribute('href').substr(1);
    if (key == '') // Special case
        key = 'home';
    let id = key + '-section';
    map[id] = obj;
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
    }
}

for (let section_id of section_ids) {
    let actor = nav_actors_map[section_id];
    let section = nav_sections_map[section_id];
    actor.addEventListener('click', () => show_section(section));
}

// Adapted from https://alligator.io/js/lazy-loading-scripts/
async function load_script(key, url) {
    let id = `load-script--${key}`;
    let is_loaded = document.getElementById(id);
    if(is_loaded)
        return null;
    const script = document.createElement('script');
    script.src = url;
    script.id = id;
    return new Promise((resolve, reject) => {
        function handler() {
            resolve(true);
        }
        script.addEventListener('load', handler);
        document.getElementsByTagName('head')[0].appendChild(script);
    });
}

async function load_css(key, url)
{
    let id = `load-css--${key}`;
    let is_loaded = document.getElementById(id);
    if(is_loaded)
        return null;
    var link = document.createElement('link');
    link.href = url;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    return new Promise((resolve, reject) => {
        function handler() {
            resolve(true);
        }
        link.addEventListener('load', handler);
        document.getElementsByTagName('head')[0].appendChild(link);
    });
}

async function load_media_player() {
    await load_css('wptpa_style', 'css/wptpa_style.css');
    await load_script('jquery', 'js/jquery.js');
    await load_script('jquery-ui', 'js/jquery-ui.js');
    await load_script('snap-svg', 'js/snap.svg.js');
    await load_script('wptpa', 'js/wptpa_script.js');
    await load_script('playlists', 'js/playlists.js');
    let wrapper = $('section#media-section #media-player');
    let player_is_loaded = $('.wptpa_player', wrapper).length > 0;
    if(!player_is_loaded)
    {
        let player = wrapper.tPlayer(
        {
            playlist: Playlists.Tracks,
            playerBG: "#FFF",
            playerTextCLR: "#F61",
            buttonCLR: "#F61",
            buttonActiveCLR: "#F61",
            seekBarCLR: "#F61",
            progressBarCLR: "#FFF",
            timeCLR: "#FFF",
            playlistBG: "#FFF",
            playlistTextCLR: "#F61",
            playlistCurBG: "#F61",
            playlistTextCurCLR: "#FFF",
        });
        wrapper.addClass('loaded');
    }
}

function unload_media_player() {
    $('section#media-section #media-player').empty();
}

function handle_show_media_section(e) {
    load_media_player();
}

function handle_hide_media_section(e) {
    unload_media_player();
}

let current_section_id = window.location.hash.substring(1) + '-section';
console.log(nav_sections_map);
let current_section = nav_sections_map[current_section_id] || document.querySelector('section#home-section');
let media_section = document.querySelector('section#media-section');
show_section(current_section);
media_section.addEventListener('show', handle_show_media_section);
media_section.addEventListener('hide', handle_hide_media_section);

let tarocco = Tarocco();
let cursor_follower = document.querySelector('#cursor-0');
tarocco.FollowCursor(cursor_follower);



tarocco.eml1();