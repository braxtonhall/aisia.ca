let osdTimeout;

const clearChannelOsd = () => {
	clearTimeout(osdTimeout);
	drawChannelOsd(null);
};

const showChannelOsd = (channel) => {
	if (!channel) return;
	drawChannelOsd(channel);
	clearTimeout(osdTimeout);
	osdTimeout = setTimeout(clearChannelOsd, 2000);
};
