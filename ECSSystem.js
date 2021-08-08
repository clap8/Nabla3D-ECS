class ECSSystem extends Base {
  constructor(app) {
    super(app);
    this.entities = [];
    this.requiredComponentTypenames = [];
  }

  bindEntity(entity) {
    if (this.entities.indexOf(entity) != -1) {
      throw new Error('ECSSystem::bindEntity(): Entity already exist in this system');
    }

    this.entities.push(entity);
  }

  unbindEntity(entity) {
    if (this.entities.indexOf(entity) == -1) {
      throw new Error('ECSSystem::unbindEntity(): Entity not exist in this system');
    }

    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  addRequiredComponentTypename(typename) {
    this.requiredComponentTypenames.push(typename);
  }

  isMatchingEntity(entity) {
    let match = true;
    for (let rt of this.requiredComponentTypenames) {
      match = entity.typenames.indexOf(rt) != -1 && match;
    }

    return match;
  }

  update() {
    this.onBeforeUpdate();
    this.entities.forEach(entity => this.onUpdate(entity));
    this.onAfterUpdate();
  }

  onBeforeUpdate() {
    // virtual method called during before update phase !
  }

  onUpdate(entity) {
    // virtual method called during update phase !
  }

  onAfterUpdate() {
    // virtual method called during after update phase !
  }
}