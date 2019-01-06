import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';


// eslint-disable-next-line no-console
export class CustomReuseStrategy implements RouteReuseStrategy {
  private handlers: {[key: string]: DetachedRouteHandle} = {};

  constructor() {
    console.debug('CustomReuseStrategy:constructor');
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.debug('CustomReuseStrategy:shouldDetach', route);
    return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.debug('CustomReuseStrategy:store', route, handle);

    // this.handlers[route.url.join('/') || route.parent.url.join('/')] = handle;
    this.handlers[route.routeConfig.path] = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.debug('CustomReuseStrategy:shouldAttach', route);

    // return !!this.handlers[url];
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path];

  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    console.debug('CustomReuseStrategy:retrieve', route);

    if (!route.routeConfig) return null;
    return this.handlers[route.routeConfig.path];

    // return this.handlers[route.url.join('/') || route.parent.url.join('/')];
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
    return future.routeConfig === curr.routeConfig;
  }

}

