import Sequelize from "sequelize";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase().concat(string.slice(1));
}

// TODO: This seems like a bad way to add this method, but
// I can't figure out how to just extend the class otherwise

Sequelize.Model.prototype.upsertAll = function async(data) {
  const singleTypes = ["HasOne", "BelongsTo"];
  const multipleTypes = ["HasMany", "BelongsToMany"];

  const parse = async (transaction, model, data, parent) => {
    let instance = await getInstance(transaction, model, data);
    let attributes = model.tableAttributes;
    let associations = model.associations;

    for (let x in attributes) {
      if (data.hasOwnProperty(x)) {
        // TODO Type checking, maybe excluding certain fields
        instance[x] = data[x];
      }
    }

    if (!parent) {
      await instance.save({ transaction });
    } else {
      let shouldCreate = await isNew(transaction, parent, instance);
      if (shouldCreate) {
        instance = await add(transaction, parent, instance);
      } else {
        await instance.save({ transaction });
      }
    }

    for (let x in associations) {
      if (!data[x]) {
        continue;
      }

      let relType = associations[x].associationType;

      if (multipleTypes.includes(relType)) {
        let deletes = [];

        let existing = await getExisting(
          transaction,
          instance,
          associations[x],
        );
        for (let i = 0; i < existing.length; i++) {
          let current = existing[i];
          if (isDeleted(associations[x].target, current, data[x])) {
            await removeItem(transaction, instance, current, associations[x]);
          }
        }

        for (let i = 0; i < data[x].length; i++) {
          await parse(
            transaction,
            associations[x].target,
            data[x][i],
            instance,
          );
        }
      } else {
        if (!!data[x]) {
          await parse(transaction, associations[x].target, data[x], instance);
        } else {
          // Should remove this
        }
      }
    }

    return instance;
  };

  const getPrimaryKeys = (model) => {
    return Object.keys(model.tableAttributes).filter((attr) => {
      return model.tableAttributes[attr].primaryKey;
    });
  };

  const getInstance = async (transaction, model, data) => {
    let keys = getPrimaryKeys(model);
    let filters = keys.reduce((a, c) => {
      a[c] = data[c];
      return a;
    }, {});

    let instance = await model.findOne({ where: filters }, { transaction });
    return !!instance ? instance : new model();
  };

  const getExisting = (transaction, instance, association) => {
    let method = association.accessors.get;
    return instance[method]({ transaction });
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

  const isNew = async (transaction, parent, child) => {
    let associations = parent.constructor.associations;
    let match = Object.keys(associations).find((key) => {
      return associations[key].target === child.constructor;
    });
    let association = associations[match];
    let method = association.accessors.get;
    let existing = await parent[method]({ transaction });

    let keys = getPrimaryKeys(association.target);

    let exists = false;
    if (Array.isArray(existing)) {
      exists = existing.find((obj) => {
        return keys.every((key) => {
          return obj[key] === child[key];
        });
      });
    } else {
      exists = !!existing;
    }

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

  const removeItem = (transaction, instance, child, association) => {
    // TODO: pretty sure this could be replaced with a check if
    // the other side of the association is a BelongsTo, since
    // however I'm not sure that's always going to be the case
    if (association.options.onRemove === "DELETE") {
      return child.destroy({ transaction });
    } else {
      let method = association.accessors.remove;
      if (!!method) {
        return instance[method](child, { transaction });
      }
    }
  };

  const createItem = (transaction, instance, child, association) => {
    console.log("Is New Record:", child.isNewRecord);

    if (child.isNewRecord) {
      let method = association.accessors.create;
      if (!!method) {
        return instance[method](child.get({ plain: true, transaction }));
      }
    } else {
      let method = association.accessors.add;
      if (!!method) {
        return instance[method](child, { transaction });
      }
    }
  };

  const add = (transaction, parent, child) => {
    let associations = parent.constructor.associations;
    let match = Object.keys(associations).find((key) => {
      return associations[key].target === child.constructor;
    });
    let association = associations[match];
    // TODO: split between add and create?
    return createItem(transaction, parent, child, association);
  };

  return this.constructor.sequelize.transaction(async (t) => {
    return parse(t, this.constructor, data);
  });
};

export default Sequelize.Model;
