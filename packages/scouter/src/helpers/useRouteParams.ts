import type { Region, Zone } from '@scaleway/sdk-client'
import type { RouteParams } from 'regexparam'
import { useParams } from '../useParams'
import type { RouteObjAny } from './route'

type OverrideLocationTypes<Obj> = { [K in keyof Obj]: K extends 'region' ? Region : K extends 'zone' ? Zone : Obj[K] }

export function useRouteParams<Route extends RouteObjAny = RouteObjAny>(
  // oxlint-disable-next-line no-unused-vars
  _route: Route,
): OverrideLocationTypes<RouteParams<Route['path']>> {
  return useParams() as OverrideLocationTypes<RouteParams<Route['path']>>
}
