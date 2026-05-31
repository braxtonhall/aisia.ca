var createEntryCell = function(entry) {
	var entryCell = document.createElement('div');
	entryCell.classList.add('entry-cell');
	entryCell.dataset.left = String(entry.left);
	entryCell.dataset.right = String(entry.right);
	entryCell.style.gridColumn = 'span ' + entry.units;

	if (entry.title) {
		var spacing = document.createElement('div');
		spacing.classList.add('entry-contents-container');
		entryCell.appendChild(spacing);

		var contents = document.createElement('div');
		contents.classList.add('entry-contents');
		spacing.appendChild(contents);

		var header = document.createElement('header');
		header.innerText = entry.title;
		contents.appendChild(header);
	}

	return entryCell;
};

var updateChannelRow = function(rowDiv, channel) {
	rowDiv.replaceChildren();

	var channelCell = document.createElement('div');
	channelCell.classList.add('channel-cell');
	rowDiv.appendChild(channelCell);

	var idDiv = document.createElement('div');
	idDiv.innerText = String(channel.displayNumber).padStart(2, '0');
	channelCell.appendChild(idDiv);

	var codeDiv = document.createElement('div');
	codeDiv.innerText = channel.code;
	channelCell.appendChild(codeDiv);

	var contents = document.createElement('div');
	contents.classList.add('channel-contents');
	contents.style.gridTemplateColumns = 'repeat(' + ((COLUMNS * TV_UNIT) / PRECISION) + ', 1fr)';
	rowDiv.appendChild(contents);

	for (var i = 0; i < channel.schedule.length; i++) {
		contents.appendChild(createEntryCell(channel.schedule[i]));
	}
};

var updateRow = function(div, channels, channelId) {
	if (channelId > 0 && channelId - 1 < channels.length) {
		var channel = channels[channelId - 1];
		updateChannelRow(div, channel);
	} else {
		div.innerText = '';
	}
};

var drawInstance = function(container, instanceSize, rowCount, channelStart, channels) {
	var expected = 0;
	for (var i = 0; i < instanceSize; i++) {
		var channel = channelStart + i;
		var child = container.children.item(i);
		if (!child) {
			child = document.createElement('div');
			container.appendChild(child);
		}
		child.classList.add('row');
		expected++;
		if (channel >= 0 && channel < rowCount) {
			updateRow(child, channels, channel + 1);
		} else {
			child.innerText = '';
		}
	}
	while (container.children.length > expected) {
		container.removeChild(container.lastChild);
	}
};
