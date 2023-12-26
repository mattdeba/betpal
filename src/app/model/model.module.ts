import { NgModule } from '@angular/core';
import { RestDataSource } from './rest.datasource';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  imports: [HttpClientModule],
  providers: [RestDataSource],
})
export class ModelModule {}
