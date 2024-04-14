// check login status from login object in session storage
function checkLoginStatus({ path = './' }) {
	console.log(path);
	const loginObj = sessionStorage.getItem('login');
	if (loginObj) {
		const loginObject = JSON.parse(loginObj);
		if (!loginObject.loggedIn) {
			window.location.href = `${path}login.html`;
		}
	} else {
		window.location.href = `${path}login.html`;
	}
}

export { checkLoginStatus };
