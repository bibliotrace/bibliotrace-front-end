class AdminMenuState {

    static setActiveMenu(menu) {
        localStorage.setItem("activeMenu", menu);
    }

    static getActiveMenu() {
        return localStorage.getItem("activeMenu");
    }

    static clearActiveMenu() {
        localStorage.removeItem("activeMenu");
    }

    static setActiveButton(button) {
        localStorage.setItem("activeButton", button);
    }

    static getActiveButton() {
        return localStorage.getItem("activeButton");
    }

    static clearActiveButton() {
        localStorage.removeItem("activeButton");
    }

}

export default AdminMenuState;
