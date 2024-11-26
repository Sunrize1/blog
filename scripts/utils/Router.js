export class Router {
    constructor() {
      this.routes = {};
      this.currentComponent = null;
      window.addEventListener('popstate', () => this.handleRoute());
    }
  
    addRoute(path, component) {
      this.routes[path] = component;
    }
  
    navigate(path) {
      history.pushState({}, '', path);
      this.handleRoute();
    }

    updateUrl(path) {
      history.pushState({}, '', path);
    }

    redirect(path) {
      history.replaceState({}, '', path);
      this.handleRoute();
  }
  
  handleRoute() {
    const path = window.location.pathname;
    const component = this.routes[path] || this.routes['/'];


    document.getElementById('app').innerHTML = '';
    this.currentComponent = new component();
    this.currentComponent.mount(document.getElementById('app'));
    }
}
  