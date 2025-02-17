export function elem(tag, props = {}) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(props)) {
        if (key === 'style' && typeof val === 'object') {
            Object.assign(el.style, val);
        } else {
            el[key] = val;
        }
    }
    return el;
}