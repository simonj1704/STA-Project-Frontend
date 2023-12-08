export function initSignOut() {
    localStorage.removeItem('username');
    localStorage.removeItem('token')
    localStorage.removeItem('roles')
    window.router.navigate("/#")
}