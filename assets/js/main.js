// check login status from login object in session storage
function checkLoginStatus({ path = './' }) {
	const { origin } = window.location;
	const loginObj = sessionStorage.getItem('login');
	if (loginObj) {
		const loginObject = JSON.parse(loginObj);
		if (!loginObject.loggedIn) {
			window.location.href = `${origin}/pages/auth/login.html`;
		}
	} else {
		window.location.href = `${origin}/pages/auth/login.html`;
	}
}

export { checkLoginStatus };
