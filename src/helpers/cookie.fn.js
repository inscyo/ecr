export const cookieExpiration = { expires: 16 / 48 } // 8hrs

export const removeAllCookies = (host) => {
  let cookies = document.cookie.split('; ')
  for (let c = 0; c < cookies.length; c++) {
    let d = host.split('.')
    while (d.length > 0) {
      let cookieBase =
        encodeURIComponent(cookies[c].split(';')[0].split('=')[0]) +
        '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' +
        d.join('.') +
        ' ;path='
      let p = host.pathname.split('/')
      document.cookie = cookieBase + '/'
      while (p.length > 0) {
        document.cookie = cookieBase + p.join('/')
        p.pop()
      }
      d.shift()
    }
  }
}

export const setCookie = (name, value, config) => {
  var expires = ''
  if (config.expiration) {
    var expirationTime = new Date(
      new Date().getTime() + config.expiration * 60 * 1000
    )
    expires = '; expires=' + expirationTime.toUTCString()
  }

  var cookieConfig = ''
  if (config.sameSite) {
    cookieConfig += '; samesite=' + config.sameSite
  }
  if (config.secure) {
    cookieConfig += '; secure'
  }

  console.log(cookieConfig)

  document.cookie = name + '=' + value + expires + '; path=/' + cookieConfig
}

export const getCookie = (name) => {
  var nameEQ = name + '='
  var cookies = document.cookie.split(';')
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i]
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1, cookie.length)
    }
    if (cookie.indexOf(nameEQ) == 0) {
      return cookie.substring(nameEQ.length, cookie.length)
    }
  }
  return null
}

export const updateCookie = (name, newValue, days) => {
  deleteCookie(name)
  setCookie(name, newValue, days)
}

// Delete a cookie
export const deleteCookie = (name) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}
