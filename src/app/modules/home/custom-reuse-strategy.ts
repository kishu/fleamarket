import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandle: DetachedRouteHandle = null;

  constructor() { }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.group('shouldReuseRoute');
    // console.log(future, curr);
    // if (future && future.routeConfig) {
    //   console.log(JSON.stringify(future.routeConfig.path));
    // }
    // if (curr && curr.routeConfig) {
    //   console.log(JSON.stringify(curr.routeConfig.path));
    // }
    // console.log('return', future.routeConfig === curr.routeConfig);
    // console.groupEnd();
    return future.routeConfig === curr.routeConfig;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // console.group('shouldAttach');
    // console.log(route);
    // if (route && route.routeConfig) {
    //   console.log('path', JSON.stringify(route.routeConfig.path));
    //   console.log('storedHandle', this.storedHandle);
    // }
    // console.log('return', route.routeConfig.path === '' && !!this.storedHandle);
    // console.groupEnd();
    return route && route.routeConfig.path === '' && !!this.storedHandle;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // console.group('retrieve');
    // console.log(route);
    if (route && route.routeConfig) {
      // console.log('path', JSON.stringify(route.routeConfig.path));
      // console.log('storedHandle', this.storedHandle);
      if (route.routeConfig.path === '' && this.storedHandle !== null) {
        // console.log('return', this.storedHandle);
        // console.groupEnd();
        return this.storedHandle;
      }
    }
    // console.log('return', null);
    // console.groupEnd();
    // return this.storedHandle;
    return null;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // console.group('shouldDetach');
    // console.log(route);
    // if (route && route.routeConfig) {
    //   console.log('path', JSON.stringify(route.routeConfig.path));
    //   console.log('storedHandle', this.storedHandle);
    // }
    // console.log('reture', route && route.routeConfig.path === '');
    // console.groupEnd();
    return route && route.routeConfig.path === '';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // console.group('store');
    // console.log(route);
    // console.log(handle);
    // if (route && route.routeConfig) {
    //   console.log('path', JSON.stringify(route.routeConfig.path));
    //   console.log('detachedRouteHandle', handle);
    // }

    this.storedHandle = handle;
    // console.log('storedHandle', this.storedHandle);
    // console.groupEnd();
  }

}
