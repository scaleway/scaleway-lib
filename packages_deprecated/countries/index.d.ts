export interface Country {
  name: string
  dial_code: string
  code: string
  flag: string
}

export type Countries = Country[]

export interface SubDivision {
  code: string
  country_code: string
  name: string
  parent_code: string | null
  type: string
}

export type SubDivisions = SubDivision[]

declare const List: Countries
export default List

declare module './subdivisions/*.json' {
  const SubDivisionList: SubDivisions
  export default SubDivisionList
}
