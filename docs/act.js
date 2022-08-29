const createElement = document.createElement.bind(document);

// set head info
// set page title
document.title = `${docData.title} - Fitzxel`;
// set page description
document.head.querySelector('meta[name="description"]').setAttribute('content', docData.desc);

// page theme scripts
if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'auto');
}
let theme = localStorage.getItem('theme');
function setTheme() {
    if (theme == 'auto') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.querySelector('html').setAttribute('data-theme', 'dark');
        }
        else {
            document.querySelector('html').setAttribute('data-theme', 'light');
        }
    }
    else {
        document.querySelector('html').setAttribute('data-theme', theme);
    }
}
setTheme();

const swtThemeBtn = document.querySelector('#switch-theme-btn');
swtThemeBtn.querySelector('span').textContent = theme.replace(theme[0], theme[0].toLocaleUpperCase());

swtThemeBtn.addEventListener('click', ()=> {
    swtThemeBtn.parentElement.classList.toggle('act');
    // const buttons = swtThemeBtn.querySelectorAll('.list li button');
    // buttons.forEach(element => {
    //     // element.tabIndex = 
    // });
});
const slctThemeBtns = document.querySelectorAll('.select-theme-btn');
slctThemeBtns.forEach(btn => {
    btn.addEventListener('click', ()=> {
        localStorage.setItem('theme', btn.getAttribute('name'));
        theme = btn.getAttribute('name');
        swtThemeBtn.querySelector('span').textContent = theme.replace(theme[0], theme[0].toLocaleUpperCase());
        setTheme();
    });
});

// page lang scripts
if (!localStorage.getItem('lang')) {
    if (window.navigator.language.includes('es')) {
        localStorage.setItem('lang', 'es');
    }
    else {
        localStorage.setItem('lang', 'en');
    }
}
const lang = localStorage.getItem('lang');

const swtLangBtn = document.querySelector('#switch-lang-btn');
swtLangBtn.querySelector('span').textContent = lang.toLocaleUpperCase();

swtLangBtn.addEventListener('click', ()=> {
    swtLangBtn.parentElement.classList.toggle('act');
});
const slctLangBtns = document.querySelectorAll('.select-lang-btn');
slctLangBtns.forEach(btn => {
    // if (btn.getAttribute('name') == lang) {
    //     btn.parentElement.remove();
    // }
    btn.addEventListener('click', ()=> {
        localStorage.setItem('lang', btn.getAttribute('name'));
        location.replace(location.href.replace(`${document.querySelector('html').getAttribute('lang')}/`, `${btn.getAttribute('name')}/`));
    });
});

let indexN = 5;

// search scripts

let indexData;
// if on line
if (window.navigator.onLine == true) {
    // get search index
    fetch('https:/fitzxel.github.io/data/fx-index.json').then(res=> {
        console.log(res.text());
        if (res.status >= 200 && res.status <= 299) {
            res.json().then(res=> {
                indexData = res;

                document.querySelector('#search-input').parentElement.classList.remove('not-allowed');
                let searchScript = createElement('script');
                // searchScript.src = 'https://fitzxel.github.io/scripts/search.js';
                searchScript.src = '../search.js';
                document.body.appendChild(searchScript);
                // create and get projects nav
                let projectsNavScript = createElement('script');
                projectsNavScript.src = '../projects-nav.js';
                document.body.appendChild(projectsNavScript);
            });
        }
        else if (res.status >= 400 && res.status <= 499) {
            searchResults.querySelector('.over-text').textContent = 'An error has occurred';
        }
    });
}

// page nav scripts
let navOpen = false;
// const navMenu = document.querySelector('#navigation-menu');

// document.querySelector('#menu-btn').addEventListener('click', ()=> {
//     if (navOpen) {
//         navMenu.classList.remove('open');
//         navOpen = false;
//     }
//     else {
//         navMenu.classList.add('open');
//         navOpen = true;
//     }
// });

// actions on click in the body

function closeProjectsNav() {
    // navMenu.classList.remove('open');
    navOpen = false;
}
function closeSwitchs() {
    if (swtThemeBtn.parentElement.classList[1] == 'act') {
        swtThemeBtn.parentElement.classList.remove('act');
    }
    if (swtLangBtn.parentElement.classList[1] == 'act') {
        swtLangBtn.parentElement.classList.remove('act');
    }
}

document.body.addEventListener('keydown', (e)=>{
    if (e.key == 'Escape') {
        e.preventDefault();
        closeProjectsNav();
        closeSwitchs();
    }
});
document.body.addEventListener('click', (e)=>{
    if (!e.composedPath().find(element => element.nodeName == 'NAV') && navOpen && !e.composedPath().find(element => element.nodeName == 'HEADER')) {
        closeProjectsNav();
    }
    if (!e.composedPath().find(element => element.nodeName == 'BUTTON')) {
        closeSwitchs();
    }
});

// apply an icon to all "a" items that open in a new tab
const allA = document.querySelectorAll('a[target="_blank"]');
allA.forEach(a => {
    let icon = createElement('ion-icon');
    icon.name = 'open';
    icon.classList.add('a-icon');
    a.appendChild(icon);
});

let asideOpen = false;
const aside = document.querySelector('.aside');

document.querySelector('#aside-btn').addEventListener('click', ()=> {
    if (asideOpen) {
        aside.classList.remove('open');
        asideOpen = false;
    }
    else {
        aside.classList.add('open');
        asideOpen = true;
    }
});

document.querySelector('#docsite-banner').addEventListener('load', ()=> {
    document.querySelector('#docsite-banner').style.opacity = '1';
});

document.querySelector('.metadata').querySelector('.icon').alt = docData.tags;
document.querySelector('.metadata').querySelector('h1').textContent = docData.title;
document.querySelector('.metadata').querySelector('time').dateTime = `${docData.lastDate.getFullYear()}-${docData.lastDate.getMonth()+1}-${docData.lastDate.getDate()}`
document.querySelector('.metadata').querySelector('time').textContent = `Last modified: ${docData.lastDate.getDate()}-${docData.lastDate.getMonth()+1}-${docData.lastDate.getFullYear()}`;
document.querySelector('#docsite-banner').alt = docData.tags;
document.querySelector('#desc').textContent = `'${docData.desc}'`;
document.querySelector('#repo').href = docData.repo;
document.querySelector('#repo').innerHTML = docData.repo;
document.querySelector('#type').textContent = `'${docData.type}'`;

// set languages
let documentFragmentLangs = document.createDocumentFragment();
for (let i = 0; i < docData.programing_langs.length; i++) {
    let li = createElement('li');
    let p = createElement('p');
    p.classList.add('token', 'string');
    p.innerHTML = `'${docData.programing_langs[i].toLocaleUpperCase()}'`;
    li.appendChild(p);
    if (docData.programing_langs.length > i+1) {
        let tokenPunct = createElement('span');
        tokenPunct.classList.add('token', 'punctuation');
        tokenPunct.textContent = ',';
        li.appendChild(tokenPunct);
    }
    documentFragmentLangs.appendChild(li);
}
document.querySelector('#append-langs ul').appendChild(documentFragmentLangs);

// set getIts
let documentFragmentGetIt = document.createDocumentFragment();
for (let i = 0; i < docData.getIt.length; i++) {
    let li = document.createElement('li');
    let p = document.createElement('p');
    p.classList.add('token', 'string');
    p.innerHTML = `'<a href="${docData.getIt[i].url}" target="_blank">${docData.getIt[i].title}</a>'`;
    li.appendChild(p);
    if (docData.getIt.length > i+1) {
        let tokenPunct = document.createElement('span');
        tokenPunct.classList.add('token', 'punctuation');
        tokenPunct.textContent = ',';
        li.appendChild(tokenPunct);
    }
    documentFragmentGetIt.appendChild(li);
}
document.querySelector('#append-getIts ul').appendChild(documentFragmentGetIt);

// set licence text
document.querySelector('#licence').textContent = `'${docData.licence}'`;


let lastIntersectingScroll = 0;

const callback = (entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting && entry.intersectionRatio < .5 && lastIntersectingScroll > window.scrollY) {
            // console.log(entry);
            // console.log(`salir de ${entry.target.id}`);
            document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.classList.remove('act');
            if (document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.previousElementSibling) {
                document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.previousElementSibling.querySelector('a').parentElement.classList.add('act');
            }
        }
        if (entry.isIntersecting && entry.intersectionRatio >= .5) {
            // console.log(entry);
            // console.log(`entrar a ${entry.target.id}`);
            lastIntersectingScroll = window.scrollY;
            document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.classList.add('act');
            if (document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.previousElementSibling) {
                document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.previousElementSibling.querySelector('a').parentElement.classList.remove('act');
            }
            if (document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.nextElementSibling) {
                document.querySelector(`.aside ul.nav li a[href="#${entry.target.id}"]`).parentElement.nextElementSibling.querySelector('a').parentElement.classList.remove('act');
            }
        }
    });
}

let observer = new IntersectionObserver(callback, {
    rootMargin: "0px",
    threshold: .5
});

document.querySelectorAll('.article .content h2').forEach(element => {
    observer.observe(element);
});