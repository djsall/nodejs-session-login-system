function elById(id) {
	return document.getElementById(id);
}
elById("signupBtn").addEventListener('click', () => {
	document.location.replace("/signup");
});
