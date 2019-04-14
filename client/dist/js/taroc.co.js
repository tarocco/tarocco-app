let _first = ' '.charCodeAt(0);
// function encode(str) {
//     return [...str].map(c => c.charCodeAt(0) - _first);
// }

function decode(arr) {
    return arr.map(n => String.fromCharCode(n + _first)).join('');
}

for(let e of document.querySelectorAll('.eml-1')) {
    (async() => {
        let ct = [4940, 21860, 2487, 13954, 25793, 16510, 12876, 19907, 24680, 1393, 24680, 19907];
        let pt = decode(ct.map((c) => RSA.decrypt(c, eml1_d, eml1_n).value));
        e.innerHTML = pt;
        e.setAttribute('href', `mailto:${pt}`)
    })();
}

function mediaQueryMatches(style, property, r)
{
    let mq_tester = document.getElementById('mq-tester');
    style.sheet.insertRule('@media (' + property + ':' + r + ') { #mq-tester ' + '{text-decoration: underline} }', 0);
    let matched = window.getComputedStyle(mq_tester, null).textDecoration == 'underline';
    style.sheet.deleteRule(0);
    return matched;
}

function mediaQueryBinarySearch(property, unit, a, b, max_iter, epsilon)
{
    let style = document.createElement('style');
    let mq_tester = document.createElement('div');
    mq_tester.setAttribute('id', 'mq-tester');
    document.body.appendChild(style);
    document.body.appendChild(mq_tester);
    function search(a, b, max_iter)
    {
        let mid = (a + b) / 2;
        if (max_iter == 0 || b - a < epsilon)
            return mid;
        if (mediaQueryMatches(style, property, mid + unit))
            return search(mid, b, max_iter - 1);
        else
            return search(a, mid, max_iter - 1);
    }
    let result = search(a, b, max_iter);
    document.body.removeChild(style);
    document.body.removeChild(mq_tester);
    return result;
}

function getZoomLevel()
{
    let zoom = mediaQueryBinarySearch('min--moz-device-pixel-ratio', '', 0, 10, 6, 0.01);
    zoom = zoom.toPrecision(3);
    return zoom;
}

{
    let zoom_level = getZoomLevel();
    function update()
    {
        let z = getZoomLevel();
        if(z != zoom_level)
        {
            zoom_level = z;
            var zoom_event = new CustomEvent('zoom-change', { detail: { level: z } });
            //console.log(zoom_event);
            window.dispatchEvent(zoom_event);
        }
    }
    setInterval(update, 10);
}