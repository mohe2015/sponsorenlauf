import React, { useContext } from "react";
import { LoadingContext } from '../LoadingContext'
import { ClassRunnersListComponent } from "./ClassRunnersListComponent";

export function ClassRunnersList() {
  const loading = useContext(LoadingContext)

  return (
   <>
    { loading ? <div>Wird geladen...</div> : <ClassRunnersListComponent /> }
  </>
  )
}