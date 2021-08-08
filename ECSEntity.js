class ECSEntity extends Base {
  constructor(app) {
    super(app);
    this.eid = Base.getUUID();
    this.components = [];
    this.typenames = [];
  }

  getComponent(typename) {
    let found = this.components.find(c => c.typename == typename);
    if (!found) {
      throw new Error('ECSEntity::getComponent(): Entity has not ' + typename);
    }

    return found;
  }

  addComponent(component) {
    let found = this.typenames.find(t => t == component.typename);
    if (found) {
      throw new Error('ECSEntity::addComponent(): Entity already has ' + component.typename);
    }

    this.components.push(component);
    this.typenames.push(component.typename);
    this.emit('E_COMPONENT_CHANGED', { entity: this });
  }

  removeComponent(typename) {
    let found = this.typenames.find(t => t == typename);
    if (found) {
      throw new Error('ECSEntity::removeComponent(): Entity has not ' + typename);
    }

    this.components.splice(this.typenames.indexOf(typename), 1);
    this.typenames.splice(this.typenames.indexOf(typename), 1);
    this.emit('E_COMPONENT_CHANGED', { entity: this });
  }

  clear() {
    this.components = [];
    this.typenames = [];
    this.emit('E_COMPONENT_CHANGED', { entity: this });
  }
}