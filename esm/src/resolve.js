import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { fromPromise } from 'rxjs/observable/fromPromise';
export function resolve(resolver, state) {
    return resolveNode(resolver, state._root).map(_ => state);
}
function resolveNode(resolver, node) {
    if (node.children.length === 0) {
        return fromPromise(resolveComponent(resolver, node.value).then(factory => {
            node.value._resolvedComponentFactory = factory;
            return node.value;
        }));
    }
    else {
        const c = node.children.map(c => resolveNode(resolver, c).toPromise());
        return forkJoin(c).map(_ => resolveComponent(resolver, node.value).then(factory => {
            node.value._resolvedComponentFactory = factory;
            return node.value;
        }));
    }
}
function resolveComponent(resolver, snapshot) {
    if (snapshot.component && snapshot._routeConfig) {
        return resolver.resolveComponent(snapshot.component);
    }
    else {
        return Promise.resolve(null);
    }
}
//# sourceMappingURL=resolve.js.map