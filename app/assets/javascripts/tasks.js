$(function() {
	function taskHtml(task) {
		var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : '';
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' +
    '<div class="view"><input class="toggle" type="checkbox"' + " data-id='" + task.id + "'" + checkedStatus + '><label id="' + task.id + '">' + task.title + '</label><button class="destroy" data-id="' + task.id + '"></button></div></li>';
    return liElement;
	}

	function toggleTask(e) {
		var itemId = $(e.target).data("id");
		var doneValue = Boolean($(e.target).is(':checked'));
		$.post("/tasks/" + itemId, {
			_method: "PUT", 
			task: {
				done: doneValue
			}
			}).success(function(data) {
				var liHtml = taskHtml(data);
				var $li = $("#listItem-" + data.id);
				$li.replaceWith(liHtml);
				$('.toggle').change(toggleTask);
			});
		}

	$.get("/tasks").success( function( data ) {
		var htmlString = "";
		$.each(data, function(index, task) {
			htmlString += taskHtml(task);
		});
		var ulTodos = $('.todo-list');
		ulTodos.html(htmlString);

		$('.toggle').change(toggleTask);
	});

	$('#new-form').submit(function(event) {
		event.preventDefault();
		var textbox = $('.new-todo');
		var payload = {
			task: {
				title: textbox.val()
			}
		};
		$.post("/tasks", payload).success(function(data) {
			var htmlString = taskHtml(data);
			var ulTodos = $('.todo-list');
			ulTodos.append(htmlString);
			$('.toggle').click(toggleTask);
			$('.new-todo').val('');
		});
	});

	$('body').on('click', '.destroy', function(e) {
		var itemId = $(e.target).data("id");
		// $(taskHtml(itemId)).remove();
		$.ajax({
			url: "/tasks/" + itemId,
			method: "DELETE"
		}).success(function(data) {
			// try moving into a named function
			// add another event listener to the page - more practice with this, highlighting possibly
			var htmlString = "";
			$.each(data, function(index, task) {
				htmlString += taskHtml(task);
			});
			var ulTodos = $('.todo-list');
			ulTodos.html(htmlString);
			});
	});

	$('body').on('dblclick', 'label', function(e) {
		var labelId = $(e.target.id)
		$('#' + labelId.selector).toggleClass("background-yellow")
	});
});