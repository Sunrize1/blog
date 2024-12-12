export class Router {
  constructor() {
    this.routes = {};
    this.currentComponent = null;
    window.addEventListener('popstate', () => this.handleRoute());
    this.urlChangeListeners = [];
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
    const route = this.matchRoute(path);

    if (route) {
      document.getElementById('app').innerHTML = '';
      this.currentComponent = new route.component(route.params);
      this.currentComponent.mount(document.getElementById('app'));
      this.notifyUrlChange();
    } else {
      this.redirect('/');
    }
  }

  matchRoute(path) {
    const routes = Object.keys(this.routes);
    for (const route of routes) {
      const routeSegments = route.split('/');
      const pathSegments = path.split('/');

      if (routeSegments.length !== pathSegments.length) {
        continue;
      }

      const params = {};
      let match = true;

      for (let i = 0; i < routeSegments.length; i++) {
        if (routeSegments[i].startsWith(':')) {
          const paramName = routeSegments[i].slice(1);
          params[paramName] = pathSegments[i];
        } else if (routeSegments[i] !== pathSegments[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        return { component: this.routes[route], params };
      }
    }

    return null;
  }

  addUrlChangeListener(listener) {
    this.urlChangeListeners.push(listener);
  }

  notifyUrlChange() {
    this.urlChangeListeners.forEach(listener => listener());
  }
}