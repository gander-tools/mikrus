export interface userModel {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class userService {
  private models: userModel[] = [];

  create(name: string): userModel {
    const model: userModel = {
      id: Date.now(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.models.push(model);
    return model;
  }

  findAll(): userModel[] {
    return this.models;
  }

  findById(id: number): userModel | undefined {
    return this.models.find(model => model.id === id);
  }
}
