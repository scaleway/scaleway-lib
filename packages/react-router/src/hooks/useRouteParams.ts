import type { Region, Zone } from '@scaleway/sdk-client'
import { useParams } from 'react-router-dom'
import type { RouteAny } from '../helpers/route'
import type { ExtractRouteParams } from '../helpers/types'

type OverrideLocationTypes<Obj> = { [K in keyof Obj]: K extends 'region' ? Region : K extends 'zone' ? Zone : Obj[K] }

export function useRouteParams<Route extends RouteAny = RouteAny>(
  // oxlint-disable-next-line no-unused-vars
  _route: Route,
): OverrideLocationTypes<ExtractRouteParams<Route['path']>> {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return useParams() as OverrideLocationTypes<ExtractRouteParams<Route['path']>>
}
