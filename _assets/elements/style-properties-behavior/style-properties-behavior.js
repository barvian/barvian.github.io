// Style properties behavior
// =========================

window.Barvian = window.Barvian || {};
Barvian.StylePropertiesBehavior = {

  beforeRegister() {
    if (!this.observers) {
      this.observers = [];
    }
    if (!this.properties) {
      this.properties = {};
    }

    // For each style property...
    Object.keys(this.styleProperties).forEach(prop => {
      const observerName = `_${prop}Updated`;

      // ...add an observer function to the element
      this[observerName] = function(newValue) {
        this.customStyle[`--${this.is}-${prop}`] = newValue;
      };
      this.observers.push(`${observerName}(${prop})`);

      // ...add the style property to the normal properties
      this.properties[prop] = this.styleProperties[prop];
    });
  }

};
