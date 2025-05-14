import Sequelize from "sequelize";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
}

// Object.assign(Sequelize.Model, {
//   upsert: (data) => {
//     const attributes = this.constructor.tableAttributes;
//     const associations = this.constructor.associations;

//     console.log(this.constructor());
//     console.log(associations);
//   },
// });

Sequelize.Model.prototype.upsertAll = function async(data) {
  const singleTypes = ["HasOne", "BelongsTo"];
  const multipleTypes = ["HasMany", "BelongsToMany"];

  const parse = async (model, data, parent) => {
    let instance = await getInstance(model, data);
    let attributes = model.tableAttributes;
    let associations = model.associations;

    for (let x in attributes) {
      if (data.hasOwnProperty(x)) {
        // TODO Type checking, maybe excluding certain fields
        instance[x] = data[x];
      }
    }

    if (!parent) {
      await instance.save();
    } else {
      let shouldCreate = await isNew(parent, instance);
      if (shouldCreate) {
        instance = await add(parent, instance);
      } else {
        await instance.save();
      }
    }

    for (let x in associations) {
      if (!data[x]) {
        continue;
      }

      let relType = associations[x].associationType;

      if (multipleTypes.includes(relType)) {
        // let deletes = [];
        // let updates = [];
        // let creates = [];

        let existing = await getExisting(instance, associations[x]);
        for (let i = 0; i < existing.length; i++) {
          let current = existing[i];
          if (isDeleted(associations[x].target, current, data[x])) {
            await removeItem(instance, current, associations[x]);
            // deletes.push(e);
          }
        }

        for (let i = 0; i < data[x].length; i++) {
          let child = await parse(associations[x].target, data[x][i], instance);
          // if (exists(existing, child, associations[x])) {
          //   updates.push(child);
          //   // await child.save();
          // } else {
          //   creates.push(child);
          //   // await addItem(instance, child, associations[x]);
          // }
        }

        // console.log(x);
        // console.log("DELETES:", deletes);
        // console.log("UPDATES:", updates);
        // console.log("CREATES:", creates);
      } else {
        console.log(associations[x].accessors);
        // if (!!data[x]) {
        //   let child = parse(associations[x].target, data[x])
        // } else {

        // }
      }
    }

    return instance;
  };

  const getPrimaryKeys = (model) => {
    return Object.keys(model.tableAttributes).filter((attr) => {
      return model.tableAttributes[attr].primaryKey;
    });
  };

  const getInstance = async (model, data) => {
    let keys = getPrimaryKeys(model);
    let filters = keys.reduce((a, c) => {
      a[c] = data[c];
      return a;
    }, {});

    let instance = await model.findOne({ where: filters });
    return !!instance ? instance : new model();
  };

  const getExisting = (instance, association) => {
    let method = association.accessors.get;
    return instance[method]();
  };

  const exists = (existing, child, association) => {
    let keys = getPrimaryKeys(association.target);
    let doesExist = existing.find((obj) => {
      return keys.every((key) => {
        return obj[key] === child[key];
      });
    });

    return !!doesExist;
  };

  const isNew = async (parent, child) => {
    let associations = parent.constructor.associations;
    let match = Object.keys(associations).find((key) => {
      return associations[key].target === child.constructor;
    });
    let association = associations[match];
    let method = association.accessors.get;
    let existing = await parent[method]();

    let keys = getPrimaryKeys(association.target);
    let exists = existing.find((obj) => {
      return keys.every((key) => {
        return obj[key] === child[key];
      });
    });

    return !exists;
  };

  const isDeleted = (model, instance, data) => {
    let keys = getPrimaryKeys(model);
    let existing = data.find((obj) => {
      return keys.every((key) => {
        return obj[key] === instance[key];
      });
    });

    return !existing;
  };

  const removeItem = (instance, child, association) => {
    let method = association.accessors.remove;
    if (!!method) {
      return instance[method](child);
    }
  };

  const createItem = (instance, child, association) => {
    let method = association.accessors.create;

    if (!!method) {
      return instance[method](child.get({ plain: true }));
    }
  };

  const add = (parent, child) => {
    let associations = parent.constructor.associations;
    let match = Object.keys(associations).find((key) => {
      return associations[key].target === child.constructor;
    });
    let association = associations[match];
    // TODO: split between add and create?
    return createItem(parent, child, association);
  };

  parse(this.constructor, data);
};

export default Sequelize.Model;
