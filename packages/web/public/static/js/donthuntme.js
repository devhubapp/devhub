// Source: https://donthuntme.com/

function init(config) {
  if (config.ribbon) {
    ribbon(config.ribbon)
  }
}
if (
  window.location.search.indexOf('?ref=producthunt') > -1 ||
  document.referrer.indexOf('producthunt') > -1
) {
  var ref = document.referrer
  redirectToPH()
}

function setAttributes(e, attrs) {
  for (var a in attrs) {
    e.setAttribute(a, attrs[a])
  }
}

function redirectToPH() {
  let phb = document.createElement('div')
  phb.id = 'phb'

  setAttributes(phb, {
    style:
      '    z-index: 99999;' +
      '    background: rgba(0,0,0,.7);' +
      '    top: 0;' +
      '    bottom: 0;' +
      '    left: 0;' +
      '    right: 0;' +
      '    display: flex;' +
      '    justify-content: center;' +
      '    align-items: center;' +
      '    position: fixed;',
  })

  let p = pC()

  phb.appendChild(p)

  document.body.appendChild(phb)

  function pC() {
    let p = document.createElement('div')
    setAttributes(p, {
      style:
        '    background: #fff;' +
        '    border-radius: 3px;' +
        '    box-shadow: 1px 0 6px 0 rgba(0,0,0,.3);' +
        '    box-sizing: border-box;' +
        '    max-width: 1100px;' +
        '    width: 90vw;' +
        '    overflow: auto;' +
        '    display:flex;' +
        '    flex-wrap: wrap;' +
        '    justify-content:space-around;' +
        '    align-items:center;' +
        '    padding: 80px 20px;',
    })

    let te = text()
    let img = imge()

    p.appendChild(te)
    p.appendChild(img)

    return p
  }

  function text() {
    let te = document.createElement('div')
    setAttributes(te, { style: 'width: 460px; margin-bottom: 40px;' })

    let h = document.createElement('h2')
    h.textContent = 'This product is not ready'
    setAttributes(h, {
      style:
        '    line-height: 32px;' +
        '    margin-bottom: 15px;' +
        '    font-weight: 700;' +
        '    font-size: 26px;' +
        '    color: #000;' +
        '    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;',
    })
    te.appendChild(h)

    let sh = document.createElement('p')
    sh.textContent =
      'Dear Hunter, thank you for checking this website. Sadly, it is not ready to launch yet. Please come back later!'
    setAttributes(sh, {
      style:
        '    font-size: 15px;' +
        '    line-height: 25px;' +
        '    color: #999;' +
        '    font-weight: 200;' +
        '    margin: 10px 0 20px;' +
        '    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;',
    })
    te.appendChild(sh)

    let red = document.createElement('p')
    red.textContent = 'You will be redirected in '
    setAttributes(red, {
      style:
        '    font-size: 11px;' +
        '    line-height: 16px;' +
        '    color: #000;' +
        '    text-transform: uppercase;' +
        '    font-weight: 600;' +
        '    margin: 0 20px 0 0;' +
        '    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;',
    })

    let t = timer()
    red.appendChild(t)
    te.appendChild(red)

    return te
  }

  function timer() {
    let t = document.createElement('span')
    setAttributes(t, { style: 'color: #da552f' })
    let l = 6
    let ti = setInterval(function() {
      t.textContent = --l
      if (l <= 1) {
        clearInterval(ti)
        ref
          ? (window.location = ref)
          : (window.location = 'https://github.com/devhubapp/devhub')
      }
    }, 1000)
    return t
  }
}

function imge() {
  let d = document.createElement('div')
  let img = document.createElement('img')
  setAttributes(img, {
    src: '/static/media/donthuntme.png',
    style: 'width: 240px;',
  })
  d.appendChild(img)
  return d
}

function ribbon(loc) {
  let phr = document.createElement('div')
  phr.id = 'phr'

  setAttributes(phr, {
    id: 'phr',
    style:
      'display: inline-flex;' +
      'justify-content: center;' +
      'align-items: center;' +
      'font-weight: 700;' +
      'font-size: 11px;' +
      'color: #fff;' +
      'text-transform: uppercase;' +
      'font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;' +
      'width: 300px;' +
      'color: #da552f;' +
      'background: #fff;' +
      'position: fixed;' +
      'text-align: center;' +
      'line-height: 40px;' +
      'cursor:pointer;' +
      'transform: rotate(40deg);' +
      'box-shadow: 0px 4px 7px 0px rgba(50, 69, 93, 0.15), 0px -1px 4px 0px rgba(0, 0, 0, 0.08)',
  })

  if (loc == 'bottomright') {
    phr.style.bottom = '55px'
    phr.style.right = '-60px'
    phr.style.transform = 'rotate(-40deg)'
  } else if (loc == 'bottomleft') {
    phr.style.bottom = '55px'
    phr.style.left = '-60px'
    phr.style.transform = 'rotate(40deg)'
  } else if (loc == 'topleft') {
    phr.style.top = '55px'
    phr.style.left = '-60px'
    phr.style.transform = 'rotate(-40deg)'
  } else {
    phr.style.top = '55px'
    phr.style.right = '-60px'
    phr.style.transform = 'rotate(40deg)'
  }

  phr.innerHTML +=
    '<svg style="padding-right:8px;" width="30" height="30" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M40 20c0 11.046-8.954 20-20 20S0 31.046 0 20 8.954 0 20 0s20 8.954 20 20" fill="#DA552F"></path><path d="M22.667 20H17v-6h5.667a3 3 0 0 1 0 6m0-10H13v20h4v-6h5.667a7 7 0 1 0 0-14" fill="#FFF"></path></g></svg>'
  phr.innerHTML += "Please, don't hunt me!"

  phr.addEventListener('click', explain)
  document.body.appendChild(phr)

  function explain() {
    let exp = document.createElement('div')
    exp.id = 'dhm-popup-explain'

    setAttributes(exp, {
      style:
        '    z-index: 99999;' +
        '    background: rgba(0,0,0,.7);' +
        '    top: 0;' +
        '    bottom: 0;' +
        '    left: 0;' +
        '    right: 0;' +
        '    display: flex;' +
        '    justify-content: center;' +
        '    align-items: center;' +
        '    position: fixed;',
    })

    let p = pC()
    exp.addEventListener('click', outsideClickListener)

    exp.appendChild(p)
    document.body.appendChild(exp)
  }

  function pC() {
    let p = document.createElement('div')
    p.id = 'dhm-popup-explain-container'
    setAttributes(p, {
      style:
        '    background: #fff;' +
        '    border-radius: 3px;' +
        '    box-shadow: 1px 0 6px 0 rgba(0,0,0,.3);' +
        '    box-sizing: border-box;' +
        '    max-width: 1100px;' +
        '    width: 90vw;' +
        '    overflow: auto;' +
        '    display:flex;' +
        '    flex-wrap: wrap;' +
        '    justify-content:space-around;' +
        '    align-items:center;' +
        '    padding: 80px 20px;',
    })

    let te = text()
    let img = imge()

    p.appendChild(te)
    p.appendChild(img)

    return p
  }

  function text() {
    let te = document.createElement('div')
    setAttributes(te, { style: 'width: 460px; margin-bottom: 40px;' })

    let h = document.createElement('h2')
    h.textContent = 'This product will be blocked on Product Hunt!'
    setAttributes(h, {
      style:
        '    line-height: 32px;' +
        '    margin-bottom: 15px;' +
        '    font-weight: 700;' +
        '    font-size: 26px;' +
        '    color: #000;' +
        '    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;',
    })
    te.appendChild(h)

    let t1 = document.createElement('p')
    t1.textContent = 'Dear Hunter, thank you for checking out my product!'
    setAttributes(t1, {
      style:
        '    font-size: 15px;' +
        '    line-height: 25px;' +
        '    color: #999;' +
        '    font-weight: 200;' +
        '    margin: 10px 0 20px;' +
        '    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;',
    })
    te.appendChild(t1)
    let t2 = document.createElement('p')
    t2.textContent =
      "However, it is not ready to launch yet and Product Hunt's users will be blocked."
    setAttributes(t2, {
      style:
        '    font-size: 15px;' +
        '    line-height: 25px;' +
        '    color: #999;' +
        '    font-weight: 200;' +
        '    margin: 10px 0 20px;' +
        '    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;',
    })
    te.appendChild(t2)

    let b = document.createElement('a')
    b.textContent = 'back'

    setAttributes(b, {
      style:
        'cursor: pointer;' +
        'color: #da552f;' +
        'fill: #fff;' +
        'font-weight: 600;' +
        'font-size: 13px;' +
        'font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;' +
        'text-transform: uppercase',
    })

    b.addEventListener('click', close)

    te.appendChild(b)

    return te
  }

  function outsideClickListener(e) {
    let container = document.getElementById('dhm-popup-explain-container')
    if (container && !container.contains(e.target)) {
      close()
    }
  }

  function close() {
    let container = document.getElementById('dhm-popup-explain')
    container.parentNode.removeChild(container)
  }
}
