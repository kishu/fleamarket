import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedHandle: DetachedRouteHandle = null;

  constructor() { }

  componentName(route: ActivatedRouteSnapshot): string | null {
    if ( route && route.component && typeof route.component !== 'string') {
      return route.component.name;
    } else {
      return null;
    }
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    console.group('shouldReuseRoute');
    console.log(future.routeConfig === curr.routeConfig);
    console.log('future', future, 'curr', curr);
    // if (future && future.routeConfig) {
    //   console.log(JSON.stringify(future.routeConfig.path));
    // }
    // if (curr && curr.routeConfig) {
    //   console.log(JSON.stringify(curr.routeConfig.path));
    // }
    // console.log('return', future.routeConfig === curr.routeConfig);
    console.groupEnd();
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

    // console.log('return', true);
    // console.groupEnd();
    // console.log('return', false);
    // console.groupEnd();
    return (this.componentName(route) === 'HomeComponent' && !!this.storedHandle);

  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // console.group('retrieve');
    // console.log(route);
    // if (this.componentName(route) === 'HomeComponent' && this.storedHandle !== null) {
    //   // console.log('component', route.component.name as string);
    //   // console.log('storedHandle', this.storedHandle);
    //   // console.log('return', this.storedHandle);
    //   // console.groupEnd();
    //   return this.storedHandle;
    // } else {
    //   // console.log('return', null);
    //   // console.groupEnd();
    //   // return this.storedHandle;
    //   return null;
    // }
    return (this.componentName(route) === 'HomeComponent' && this.storedHandle !== null) ?
      this.storedHandle :
      null;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // console.group('shouldDetach');
    // console.log(route);
    // // if (route && route.routeConfig) {
    // //   console.log('path', JSON.stringify(route.routeConfig.path));
    // //   console.log('storedHandle', this.storedHandle);
    // // }
    // console.log('return', (route && route.component && route.component.name === 'HomeComponent'));

    // if (route && route.component && route.component.name === 'HomeComponent') {
    //   // console.log('return', true);
    //   // console.groupEnd();
    //   return true;
    // } else {
    //   // console.log('return', false);
    //   // console.groupEnd();
    //   return false;
    // }

    return (this.componentName(route) === 'HomeComponent');
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // console.group('store');
    // console.log(route);
    // console.log(handle);
    // if (route && route.routeConfig) {
    //   console.log('path', JSON.stringify(route.routeConfig.path));
    //   console.log('detachedRouteHandle', handle);
    // }

    if (this.componentName(route) === 'HomeComponent') {
      this.storedHandle = handle;
      // console.log('storedHandle', this.storedHandle);
    }
    // else {
    //   console.log('storedHandle', this.storedHandle);
    // }

    // console.groupEnd();
  }

}
