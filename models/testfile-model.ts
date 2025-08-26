export interface testfileModel {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class testfileService {
  private models: testfileModel[] = [];

  create(name: string): testfileModel {
    const model: testfileModel = {
      id: Date.now(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.models.push(model);
    return model;
  }

  findAll(): testfileModel[] {
    return this.models;
  }

  findById(id: number): testfileModel | undefined {
    return this.models.find(model => model.id === id);
  }
}
