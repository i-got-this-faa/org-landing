export const theme = $state({
	isDark: true,
	toggle() {
		theme.isDark = !theme.isDark;
	}
});
