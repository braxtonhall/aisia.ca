var BobClubRenderer = function() {};

BobClubRenderer.LINKS = [
	{ href: 'https://bobs-club.net/site/aisiadotca/pred', emoji: '👈', label: 'Previous' },
	{ href: 'https://bobs-club.net/',                        emoji: '🌐', label: "Bob's Club" },
	{ href: 'https://bobs-club.net/site/aisiadotca/random',  emoji: '🎲', label: 'Random' },
	{ href: 'https://bobs-club.net/site/aisiadotca/succ',    emoji: '👉', label: 'Next' },
];

BobClubRenderer.draw = function(pane, dateElements) {
	pane.replaceChildren();

	var container = document.createElement('div');
	container.classList.add('bobs-club');

	BobClubRenderer.LINKS.forEach(function(link) {
		var a = document.createElement('a');
		a.href = link.href;
		a.rel = 'external';
		a.classList.add('bobs-club-card');

		var emoji = document.createElement('div');
		emoji.classList.add('card-emoji');
		emoji.innerText = link.emoji;
		a.appendChild(emoji);

		var info = document.createElement('div');
		info.classList.add('card-info');
		var header = document.createElement('header');
		header.innerText = link.label;
		info.appendChild(header);
		a.appendChild(info);

		container.appendChild(a);
	});

	pane.appendChild(container);

	var dateStr = new Date().toLocaleDateString('en', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	dateElements.forEach(function(el) { el.innerText = dateStr; });
};
