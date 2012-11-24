function listenForTouches(modalCallback, scope) {
  if (!scope) scope = ""
  else scope = scope + " "
  
  turnOffClick([scope + 'a', scope + 'input'])
  
  $(scope + 'a').live('tap', function(e) {
    var modal = catchModals(e)
    if (modal && modalCallback) modalCallback(modal)
  })

  $(scope + 'input').live('tap', function(e) {
    e.preventDefault()
    var el = $(e.target)
    if (e.target.type === "checkbox") {
      el[0].checked = !el[0].checked
      el.attr('checked', el[0].checked)
      // hack around webkit bug
      var toggler = el.parent().find('.toggler')
      redraw(toggler)
    } else if (e.target.type === "submit" || e.target.type === "button") {
      el.parents('form').first().submit()
    } else {
      if (el.hasClass('disabled')) return false
      var type = e.target.type
      // hack around mobile safari bug
      // if (type === "datetime") return setTimeout(function() { el.focus() }, 0)
      el.focus()
    }
    return false
  })
}

// mobile browsers ughhhhhhhhh
function redraw(obj) {
  obj.hide()
  obj.each(function() { this.offsetHeight })
  obj.show()
}

function turnOffClick(elems) {
  elems.forEach(function(el) {
    $(el).live('click', function(e) {
      e.preventDefault()
      return false
    })
  })
} 

function catchModals( event ) {
  var currentTarget = $(event.currentTarget)
  var route = currentTarget.attr('href')
  if (!route) return
  // Basic rules:
  // * If the href ends with a bang (!) we're going to return the route name
  // * Otherwise, we're going to change the page href
  if ( route && route.indexOf( '!' ) === ( route.length - 1 ) ) {
    route = route.replace('#/', '') // Trim off the #/ from the beginning of the route if it exists
    route = route.substr(0, route.lastIndexOf('!'))
    var id = route.split('/')[1] // The ID (if one exists) will be what comes after the slash
    if (id) route = route.split('/')[0] // If there is an ID, then we have to trim it off the route
    return route
    if (typeof event === 'object') event.preventDefault()
  } else {
    redirect(route)
    return false
  }
}

function redirect(uri) {
  window.location.href = uri
}

module.exports = {
  listenForTouches: listenForTouches,
  turnOffClick: turnOffClick,
  catchModals: catchModals,
  redirect: redirect
}