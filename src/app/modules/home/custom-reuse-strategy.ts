import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandle: DetachedRouteHandle;

  constructor() { }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.routeConfig.path === '';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedHandle = (route.routeConfig.path === '') ? handle : null;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (route.routeConfig.path === '' && this.storedHandle) {
      return true;
    } else {
      return false;
    }
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.routeConfig.path === '' && this.storedHandle) {
      console.log('retrieve', this.storedHandle);
      return this.storedHandle;
    } else {
      return null;
    }
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

}
