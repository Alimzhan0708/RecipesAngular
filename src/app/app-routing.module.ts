import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeAddedComponent } from './recipes/recipe-added/recipe-added.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeStartComponent } from './recipes/recipe-start/recipe-start.component';
import { RecipesResolver } from './recipes/recipes-resolver.service';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'recipes', pathMatch: 'full'},
  {path: 'recipes', component: RecipesComponent, children: [
    {path: '', component: RecipeStartComponent},
    {path: 'new', component: RecipeAddedComponent},
    {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolver]},
    {path: ':id/edit', component: RecipeAddedComponent, resolve: [RecipesResolver]},

  ]},
  {path: 'shopping-list', component: ShoppingListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
