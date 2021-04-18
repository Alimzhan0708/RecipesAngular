import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { RecipeAddedComponent } from "./recipe-added/recipe-added.component";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesResolver } from "./recipes-resolver.service";
import { RecipesComponent } from "./recipes.component";

const Routes: Routes = [
  {path: '', canActivate: [AuthGuard], component: RecipesComponent, children: [
    {path: '', component: RecipeStartComponent},
    {path: 'new', component: RecipeAddedComponent},
    {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolver]},
    {path: ':id/edit', component: RecipeAddedComponent, resolve: [RecipesResolver]},
  ]},
]

@NgModule({
  imports: [RouterModule.forChild(Routes)],
  exports: [RouterModule]
})

export class RecipesRoutingModule {

}
