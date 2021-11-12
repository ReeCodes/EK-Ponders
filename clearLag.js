// Create item whitelist filter that won't be deleted with clearlag
var whitelist = ingredient.matchAny([
'@astralsorcery',
'@create',
'@botania',
'@sophisticatedbackpacks',
'@mythicbotany',
'minecraft:gold_ingot'
])

// Create new function that clears lag
function clearLag (server) {
  // make variable for counting items
  let itemCount = 0;
  // Get a list of all entities on server with filter that only returns items
  var itemList = server.getEntities('@e[type=item]')
  /*
  server.tell(itemList)
  */
  // Iterate over each entity in itemList and add item counters
  itemList.forEach(function (entity) {
    // debug
	/*
    server.tell(entity.item)
	*/
    if (!whitelist.test(entity.item)) {
      // Kill the item entity
      entity.kill()
      // Add to entity count
      itemCount++
    }
  })

  // Tell everyone how many items will be removed
  server.tell([
    text.lightPurple('[ClearLag]'),
    ' Removed ',
    itemCount.toFixed(0),
    ' items. ',
  ])
}

// Listen for server load event
events.listen('server.load', function (event) {
  // Log message in console
  event.server.tell([ text.lightPurple('[ClearLag]'), ' Timer started, clearing lag in 15 minutes!' ])
  // Schedule new task in 15 minutes
  event.server.schedule(MINUTE * 15, event.server, function (callback) {
    // Tell everyone on server that items will be removed
    callback.data.tell([ text.lightPurple('[ClearLag]'), ' Removing all items on ground in one minute!' ])
    // Schedule a subtask that will clear items in one minute
    callback.data.schedule(MINUTE * 1, callback.data, function (callback2) {
		callback2.data.tell([ text.lightPurple('[ClearLag]'), ' Removing items in 3' ])
			callback2.data.schedule(SECOND * 1.5, callback.data, function (callback3) {
				callback3.data.tell([ text.lightPurple('[ClearLag]'), ' 2' ])
					callback3.data.schedule(SECOND * 1.5, callback.data, function (callback4) {
						callback4.data.tell([ text.lightPurple('[ClearLag]'), ' 1' ])
						clearLag(callback4.data)
		})
	  })
    })
    // Re-schedule this task for another 15 minutes (endless loop)
    callback.reschedule()
  })
})

onEvent('server.custom_command.clearlag', event => {
  clearLag(event.server)
})
