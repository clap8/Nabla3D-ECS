class ECSManager extends Base {
  constructor(app) {
    super(app);
    this.entities = [];
    this.systems = [];
    this.entitiesChanged = [];
    this.lastEID = 0;
  }

  addEntity(entity) {
    Base.subscribeFrom(entity, this, 'E_COMPONENT_CHANGED', this.handleEntityComponentChanged);
    this.entities.push(entity);

    for (let system of this.systems) {
      if (system.isMatchingEntity(entity)) {
        system.bindEntity(entity);
      }
    }
  }

  getEntityFromEID(eid) {
    let found = this.entities.find(e => e.eid == eid);
    if (!found) {
      throw new Error('ECSManager::getEntityFromEID(): Entity not found');
    }

    return found;
  }

  removeEntity(entity) {
    let found = this.entities.find(e => e == entity);
    if (!found) {
      throw new Error('ECSManager::removeEntity(): Entity not found');
    }

    Base.unsubscribeFrom(entity, this, 'E_COMPONENT_CHANGED');
    this.entities.splice(this.entities.indexOf(entity), 1);

    for (let system of this.systems) {
      system.entities.splice(system.entities.indexOf(entity), 1);
      if (system.entities.indexOf(entity) != -1) {
        system.unbindEntity(entity);
      }
    }
  }

  hasEntity(entity) {
    return this.entities.find(e => e == entity);
  }

  addSystem(system) {
    this.systems.push(system);
  }

  update() {
    for (let system of this.systems) {
      for (let entity of this.entitiesChanged) {
        let matching = system.isMatchingEntity(entity);
        if (matching && system.entities.indexOf(entity) == -1) {
          system.bindEntity(entity);
        }
        else if (!matching && system.entities.indexOf(entity) != -1) {
          system.unbindEntity(entity);
        }
      }

      system.update();
    }

    this.entitiesChanged = [];
  }

  handleEntityComponentChanged(data) {
    this.entitiesChanged.push(data.entity);
  }
}