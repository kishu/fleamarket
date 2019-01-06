import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

// eslint-disable-next-line no-console
export class CustomReuseStrategy implements RouteReuseStrategy {

  private storedHandle: DetachedRouteHandle;
  private canStored = false;

  constructor() { }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    console.debug('CustomReuseStrategy:shouldDetach',
      this.getPath(route), route);
    // console.log('return ', route.routeConfig.path === '');

    return route.routeConfig.path === '';
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    console.debug('CustomReuseStrategy:store',
      this.getPath(route),
      route, handle);

    if (!route.routeConfig) return;
    if(route.routeConfig.loadChildren) return;

    if (route.routeConfig.path === '') {
      this.storedHandle = handle;
      console.log('stored handle');
    } else {
      console.log('stored null');
      this.storedHandle = null;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    console.debug('CustomReuseStrategy:shouldAttach',
      this.getPath(route),
      route);

    if (route.routeConfig.path === ':market' && this.storedHandle) {
      console.log('return', true);
      return true;
    } else {
      console.log('return', false);
      return false;
    }

    return false;
    //return route.routeConfig.path === ':market';
    // console.log('return', this.canStored && (this.getPath(route) === ':market/goods/:goodsId'));
    //
    // return this.canStored && (this.getPath(route) === ':market/goods/:goodsId');
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    console.debug('CustomReuseStrategy:retrieve',
      this.getPath(route),
      route);
    // console.log('this.storeHandle', this.storedHandle);
    // return this.storedHandle;

    if (!route.routeConfig) return null;
    if(route.routeConfig.loadChildren) return null;

    if (route.routeConfig.path === ':market' &&
      this.storedHandle) {
      console.log('retrieve stored handle');
      return this.storedHandle;
    } else {
      console.log('return', null);
      return null;
    }

  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // console.debug('CustomReuseStrategy:shouldReuseRoute', future, curr);
    console.debug('CustomReuseStrategy:shouldReuseRoute',
      JSON.stringify(this.getPath(future)),
      JSON.stringify(this.getPath(curr)));
    // if (this.getPath(future) === '' &&
    //   this.getPath(curr) === ':market/goods/:goodsId') {
    //   this.canStored = true;
    //   console.log('canStored', this.canStored);
    // } else {
    //   this.canStored = false;
    // }

    // return true;?
    console.log('return', future.routeConfig === curr.routeConfig);
    return future.routeConfig === curr.routeConfig;
  }

  private getPath(route: ActivatedRouteSnapshot): string | null {
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path;
    }
    return null;
  }

}
