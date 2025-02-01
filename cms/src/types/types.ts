export type Class = {
    id: string
    name: string
  }
  
export type SCP = {
    id: string
    scpNumber: number
    containmentProcedures: string
    description: string
    addenda?: string | null
    createdAt: Date
    objectClass: Class
  }
  
  export type CreateSCPInput = {
    scpNumber: number
    containmentProcedures: string
    description: string
    addenda?: string | null
    objectClassId: string
  }