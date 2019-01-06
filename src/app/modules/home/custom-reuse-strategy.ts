import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandle: DetachedRouteHandle = null;

  constructor() { }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.debug('shouldDetach',
      route && JSON.stringify(route.routeConfig.path),
      route && route.routeConfig.path === '');
    return route && route.routeConfig.path === '';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.debug('store',
      route && JSON.stringify(route.routeConfig.path),
      handle);
    this.storedHandle = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.debug('shouldAttach',
      route && JSON.stringify(route.routeConfig.path),
      route && route.routeConfig.path === '' && !!this.storedHandle);
    return route && route.routeConfig.path === '' && !!this.storedHandle;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    console.debug('retrieve',
      route && route.routeConfig && JSON.stringify(route.routeConfig.path),
      this.storedHandle);
    return this.storedHandle;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if ( (future && future.routeConfig && curr && curr.routeConfig) &&
      (curr.routeConfig.path !== ':market/goods/:goodsId') &&
      (future.routeConfig.path === '') ) {
      console.debug('shouldReuseRoute', 'set null');
      this.storedHandle = null;
    }

    return future.routeConfig === curr.routeConfig;
  }

}
